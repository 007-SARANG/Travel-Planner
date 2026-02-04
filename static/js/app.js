/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🌍 TravelAI - Legendary Design JavaScript
 * Clean • Minimal • Elegant
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// 📌 State Management
// ═══════════════════════════════════════════════════════════════════════════

let sessionId = null;
let isTyping = false;
let currentTheme = localStorage.getItem('theme') || 'dark';
let currentCurrency = localStorage.getItem('currency') || 'INR';
let recognition = null;
let travelerCount = 1;

// Currency conversion rates (base: INR)
const currencyRates = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095
};

const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
};

// Base prices in INR
const basePrices = {
    flights: 15000,
    trains: 500,
    hotels: 2000,
    // Destination prices in INR
    destinations: {
        'Bali': 45000,
        'Paris': 85000,
        'Maldives': 120000,
        'Switzerland': 150000,
        'Dubai': 35000,
        'Tokyo': 95000
    }
};

// Loading messages
const loadingMessages = [
    "Finding the best options...",
    "Comparing prices across airlines...",
    "Discovering hidden gems...",
    "Checking availability...",
    "Crafting your itinerary...",
    "Analyzing weather patterns..."
];

const travelFacts = [
    "✨ Did you know? The average traveler visits 3 new countries per year!",
    "🌍 There are over 7,000 languages spoken around the world!",
    "✈️ The world's busiest airport is Hartsfield-Jackson in Atlanta!",
    "🏝️ Bali receives over 6 million tourists annually!",
    "🗼 The Eiffel Tower was meant to be temporary - only 20 years!",
    "🚂 Japan's bullet trains average just 0.9 seconds delay!",
    "🌊 The Maldives is the flattest country on Earth!"
];

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 Initialization
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCurrency();
    initEventListeners();
    initTravelOptions();
    initDestinationsCarousel();
    initVoiceRecognition();
    loadRecentSearches();
    console.log('✅ TravelAI initialized');
});

// ═══════════════════════════════════════════════════════════════════════════
// 💱 Currency Management
// ═══════════════════════════════════════════════════════════════════════════

function initCurrency() {
    const selector = document.getElementById('currencySelect');
    if (selector) {
        selector.value = currentCurrency;
        updateAllPrices();
    }
}

function handleCurrencyChange(newCurrency) {
    currentCurrency = newCurrency;
    localStorage.setItem('currency', newCurrency);
    updateAllPrices();
    
    // Show system message if chat is active
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer && chatContainer.children.length > 0) {
        addMessage(`Currency changed to ${currencySymbols[newCurrency]} ${newCurrency}. Future prices will be in ${newCurrency}.`, 'system');
    } else {
        showToast(`Currency changed to ${currencySymbols[newCurrency]} ${newCurrency}`, 'success');
    }
}

function convertPrice(priceInINR) {
    const rate = currencyRates[currentCurrency] || 1;
    const converted = Math.round(priceInINR * rate);
    return formatPrice(converted);
}

function formatPrice(amount) {
    const symbol = currencySymbols[currentCurrency] || '₹';
    if (currentCurrency === 'INR') {
        // Indian number formatting (lakhs, crores)
        return symbol + amount.toLocaleString('en-IN');
    }
    return symbol + amount.toLocaleString('en-US');
}

function updateAllPrices() {
    // Update feature card prices
    updateFeatureCardPrices();
    // Update destination card prices
    updateDestinationPrices();
}

function updateFeatureCardPrices() {
    // Flights card
    const flightsCard = document.querySelector('.flights-card .card-price');
    if (flightsCard) {
        flightsCard.textContent = `From ${convertPrice(basePrices.flights)}`;
        flightsCard.classList.add('price-updated');
        setTimeout(() => flightsCard.classList.remove('price-updated'), 300);
    }

    // Trains card
    const trainsCard = document.querySelector('.trains-card .card-price');
    if (trainsCard) {
        trainsCard.textContent = `From ${convertPrice(basePrices.trains)}`;
        trainsCard.classList.add('price-updated');
        setTimeout(() => trainsCard.classList.remove('price-updated'), 300);
    }

    // Hotels card
    const hotelsCard = document.querySelector('.hotels-card .card-price');
    if (hotelsCard) {
        hotelsCard.textContent = `From ${convertPrice(basePrices.hotels)}`;
        hotelsCard.classList.add('price-updated');
        setTimeout(() => hotelsCard.classList.remove('price-updated'), 300);
    }

    // Weather card (no price, but update text)
    const weatherCard = document.querySelector('.weather-card .card-price');
    if (weatherCard) {
        weatherCard.textContent = 'Live Updates';
    }
}

