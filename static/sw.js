// TravelAI Service Worker
const CACHE_NAME = 'travelai-v1';
const STATIC_CACHE = 'travelai-static-v1';
const DYNAMIC_CACHE = 'travelai-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/static/css/style.css',
    '/static/js/app.js',
    '/static/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('🚀 Service Worker: Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker: Activated');
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
                    .map(key => {
                        console.log('🗑️ Removing old cache:', key);
                        return caches.delete(key);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API calls - always go to network
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .catch(() => new Response(JSON.stringify({
                    error: 'You are offline. Please check your connection.'
                }), {
                    headers: { 'Content-Type': 'application/json' }
                }))
        );
        return;
    }

    // Cache-first strategy for static assets
    if (request.destination === 'style' || 
        request.destination === 'script' || 
        request.destination === 'font' ||
        request.destination === 'image') {
        event.respondWith(
            caches.match(request)
                .then(cached => {
                    if (cached) return cached;
                    return fetch(request).then(response => {
                        const clone = response.clone();
                        caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, clone));
                        return response;
                    });
                })
        );
        return;
    }

    // Network-first for HTML pages
    event.respondWith(
        fetch(request)
            .then(response => {
                const clone = response.clone();
                caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, clone));
                return response;
            })
            .catch(() => caches.match(request))
    );
});

// Background sync for offline trip saves
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-trips') {
        event.waitUntil(syncTrips());
    }
});

async function syncTrips() {
    console.log('🔄 Syncing trips...');
    // Implementation for syncing saved trips when back online
}

// Push notifications for price alerts
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const options = {
        body: data.body || 'Check out new travel deals!',
        icon: '/static/icons/icon-192.png',
        badge: '/static/icons/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        },
        actions: [
            { action: 'view', title: 'View Deal' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'TravelAI', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'view' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});