function updateDestinationPrices() {
    document.querySelectorAll('.destination-card').forEach(card => {
        const destination = card.dataset.destination;
        const priceEl = card.querySelector('.destination-price');
        
        if (destination && basePrices.destinations[destination]) {
            const price = convertPrice(basePrices.destinations[destination]);
            
            // Add price element if not exists
            if (!priceEl) {
                const info = card.querySelector('.destination-info');
                if (info) {
                    const priceSpan = document.createElement('span');
                    priceSpan.className = 'destination-price';
                    priceSpan.textContent = `From ${price}`;
                    info.insertBefore(priceSpan, info.querySelector('.explore-btn'));
                }
            } else {
                priceEl.textContent = `From ${price}`;
                priceEl.classList.add('price-updated');
                setTimeout(() => priceEl.classList.remove('price-updated'), 300);
            }
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 Theme Management
// ═══════════════════════════════════════════════════════════════════════════

function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const btn = document.getElementById('themeToggle');
    if (btn) {
        const icon = btn.querySelector('i');
        icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📡 Event Listeners
// ═══════════════════════════════════════════════════════════════════════════

function initEventListeners() {
    // Theme Toggle
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    // Currency Toggle
    document.getElementById('currencySelect')?.addEventListener('change', (e) => {
        handleCurrencyChange(e.target.value);
    });

    // Send Message
    const sendBtn = document.getElementById('sendBtn');
    const input = document.getElementById('messageInput');
    
    sendBtn?.addEventListener('click', handleSendMessage);
    input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Feature Cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.querySelector('h3')?.textContent;
            if (category) {
                document.getElementById('messageInput').value = `Show me ${category.toLowerCase()} options`;
                document.getElementById('messageInput').focus();
            }
        });
    });

    // Destination Cards
    document.querySelectorAll('.destination-card').forEach(card => {
        card.addEventListener('click', () => {
            const destination = card.dataset.destination;
            if (destination) {
                const msg = `Plan a trip to ${destination}`;
                document.getElementById('messageInput').value = msg;
                handleSendMessage();
            }
        });
    });

    // Explore Buttons
    document.querySelectorAll('.explore-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.destination-card');
            const destination = card?.dataset.destination;
            if (destination) {
                const msg = `Plan a trip to ${destination}`;
                document.getElementById('messageInput').value = msg;
                handleSendMessage();
            }
        });
    });

    // Back to Home
    document.getElementById('backToHome')?.addEventListener('click', showHome);

    // Reset/New Trip
    document.getElementById('resetBtn')?.addEventListener('click', resetSession);

    // History
    document.getElementById('historyToggle')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebarClose')?.addEventListener('click', closeSidebar);
    document.getElementById('sidebarOverlay')?.addEventListener('click', closeSidebar);

    // Travel Options Panel
    document.getElementById('optionsToggle')?.addEventListener('click', toggleOptions);

    // Traveler Count
    document.getElementById('travelerMinus')?.addEventListener('click', () => updateTravelers(-1));
    document.getElementById('travelerPlus')?.addEventListener('click', () => updateTravelers(1));

    // Trip Type - hide return date for one way
    document.getElementById('tripType')?.addEventListener('change', (e) => {
        const returnGroup = document.getElementById('returnDateGroup');
        if (returnGroup) {
            returnGroup.style.display = e.target.value === 'oneway' ? 'none' : 'block';
        }
    });

    // Clear History
    document.getElementById('clearHistory')?.addEventListener('click', clearRecentSearches);

    // Voice Button
    document.getElementById('voiceBtn')?.addEventListener('click', toggleVoice);

    // Follow-up Input Bar (in chat view)
    document.getElementById('followUpInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleFollowUpMessage();
        }
    });

    document.getElementById('chatSendBtn')?.addEventListener('click', handleFollowUpMessage);
    
    // Chat Voice Button
    document.getElementById('chatVoiceBtn')?.addEventListener('click', () => {
        if (!recognition) {
            showToast('Voice not supported in this browser', 'error');
            return;
        }
        
        const btn = document.getElementById('chatVoiceBtn');
        if (btn?.classList.contains('recording')) {
            recognition.stop();
            btn.classList.remove('recording');
        } else {
            // Update recognition to use follow-up input
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('followUpInput').value = transcript;
                document.getElementById('chatVoiceBtn')?.classList.remove('recording');
            };
            recognition.start();
            btn?.classList.add('recording');
        }
    });
}

// Handle follow-up message from chat input bar
function handleFollowUpMessage() {
    const input = document.getElementById('followUpInput');
    const message = input?.value.trim();
    
    if (!message || isTyping) return;
    
    // Add message and send to backend
    addMessage(message, 'user');
    input.value = '';
    
    // Send with travel context
    const fullMessage = message + getTravelContext();
    sendMessage(fullMessage);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎤 Voice Recognition
// ═══════════════════════════════════════════════════════════════════════════

function initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('messageInput').value = transcript;
            document.getElementById('voiceBtn')?.classList.remove('recording');
        };

        recognition.onerror = () => {
            document.getElementById('voiceBtn')?.classList.remove('recording');
            showToast('Voice recognition error', 'error');
        };

        recognition.onend = () => {
            document.getElementById('voiceBtn')?.classList.remove('recording');
        };
    }
}

function toggleVoice() {
    if (!recognition) {
        showToast('Voice not supported in this browser', 'error');
        return;
    }

    const btn = document.getElementById('voiceBtn');
    if (btn?.classList.contains('recording')) {
        recognition.stop();
        btn.classList.remove('recording');
    } else {
        recognition.start();
        btn?.classList.add('recording');
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎠 Destinations Carousel
// ═══════════════════════════════════════════════════════════════════════════

function initDestinationsCarousel() {
    const carousel = document.getElementById('destinationsCarousel');
    const prevBtn = document.getElementById('destPrev');
    const nextBtn = document.getElementById('destNext');
    
    if (!carousel) return;

    const scrollAmount = 300;

    prevBtn?.addEventListener('click', () => {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn?.addEventListener('click', () => {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// ✈️ Travel Options
// ═══════════════════════════════════════════════════════════════════════════

function initTravelOptions() {
    const dateInput = document.getElementById('travelDate');
    const returnInput = document.getElementById('returnDate');

    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
        dateInput.min = new Date().toISOString().split('T')[0];

        dateInput.addEventListener('change', () => {
            if (returnInput) {
                returnInput.min = dateInput.value;
                const returnDate = new Date(dateInput.value);
                returnDate.setDate(returnDate.getDate() + 7);
                returnInput.value = returnDate.toISOString().split('T')[0];
            }
        });
    }

    if (returnInput) {
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 8);
        returnInput.value = returnDate.toISOString().split('T')[0];
    }
}

function toggleOptions() {
    document.querySelector('.travel-options-panel')?.classList.toggle('open');
}

function updateTravelers(delta) {
    travelerCount = Math.max(1, Math.min(10, travelerCount + delta));
    const countEl = document.getElementById('travelerCount');
    if (countEl) {
        countEl.textContent = travelerCount;
        countEl.classList.add('updated');
        setTimeout(() => countEl.classList.remove('updated'), 200);
    }
}

function getTravelContext() {
    const date = document.getElementById('travelDate')?.value;
    const returnDate = document.getElementById('returnDate')?.value;
    const tripType = document.getElementById('tripType')?.value || 'roundtrip';
    const budget = document.getElementById('budgetRange')?.value || 'any';
    const currency = document.getElementById('currencySelect')?.value || 'INR';

    let context = [];
    
    if (date) context.push(`Travel date: ${date}`);
    if (tripType === 'roundtrip' && returnDate) context.push(`Return date: ${returnDate}`);
    if (travelerCount > 1) context.push(`Travelers: ${travelerCount}`);
    if (tripType) context.push(`Trip type: ${tripType}`);
    if (budget !== 'any') context.push(`Budget preference: ${budget}`);
    context.push(`Currency: ${currency}`);

    return context.length > 0 ? `\n[Travel preferences: ${context.join(', ')}]` : '';
}

// ═══════════════════════════════════════════════════════════════════════════
// 💬 Chat Functionality
// ═══════════════════════════════════════════════════════════════════════════

function handleSendMessage() {
    const input = document.getElementById('messageInput');
    const message = input?.value.trim();
    
    if (!message || isTyping) return;
    
    // Save to recent searches
    saveRecentSearch(message);
    
    // Show chat view
    showChat();
    
    // Add message with travel context
    const fullMessage = message + getTravelContext();
    addMessage(message, 'user');
    input.value = '';
    
    // Send to backend
    sendMessage(fullMessage);
}

async function sendMessage(message) {
    showLoading();
    updateProgress(1);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        updateProgress(2);
        
        if (!response.ok) throw new Error('Network error');

        const data = await response.json();
        
        updateProgress(3);
        
        if (data.error) {
            addMessage(data.error, 'assistant');
        } else {
            sessionId = data.session_id;
            updateProgress(4);
            setTimeout(() => {
                addMessage(data.response, 'assistant');
                hideLoading();
                hideProgress();
            }, 300);
            return;
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, there was an error. Please try again.', 'assistant');
    }

    hideLoading();
    hideProgress();
}

function addMessage(content, role) {
    const container = document.getElementById('chatContainer');
    if (!container) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (role === 'assistant') {
        // Typewriter effect for assistant messages
        contentDiv.classList.add('typing');
        messageDiv.appendChild(contentDiv);
        container.appendChild(messageDiv);
        
        typewriterEffect(contentDiv, content, () => {
            contentDiv.classList.remove('typing');
        });
    } else {
        // Instant display for user messages
        contentDiv.innerHTML = formatMessage(content);
        messageDiv.appendChild(contentDiv);
        container.appendChild(messageDiv);
    }
    
    container.scrollTop = container.scrollHeight;
}

// Typewriter effect function
function typewriterEffect(element, text, callback) {
    const formattedText = formatMessage(text);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formattedText;
    const plainText = tempDiv.textContent || tempDiv.innerText;
    
    let index = 0;
    const speed = 0.2; //ms per character (5x faster)
    const container = document.getElementById('chatContainer');
    
    // Track if user has scrolled up manually
    let userScrolledUp = false;
    const scrollThreshold = 100; // pixels from bottom to consider "at bottom"
    
    container.addEventListener('scroll', function checkScroll() {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < scrollThreshold;
        userScrolledUp = !isNearBottom;
    });
    
    function type() {
        if (index < plainText.length) {
            // Type 3 characters per frame (3x slower)
            const charsPerFrame = 3;
            index = Math.min(index + charsPerFrame, plainText.length);
            
            // Build HTML progressively to maintain formatting
            const partialText = plainText.substring(0, index);
            element.innerHTML = reconstructHTML(formattedText, partialText.length);
            
            // Only auto-scroll if user hasn't scrolled up
            if (!userScrolledUp) {
                container.scrollTop = container.scrollHeight;
            }
            
            setTimeout(type, 1);
        } else {
            // Finished typing - show full formatted text
            element.innerHTML = formattedText;
            if (callback) callback();
        }
    }
    
    type();
}

// Reconstruct HTML showing only first N characters
function reconstructHTML(html, charCount) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    let count = 0;
    
    function truncate(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const remaining = charCount - count;
            if (remaining <= 0) {
                node.textContent = '';
            } else if (node.textContent.length > remaining) {
                node.textContent = node.textContent.substring(0, remaining);
                count = charCount;
            } else {
                count += node.textContent.length;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const child of Array.from(node.childNodes)) {
                if (count >= charCount) {
                    child.remove();
                } else {
                    truncate(child);
                }
            }
        }
    }
    
    truncate(tempDiv);
    return tempDiv.innerHTML;
}

function formatMessage(text) {
    // Convert markdown tables to HTML tables
    text = text.replace(/\n?\|(.+)\|\n\|[-:| ]+\|\n((?:\|.+\|\n?)+)/g, (match, header, body) => {
        const headerCells = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
        const bodyRows = body.trim().split('\n').map(row => {
            const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        return `<table class="md-table"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    });
    
    // Convert headers (remove # and make bold/larger)
    text = text.replace(/^### (.+)$/gm, '<div class="md-h3">$1</div>');
    text = text.replace(/^## (.+)$/gm, '<div class="md-h2">$1</div>');
    text = text.replace(/^# (.+)$/gm, '<div class="md-h1">$1</div>');
    
    // Convert markdown links [text](url) BEFORE other formatting
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // Convert other markdown formatting
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>')
        .replace(/(^|\s)(\d+\.\s)/g, '$1<br>$2')
        // Only convert bare URLs (not already in an href)
        .replace(/(?<!href=")(https?:\/\/[^\s<\)]+?)(?=[.,;:!?\s<]|$)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔄 Progress & Loading
// ═══════════════════════════════════════════════════════════════════════════

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('active');
        rotateLoadingMessages();
    }
    isTyping = true;
}

function hideLoading() {
    document.getElementById('loadingOverlay')?.classList.remove('active');
    isTyping = false;
}

let loadingInterval;
function rotateLoadingMessages() {
    const textEl = document.getElementById('loadingText');
    if (!textEl) return;

    let index = 0;
    clearInterval(loadingInterval);
    loadingInterval = setInterval(() => {
        textEl.textContent = loadingMessages[index];
        index = (index + 1) % loadingMessages.length;
    }, 2000);
}

function updateProgress(step) {
    const progress = document.getElementById('aiProgress');
    if (!progress) return;

    progress.classList.add('active');
    
    progress.querySelectorAll('.progress-step').forEach((stepEl, i) => {
        stepEl.classList.remove('active', 'completed');
        if (i + 1 < step) stepEl.classList.add('completed');
        if (i + 1 === step) stepEl.classList.add('active');
    });
}

function hideProgress() {
    const progress = document.getElementById('aiProgress');
    if (progress) {
        setTimeout(() => progress.classList.remove('active'), 1000);
    }
    clearInterval(loadingInterval);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🏠 View Management
// ═══════════════════════════════════════════════════════════════════════════

function showChat() {
    document.getElementById('heroSection')?.classList.add('hidden');
    document.getElementById('chatWrapper')?.classList.add('active');
    document.querySelector('.travel-options-panel')?.classList.add('hidden');
}

function showHome() {
    document.getElementById('heroSection')?.classList.remove('hidden');
    document.getElementById('chatWrapper')?.classList.remove('active');
    document.querySelector('.travel-options-panel')?.classList.remove('hidden');
}

async function resetSession() {
    try {
        await fetch('/api/reset', { method: 'POST' });
    } catch (error) {
        console.error('Reset error:', error);
    }

    sessionId = null;
    document.getElementById('chatContainer').innerHTML = '';
    showHome();
    showToast('New trip started!', 'success');
}

// ═══════════════════════════════════════════════════════════════════════════
// 📜 Sidebar
// ═══════════════════════════════════════════════════════════════════════════

function toggleSidebar() {
    document.getElementById('tripSidebar')?.classList.toggle('open');
    document.getElementById('sidebarOverlay')?.classList.toggle('open');
}

function closeSidebar() {
    document.getElementById('tripSidebar')?.classList.remove('open');
    document.getElementById('sidebarOverlay')?.classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════════════════
// 🕐 Recent Searches
// ═══════════════════════════════════════════════════════════════════════════

function loadRecentSearches() {
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const container = document.getElementById('recentSearches');
    const list = document.getElementById('recentList');

    if (searches.length === 0 || !container || !list) {
        if (container) container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    list.innerHTML = '';

    searches.slice(0, 5).forEach(search => {
        const item = document.createElement('span');
        item.className = 'recent-item';
        item.textContent = search.length > 40 ? search.substring(0, 40) + '...' : search;
        item.onclick = () => {
            document.getElementById('messageInput').value = search;
            handleSendMessage();
        };
        list.appendChild(item);
    });
}

function saveRecentSearch(query) {
    let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    searches = [query, ...searches.filter(s => s !== query)].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    loadRecentSearches();
}

function clearRecentSearches() {
    localStorage.removeItem('recentSearches');
    loadRecentSearches();
    showToast('History cleared', 'success');
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔔 Toast Notifications
// ═══════════════════════════════════════════════════════════════════════════

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎉 Export for global use
// ═══════════════════════════════════════════════════════════════════════════

window.TravelAI = {
    showToast,
    toggleTheme,
    resetSession
};
