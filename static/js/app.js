/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🌍 TravelAI - Ultra Premium Frontend Experience
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// 📌 State Management
// ═══════════════════════════════════════════════════════════════════════════

let sessionId = null;
let isTyping = false;
let currentTheme = 'dark';
let recognition = null;
let particles = [];

// Loading messages for fun facts
const loadingMessages = [
    "Searching for the best options...",
    "Comparing prices across 500+ airlines...",
    "Finding hidden travel gems...",
    "Checking availability in real-time...",
    "Crafting your perfect itinerary...",
    "Analyzing weather patterns...",
    "Discovering local experiences..."
];

const travelFacts = [
    "✨ Did you know? The average traveler visits 3 new countries per year!",
    "🌍 Fun fact: There are over 7,000 languages spoken around the world!",
    "✈️ The world's busiest airport is Hartsfield-Jackson in Atlanta!",
    "🏝️ Bali receives over 6 million tourists annually!",
    "🗼 The Eiffel Tower was supposed to be temporary - built for just 20 years!",
    "🌅 Iceland has no mosquitoes - perfect for outdoor adventures!",
    "🚂 Japan's bullet trains have a 0.9 second average delay per trip!",
    "🏔️ Mount Everest grows about 4mm every year!",
    "🦁 Singapore means 'Lion City' in Sanskrit!",
    "🌊 The Maldives is the flattest country on Earth!",
    "🎡 The London Eye takes 30 minutes for one full rotation!",
    "🗽 The Statue of Liberty was a gift from France in 1886!",
    "🐘 Thailand is home to over 300,000 elephants!",
    "🏰 There are over 25,000 castles in Germany!",
    "🍝 Italians consume about 28 kg of pasta per person yearly!"
];

// ═══════════════════════════════════════════════════════════════════════════
// 🎆 Particle System
// ═══════════════════════════════════════════════════════════════════════════

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = [
            'rgba(118, 75, 162, ',   // Purple
            'rgba(0, 242, 254, ',    // Cyan
            'rgba(245, 87, 108, ',   // Pink
            'rgba(255, 215, 0, '     // Gold
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color + this.opacity + ')';
        this.ctx.fill();
    }
}

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const particleCount = Math.min(100, Math.floor(window.innerWidth / 15));
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas));
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections between close particles
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(118, 75, 162, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎊 Confetti System
// ═══════════════════════════════════════════════════════════════════════════

class Confetti {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.color = this.getRandomColor();
        this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    }

    getRandomColor() {
        const colors = ['#667eea', '#764ba2', '#f5576c', '#4facfe', '#00f2fe', '#ffd700', '#fa709a'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.speedY += 0.1; // Gravity
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate((this.rotation * Math.PI) / 180);
        this.ctx.fillStyle = this.color;

        if (this.shape === 'rect') {
            this.ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
        } else {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    isOffScreen() {
        return this.y > this.canvas.height + 20;
    }
}

function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    
    let confettiPieces = [];
    for (let i = 0; i < 150; i++) {
        confettiPieces.push(new Confetti(canvas));
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces = confettiPieces.filter(c => !c.isOffScreen());
        
        confettiPieces.forEach(c => {
            c.update();
            c.draw();
        });

        if (confettiPieces.length > 0) {
            requestAnimationFrame(animateConfetti);
        }
    }

    animateConfetti();
}

// ═══════════════════════════════════════════════════════════════════════════
// 🌓 Theme Toggle
// ═══════════════════════════════════════════════════════════════════════════

function initTheme() {
    const savedTheme = localStorage.getItem('travelai-theme') || 'dark';
    setTheme(savedTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('travelai-theme', theme);
    
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.innerHTML = theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    showToast('info', `Switched to ${newTheme} mode`);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎤 Voice Input
// ═══════════════════════════════════════════════════════════════════════════

function initVoiceInput() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (!voiceBtn) return;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            voiceBtn.classList.add('listening');
            showToast('info', '🎤 Listening... Speak now!');
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            
            document.getElementById('messageInput').value = transcript;
        };

        recognition.onend = () => {
            voiceBtn.classList.remove('listening');
        };

        recognition.onerror = (event) => {
            voiceBtn.classList.remove('listening');
            showToast('error', 'Voice recognition failed. Please try again.');
        };

        voiceBtn.addEventListener('click', () => {
            if (voiceBtn.classList.contains('listening')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    } else {
        voiceBtn.style.display = 'none';
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔔 Toast Notifications
// ═══════════════════════════════════════════════════════════════════════════

function showToast(type, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.5s ease reverse forwards';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ═══════════════════════════════════════════════════════════════════════════
// ✨ Typing Effect
// ═══════════════════════════════════════════════════════════════════════════

function typeText(element, text, speed = 15) {
    return new Promise(resolve => {
        let i = 0;
        element.innerHTML = '';
        
        // Create cursor
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        
        function type() {
            if (i < text.length) {
                // Handle HTML tags - don't type them character by character
                if (text[i] === '<') {
                    const endTag = text.indexOf('>', i);
                    element.innerHTML += text.substring(i, endTag + 1);
                    i = endTag + 1;
                } else {
                    element.innerHTML += text[i];
                    i++;
                }
                element.appendChild(cursor);
                setTimeout(type, speed);
            } else {
                cursor.remove();
                resolve();
            }
        }
        
        type();
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 AI Progress Steps
// ═══════════════════════════════════════════════════════════════════════════

function updateProgress(step) {
    const progressContainer = document.getElementById('aiProgress');
    if (!progressContainer) return;

    const steps = progressContainer.querySelectorAll('.progress-step');
    
    steps.forEach((s, i) => {
        s.classList.remove('active', 'complete');
        if (i + 1 < step) {
            s.classList.add('complete');
        } else if (i + 1 === step) {
            s.classList.add('active');
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// 💬 Chat Functions
// ═══════════════════════════════════════════════════════════════════════════

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || isTyping) return;

    // Hide hero, show chat
    const heroSection = document.getElementById('heroSection');
    const chatWrapper = document.getElementById('chatWrapper');
    const aiProgress = document.getElementById('aiProgress');
    
    if (heroSection) heroSection.style.display = 'none';
    if (chatWrapper) chatWrapper.classList.add('active');
    if (aiProgress) aiProgress.classList.add('active');

    // Display user message
    appendMessage('user', message);
    input.value = '';
    
    // Save to recent searches
    saveRecentSearch(message);

    // Show loading and skeleton cards
    showLoading(true);
    showSkeletonCards();
    isTyping = true;

    // Start progress animation
    let progressStep = 1;
    const progressInterval = setInterval(() => {
        updateProgress(progressStep);
        progressStep = Math.min(progressStep + 1, 3);
    }, 2000);

    // Rotate loading messages
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        const loadingText = document.getElementById('loadingText');
        if (loadingText) {
            loadingText.textContent = loadingMessages[messageIndex % loadingMessages.length];
            messageIndex++;
        }
    }, 2500);

    // Rotate travel facts
    const factsElement = document.getElementById('loadingFacts');
    if (factsElement) {
        factsElement.innerHTML = `<p>${travelFacts[Math.floor(Math.random() * travelFacts.length)]}</p>`;
    }

    try {
        // Add timeout to prevent infinite loading
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
        
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message + getTravelContext(),
                session_id: sessionId
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        const data = await response.json();

        clearInterval(progressInterval);
        clearInterval(messageInterval);
        updateProgress(4); // Complete

        if (data.error) {
            appendMessage('bot', `Error: ${data.error}`);
            showToast('error', 'Something went wrong. Please try again.');
        } else {
            // Display response instantly (no slow typing)
            appendMessage('bot', data.response);
            
            if (data.session_id) {
                sessionId = data.session_id;
            }

            // Trigger confetti for successful trip plans!
            if (data.response.toLowerCase().includes('hotel') || 
                data.response.toLowerCase().includes('flight') ||
                data.response.toLowerCase().includes('trip')) {
                triggerConfetti();
                showToast('success', '🎉 Your travel plan is ready!');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        clearInterval(progressInterval);
        clearInterval(messageInterval);
        
        // Check if it was a timeout
        if (error.name === 'AbortError') {
            appendMessage('bot', 'Request timed out. The AI is taking too long. Please try a simpler query.');
            showToast('error', 'Request timed out after 60 seconds.');
        } else {
            appendMessage('bot', 'Sorry, something went wrong. Please try again.');
            showToast('error', 'Network error. Please check your connection.');
        }
    } finally {
        showLoading(false);
        hideSkeletonCards();
        isTyping = false;
        if (aiProgress) aiProgress.classList.remove('active');
    }
}

function appendMessage(type, content) {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (type === 'bot') {
        contentDiv.innerHTML = parseMarkdownLinks(sanitizeHTML(content));
    } else {
        contentDiv.textContent = content;
    }

    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);

    // Scroll to bottom
    setTimeout(() => {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

async function appendMessageWithTyping(type, content) {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);

    // Scroll to bottom
    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
    });

    // Type out the response
    const parsedContent = parseMarkdownLinks(sanitizeHTML(content));
    await typeText(contentDiv, parsedContent, 8);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔒 Security - HTML Sanitization
// ═══════════════════════════════════════════════════════════════════════════

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

function parseMarkdownLinks(text) {
    // Convert markdown links [text](url) to HTML <a> tags
    let parsed = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Preserve line breaks
    parsed = parsed.replace(/\n/g, '<br>');
    
    // Bold text **text**
    parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic text *text*
    parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Headers
    parsed = parsed.replace(/^### (.+)$/gm, '<h4>$1</h4>');
    parsed = parsed.replace(/^## (.+)$/gm, '<h3>$1</h3>');
    parsed = parsed.replace(/^# (.+)$/gm, '<h2>$1</h2>');
    
    return parsed;
}

function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) return;
    
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

async function resetChat() {
    // Reset session on server
    try {
        await fetch('/api/reset', { method: 'POST' });
    } catch (e) {
        console.log('Reset note:', e);
    }

    sessionId = null;
    
    const chatWrapper = document.getElementById('chatWrapper');
    const chatContainer = document.getElementById('chatContainer');
    const heroSection = document.getElementById('heroSection');
    const aiProgress = document.getElementById('aiProgress');
    
    if (chatContainer) chatContainer.innerHTML = '';
    if (chatWrapper) chatWrapper.classList.remove('active');
    if (aiProgress) aiProgress.classList.remove('active');
    if (heroSection) heroSection.style.display = 'block';
    
    document.getElementById('messageInput').value = '';
    
    showToast('success', '✨ Ready for a new adventure!');
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 3D Tilt Effect for Cards
// ═══════════════════════════════════════════════════════════════════════════

function initTiltEffect() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// 🧲 Magnetic Button Effect
// ═══════════════════════════════════════════════════════════════════════════

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// 🌍 Destination Chips Handler
// ═══════════════════════════════════════════════════════════════════════════

function initDestinationChips() {
    const chips = document.querySelectorAll('.dest-chip');
    
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const destination = chip.dataset.destination;
            const input = document.getElementById('messageInput');
            input.value = `Plan a trip to ${destination} for 5 days`;
            input.focus();
            
            // Animate chip
            chip.style.transform = 'scale(0.95)';
            setTimeout(() => {
                chip.style.transform = '';
            }, 150);
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 Initialization
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initParticles();
    initTheme();
    initVoiceInput();
    initTiltEffect();
    initMagneticButtons();
    initDestinationChips();

    // Event Listeners
    const sendButton = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    const resetButton = document.getElementById('resetBtn');
    const themeButton = document.getElementById('themeToggle');
    const exampleButtons = document.querySelectorAll('.example-btn');

    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetChat);
    }

    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    }

    exampleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.dataset.message;
            if (messageInput) {
                messageInput.value = message;
                sendMessage();
            }
        });
    });

    // Back to Home button
    const backToHome = document.getElementById('backToHome');
    if (backToHome) {
        backToHome.addEventListener('click', resetChat);
    }

    // Save trip button
    const saveTripBtn = document.getElementById('saveTripBtn');
    if (saveTripBtn) {
        saveTripBtn.addEventListener('click', saveCurrentTrip);
    }

    // Clear history button
    const clearHistory = document.getElementById('clearHistory');
    if (clearHistory) {
        clearHistory.addEventListener('click', clearRecentSearches);
    }

    // Sidebar toggle
    const historyToggle = document.getElementById('historyToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (historyToggle) {
        historyToggle.addEventListener('click', toggleSidebar);
    }
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Currency selector
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
        currencySelect.addEventListener('change', (e) => {
            localStorage.setItem('travelai-currency', e.target.value);
            showToast('success', `Currency set to ${e.target.value}`);
        });
        // Load saved currency
        const savedCurrency = localStorage.getItem('travelai-currency');
        if (savedCurrency) {
            currencySelect.value = savedCurrency;
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to send
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            sendMessage();
        }
        // Escape to close loading or sidebar
        if (e.key === 'Escape') {
            showLoading(false);
            closeSidebar();
        }
    });

    // Initialize recent searches display
    displayRecentSearches();

    // Initialize travel options
    initTravelOptions();

    // Initialize interactive world map
    initWorldMap();

    // Log startup
    console.log('%c✈️ TravelAI Ready!', 'color: #764ba2; font-size: 20px; font-weight: bold;');
    console.log('%cPowered by Google Gemini 2.0', 'color: #4facfe; font-size: 12px;');
});

// ═══════════════════════════════════════════════════════════════════════════
// 🗓️ Travel Options (Date, Travelers, Trip Type)
// ═══════════════════════════════════════════════════════════════════════════

let travelerCount = 1;

// Popular destinations for autocomplete
const destinations = [
    { name: 'Paris, France', code: 'CDG', emoji: '🗼' },
    { name: 'Tokyo, Japan', code: 'NRT', emoji: '🗾' },
    { name: 'New York, USA', code: 'JFK', emoji: '🗽' },
    { name: 'London, UK', code: 'LHR', emoji: '🎡' },
    { name: 'Dubai, UAE', code: 'DXB', emoji: '🏙️' },
    { name: 'Singapore', code: 'SIN', emoji: '🦁' },
    { name: 'Bali, Indonesia', code: 'DPS', emoji: '🏝️' },
    { name: 'Maldives', code: 'MLE', emoji: '🏖️' },
    { name: 'Sydney, Australia', code: 'SYD', emoji: '🦘' },
    { name: 'Bangkok, Thailand', code: 'BKK', emoji: '🛕' },
    { name: 'Rome, Italy', code: 'FCO', emoji: '🏛️' },
    { name: 'Barcelona, Spain', code: 'BCN', emoji: '⚽' },
    { name: 'Amsterdam, Netherlands', code: 'AMS', emoji: '🌷' },
    { name: 'Mumbai, India', code: 'BOM', emoji: '🇮🇳' },
    { name: 'Delhi, India', code: 'DEL', emoji: '🕌' },
    { name: 'Goa, India', code: 'GOI', emoji: '🏖️' },
    { name: 'Jaipur, India', code: 'JAI', emoji: '🏰' },
    { name: 'Switzerland', code: 'ZRH', emoji: '🏔️' },
    { name: 'Santorini, Greece', code: 'JTR', emoji: '🇬🇷' },
    { name: 'Cairo, Egypt', code: 'CAI', emoji: '🏛️' }
];

function initTravelOptions() {
    // Set default date to tomorrow
    const dateInput = document.getElementById('travelDate');
    const returnInput = document.getElementById('returnDate');
    const tripTypeSelect = document.getElementById('tripType');
    const returnDateGroup = document.getElementById('returnDateGroup');
    
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
        dateInput.min = new Date().toISOString().split('T')[0];
        
        // When departure date changes, update return date min
        dateInput.addEventListener('change', () => {
            if (returnInput) {
                returnInput.min = dateInput.value;
                // Auto-set return to 7 days after departure
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
        returnInput.min = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];
    }
    
    // Toggle return date based on trip type
    if (tripTypeSelect && returnDateGroup) {
        tripTypeSelect.addEventListener('change', () => {
            if (tripTypeSelect.value === 'oneway') {
                returnDateGroup.style.display = 'none';
            } else {
                returnDateGroup.style.display = 'flex';
            }
        });
    }
    
    // Initialize destination autocomplete
    initAutocomplete();

    // Traveler count buttons
    const minusBtn = document.getElementById('travelerMinus');
    const plusBtn = document.getElementById('travelerPlus');
    const countDisplay = document.getElementById('travelerCount');

    if (minusBtn && plusBtn && countDisplay) {
        minusBtn.addEventListener('click', () => {
            if (travelerCount > 1) {
                travelerCount--;
                countDisplay.textContent = travelerCount;
                animateTravelerCount(countDisplay);
                updateTravelerButtons();
            }
        });

        plusBtn.addEventListener('click', () => {
            if (travelerCount < 10) {
                travelerCount++;
                countDisplay.textContent = travelerCount;
                animateTravelerCount(countDisplay);
                updateTravelerButtons();
            }
        });
    }
}

function updateTravelerButtons() {
    const minusBtn = document.getElementById('travelerMinus');
    const plusBtn = document.getElementById('travelerPlus');
    
    if (minusBtn) minusBtn.disabled = travelerCount <= 1;
    if (plusBtn) plusBtn.disabled = travelerCount >= 10;
}

function animateTravelerCount(element) {
    element.classList.add('updated');
    setTimeout(() => {
        element.classList.remove('updated');
    }, 200);
}

function getTravelContext() {
    const date = document.getElementById('travelDate')?.value || '';
    const tripType = document.getElementById('tripType')?.value || 'roundtrip';
    const currency = document.getElementById('currencySelect')?.value || 'USD';
    const travelers = travelerCount;
    
    // Always include currency so AI uses correct currency
    let context = ` [Currency: ${currency}`;
    
    if (date) {
        context += `, Date: ${date}`;
    }
    
    context += `, ${travelers} traveler${travelers > 1 ? 's' : ''}, ${tripType}]`;
    
    return context;
}

// ═══════════════════════════════════════════════════════════════════════════
// 📚 Recent Searches (localStorage)
// ═══════════════════════════════════════════════════════════════════════════

function getRecentSearches() {
    const searches = localStorage.getItem('travelai-recent');
    return searches ? JSON.parse(searches) : [];
}

function saveRecentSearch(query) {
    let searches = getRecentSearches();
    // Remove if already exists
    searches = searches.filter(s => s !== query);
    // Add to beginning
    searches.unshift(query);
    // Keep only last 5
    searches = searches.slice(0, 5);
    localStorage.setItem('travelai-recent', JSON.stringify(searches));
    displayRecentSearches();
}

function displayRecentSearches() {
    const container = document.getElementById('recentSearches');
    const list = document.getElementById('recentList');
    const searches = getRecentSearches();
    
    if (!container || !list) return;
    
    if (searches.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    list.innerHTML = '';
    
    searches.forEach(query => {
        const item = document.createElement('button');
        item.className = 'recent-item';
        item.innerHTML = `<i class="fas fa-clock"></i> ${query.substring(0, 40)}${query.length > 40 ? '...' : ''}`;
        item.addEventListener('click', () => {
            document.getElementById('messageInput').value = query;
            sendMessage();
        });
        list.appendChild(item);
    });
}

function clearRecentSearches() {
    localStorage.removeItem('travelai-recent');
    displayRecentSearches();
    showToast('success', '🗑️ Search history cleared!');
}

// ═══════════════════════════════════════════════════════════════════════════
// 💾 Save Trips (localStorage)
// ═══════════════════════════════════════════════════════════════════════════

function getSavedTrips() {
    const trips = localStorage.getItem('travelai-trips');
    return trips ? JSON.parse(trips) : [];
}

function saveCurrentTrip() {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer || chatContainer.children.length === 0) {
        showToast('error', 'No trip to save yet!');
        return;
    }
    
    const messages = [];
    chatContainer.querySelectorAll('.message').forEach(msg => {
        const isUser = msg.classList.contains('message-user');
        const content = msg.querySelector('.message-content').textContent;
        messages.push({ role: isUser ? 'user' : 'bot', content });
    });
    
    const trip = {
        id: Date.now(),
        date: new Date().toISOString(),
        messages: messages
    };
    
    let trips = getSavedTrips();
    trips.unshift(trip);
    trips = trips.slice(0, 10); // Keep last 10 trips
    localStorage.setItem('travelai-trips', JSON.stringify(trips));
    
    // Update button state
    const btn = document.getElementById('saveTripBtn');
    if (btn) {
        btn.classList.add('saved');
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.classList.remove('saved');
            btn.innerHTML = '<i class="fas fa-bookmark"></i>';
        }, 2000);
    }
    
    triggerConfetti();
    showToast('success', 'Trip saved successfully!');
}

// ═══════════════════════════════════════════════════════════════════════════
// � Sidebar Functions
// ═══════════════════════════════════════════════════════════════════════════

function toggleSidebar() {
    const sidebar = document.getElementById('tripSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        displayTripHistory();
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('tripSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function displayTripHistory() {
    const container = document.getElementById('tripHistoryList');
    const trips = getSavedTrips();
    
    if (!container) return;
    
    if (trips.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-suitcase"></i>
                <p>No saved trips yet</p>
                <span>Your saved trips will appear here</span>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    trips.forEach((trip, index) => {
        const date = new Date(trip.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
        
        const preview = trip.messages[0]?.content || 'Trip';
        
        const item = document.createElement('div');
        item.className = 'trip-item';
        item.innerHTML = `
            <div class="trip-item-header">
                <span class="trip-item-date">${date}</span>
                <button class="trip-item-delete" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="trip-item-preview">${preview.substring(0, 50)}${preview.length > 50 ? '...' : ''}</div>
        `;
        
        // Click to view trip
        item.querySelector('.trip-item-preview').addEventListener('click', () => {
            // Could implement loading trip into chat
            showToast('info', 'Trip viewing coming soon!');
        });
        
        // Delete button
        item.querySelector('.trip-item-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTrip(index);
        });
        
        container.appendChild(item);
    });
}

function deleteTrip(index) {
    let trips = getSavedTrips();
    trips.splice(index, 1);
    localStorage.setItem('travelai-trips', JSON.stringify(trips));
    displayTripHistory();
    showToast('success', 'Trip deleted');
}

// ═══════════════════════════════════════════════════════════════════════════
// 💀 Skeleton Loading Cards
// ═══════════════════════════════════════════════════════════════════════════

function showSkeletonCards() {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;
    
    const skeleton = document.createElement('div');
    skeleton.id = 'skeletonLoader';
    skeleton.className = 'skeleton-container';
    skeleton.innerHTML = `
        <div class="skeleton-card">
            <div class="skeleton-header">
                <div class="skeleton-avatar"></div>
                <div class="skeleton-title">
                    <div class="skeleton-line medium"></div>
                    <div class="skeleton-line short"></div>
                </div>
            </div>
            <div class="skeleton-image"></div>
            <div class="skeleton-line full"></div>
            <div class="skeleton-line medium"></div>
            <div class="skeleton-row">
                <div class="skeleton-btn"></div>
                <div class="skeleton-btn"></div>
            </div>
        </div>
        <div class="skeleton-card">
            <div class="skeleton-line full"></div>
            <div class="skeleton-line medium"></div>
            <div class="skeleton-line short"></div>
        </div>
    `;
    
    chatContainer.appendChild(skeleton);
    skeleton.scrollIntoView({ behavior: 'smooth' });
}

function hideSkeletonCards() {
    const skeleton = document.getElementById('skeletonLoader');
    if (skeleton) {
        skeleton.remove();
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎴 Result Cards Generator
// ═══════════════════════════════════════════════════════════════════════════

function createResultCard(type, data) {
    const icons = {
        flight: 'fa-plane',
        hotel: 'fa-hotel',
        weather: 'fa-cloud-sun'
    };
    
    return `
        <div class="result-card">
            <div class="result-card-image ${type}">
                <i class="fas ${icons[type]}" style="font-size: 48px; color: white; display: flex; height: 100%; align-items: center; justify-content: center;"></i>
            </div>
            <div class="result-card-body">
                <div class="result-card-title">
                    <i class="fas ${icons[type]}"></i>
                    ${data.title}
                </div>
                <div class="result-card-subtitle">${data.subtitle || ''}</div>
                ${data.price ? `<div class="result-card-price">${data.price}</div>` : ''}
                <div class="result-card-details">
                    ${(data.tags || []).map(tag => `<span class="result-card-tag">${tag}</span>`).join('')}
                </div>
                ${data.buttonText ? `<button class="result-card-btn" onclick="window.open('${data.buttonUrl || '#'}', '_blank')">${data.buttonText}</button>` : ''}
            </div>
        </div>
    `;
}

function createResultCards(flights, hotels, weather) {
    let html = '<div class="result-cards">';
    
    if (flights) {
        html += createResultCard('flight', flights);
    }
    if (hotels) {
        html += createResultCard('hotel', hotels);
    }
    if (weather) {
        html += createResultCard('weather', weather);
    }
    
    html += '</div>';
    return html;
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 Price Comparison Chart
// ═══════════════════════════════════════════════════════════════════════════

function createPriceChart(prices) {
    // prices = { budget: 50, midrange: 100, luxury: 250 }
    const max = Math.max(...Object.values(prices));
    
    return `
        <div class="price-chart">
            <div class="price-chart-title">
                <i class="fas fa-chart-bar"></i>
                Price Comparison
            </div>
            <div class="price-bars">
                <div class="price-bar-item">
                    <span class="price-bar-label">Budget</span>
                    <div class="price-bar-container">
                        <div class="price-bar budget" style="width: ${(prices.budget / max) * 100}%">
                            <span class="price-bar-value">$${prices.budget}</span>
                        </div>
                    </div>
                </div>
                <div class="price-bar-item">
                    <span class="price-bar-label">Mid-Range</span>
                    <div class="price-bar-container">
                        <div class="price-bar midrange" style="width: ${(prices.midrange / max) * 100}%">
                            <span class="price-bar-value">$${prices.midrange}</span>
                        </div>
                    </div>
                </div>
                <div class="price-bar-item">
                    <span class="price-bar-label">Luxury</span>
                    <div class="price-bar-container">
                        <div class="price-bar luxury" style="width: ${(prices.luxury / max) * 100}%">
                            <span class="price-bar-value">$${prices.luxury}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="price-legend">
                <div class="legend-item"><span class="legend-dot budget"></span> Budget</div>
                <div class="legend-item"><span class="legend-dot midrange"></span> Mid-Range</div>
                <div class="legend-item"><span class="legend-dot luxury"></span> Luxury</div>
            </div>
        </div>
    `;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎭 Easter Egg - Konami Code
// ═══════════════════════════════════════════════════════════════════════════

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            triggerConfetti();
            showToast('success', 'Secret mode activated! Enjoy the confetti!');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🔍 Destination Autocomplete
// ═══════════════════════════════════════════════════════════════════════════

function initAutocomplete() {
    const input = document.getElementById('messageInput');
    if (!input) return;
    
    // Create autocomplete dropdown
    let dropdown = document.getElementById('autocomplete-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'autocomplete-dropdown';
        dropdown.className = 'autocomplete-dropdown';
        input.parentNode.appendChild(dropdown);
    }
    
    input.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        if (value.length < 2) {
            dropdown.style.display = 'none';
            return;
        }
        
        const matches = destinations.filter(d => 
            d.name.toLowerCase().includes(value) ||
            d.code.toLowerCase().includes(value)
        ).slice(0, 5);
        
        if (matches.length > 0) {
            dropdown.innerHTML = matches.map(d => `
                <div class="autocomplete-item" data-value="${d.name}">
                    <span class="dest-emoji">${d.emoji}</span>
                    <span class="dest-name">${d.name}</span>
                    <span class="dest-code">${d.code}</span>
                </div>
            `).join('');
            dropdown.style.display = 'block';
            
            // Add click handlers
            dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', () => {
                    const currentValue = input.value;
                    const dest = item.dataset.value;
                    // Replace partial text with destination
                    input.value = `Plan a trip to ${dest}`;
                    dropdown.style.display = 'none';
                    input.focus();
                });
            });
        } else {
            dropdown.style.display = 'none';
        }
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 Trip Summary Card
// ═══════════════════════════════════════════════════════════════════════════

function createTripSummary(tripData) {
    const summary = document.createElement('div');
    summary.className = 'trip-summary-card';
    
    const { destination, departDate, returnDate, travelers, flights, hotels, weather, totalCost } = tripData;
    
    summary.innerHTML = `
        <div class="summary-header">
            <h3><i class="fas fa-suitcase-rolling"></i> Your Trip to ${destination}</h3>
            <span class="summary-dates">${departDate} → ${returnDate}</span>
        </div>
        <div class="summary-grid">
            <div class="summary-item flight">
                <i class="fas fa-plane"></i>
                <div class="summary-label">Flights</div>
                <div class="summary-value">${flights || 'Looking...'}</div>
            </div>
            <div class="summary-item hotel">
                <i class="fas fa-hotel"></i>
                <div class="summary-label">Hotels</div>
                <div class="summary-value">${hotels || 'Looking...'}</div>
            </div>
            <div class="summary-item weather">
                <i class="fas fa-cloud-sun"></i>
                <div class="summary-label">Weather</div>
                <div class="summary-value">${weather || 'Checking...'}</div>
            </div>
            <div class="summary-item travelers">
                <i class="fas fa-users"></i>
                <div class="summary-label">Travelers</div>
                <div class="summary-value">${travelers} people</div>
            </div>
        </div>
        <div class="summary-total">
            <span>Estimated Total:</span>
            <span class="total-amount">${totalCost || 'Calculating...'}</span>
        </div>
        <div class="summary-actions">
            <button class="btn-save-trip"><i class="fas fa-bookmark"></i> Save Trip</button>
            <button class="btn-share-trip"><i class="fas fa-share-alt"></i> Share</button>
            <button class="btn-export-pdf"><i class="fas fa-file-pdf"></i> Export PDF</button>
        </div>
    `;
    
    return summary;
}

// ═══════════════════════════════════════════════════════════════════════════
// 💰 Budget Tracker
// ═══════════════════════════════════════════════════════════════════════════

let tripBudget = {
    limit: 0,
    spent: {
        flights: 0,
        hotels: 0,
        activities: 0,
        food: 0,
        other: 0
    }
};

function setBudget(amount) {
    tripBudget.limit = amount;
    updateBudgetDisplay();
}

function addExpense(category, amount) {
    if (tripBudget.spent[category] !== undefined) {
        tripBudget.spent[category] += amount;
        updateBudgetDisplay();
        checkBudgetAlert();
    }
}

function updateBudgetDisplay() {
    const total = Object.values(tripBudget.spent).reduce((a, b) => a + b, 0);
    const remaining = tripBudget.limit - total;
    const percentage = tripBudget.limit > 0 ? (total / tripBudget.limit) * 100 : 0;
    
    const budgetWidget = document.getElementById('budget-tracker');
    if (budgetWidget) {
        budgetWidget.innerHTML = `
            <div class="budget-header">
                <span>Budget Tracker</span>
                <span class="budget-remaining ${remaining < 0 ? 'over-budget' : ''}">${remaining >= 0 ? '✓' : '⚠️'} ${formatCurrency(remaining)} left</span>
            </div>
            <div class="budget-bar">
                <div class="budget-progress" style="width: ${Math.min(percentage, 100)}%; background: ${percentage > 90 ? '#ff6b6b' : percentage > 70 ? '#feca57' : '#00d2d3'}"></div>
            </div>
            <div class="budget-breakdown">
                ${Object.entries(tripBudget.spent).map(([cat, amt]) => `
                    <div class="budget-item">
                        <span>${getCategoryIcon(cat)} ${cat}</span>
                        <span>${formatCurrency(amt)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function checkBudgetAlert() {
    const total = Object.values(tripBudget.spent).reduce((a, b) => a + b, 0);
    const percentage = (total / tripBudget.limit) * 100;
    
    if (percentage >= 100) {
        showToast('error', '⚠️ Budget exceeded! Consider adjusting your plans.');
    } else if (percentage >= 90) {
        showToast('warning', '📊 Approaching budget limit (90%)');
    }
}

function getCategoryIcon(category) {
    const icons = {
        flights: '✈️',
        hotels: '🏨',
        activities: '🎭',
        food: '🍽️',
        other: '📦'
    };
    return icons[category] || '💰';
}

function formatCurrency(amount) {
    const currency = document.getElementById('currencySelect')?.value || 'USD';
    const symbols = { USD: '$', INR: '₹', EUR: '€', GBP: '£' };
    return `${symbols[currency]}${Math.abs(amount).toLocaleString()}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 📤 Export & Share Functions
// ═══════════════════════════════════════════════════════════════════════════

function exportToPDF() {
    showToast('info', '📄 PDF export feature coming soon!');
}

function shareTrip() {
    if (navigator.share) {
        navigator.share({
            title: 'My Trip Plan - TravelAI',
            text: 'Check out my trip plan!',
            url: window.location.href
        }).catch(() => {});
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showToast('success', '🔗 Link copied to clipboard!');
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🗺️ Interactive World Map (Leaflet)
// ═══════════════════════════════════════════════════════════════════════════

let worldMap = null;

const mapDestinations = [
    { name: 'Paris', lat: 48.8566, lng: 2.3522, emoji: '🗼', type: 'popular', price: '$599' },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, emoji: '🗾', type: 'popular', price: '$799' },
    { name: 'New York', lat: 40.7128, lng: -74.0060, emoji: '🗽', type: 'popular', price: '$749' },
    { name: 'London', lat: 51.5074, lng: -0.1278, emoji: '🎡', type: 'popular', price: '$649' },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708, emoji: '🏙️', type: 'trending', price: '$449' },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198, emoji: '🦁', type: 'trending', price: '$399' },
    { name: 'Bali', lat: -8.3405, lng: 115.0920, emoji: '🏝️', type: 'popular', price: '$499' },
    { name: 'Maldives', lat: 3.2028, lng: 73.2207, emoji: '🏖️', type: 'trending', price: '$899' },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, emoji: '🦘', type: 'popular', price: '$899' },
    { name: 'Bangkok', lat: 13.7563, lng: 100.5018, emoji: '🛕', type: 'budget', price: '$349' },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, emoji: '🇮🇳', type: 'budget', price: '$199' },
    { name: 'Delhi', lat: 28.7041, lng: 77.1025, emoji: '🕌', type: 'budget', price: '$179' },
    { name: 'Goa', lat: 15.2993, lng: 74.1240, emoji: '🏖️', type: 'budget', price: '$149' },
    { name: 'Switzerland', lat: 46.8182, lng: 8.2275, emoji: '🏔️', type: 'popular', price: '$999' },
    { name: 'Rome', lat: 41.9028, lng: 12.4964, emoji: '🏛️', type: 'popular', price: '$549' },
    { name: 'Barcelona', lat: 41.3851, lng: 2.1734, emoji: '⚽', type: 'trending', price: '$499' }
];

function initWorldMap() {
    const mapContainer = document.getElementById('worldMap');
    if (!mapContainer || typeof L === 'undefined') {
        console.log('Map container or Leaflet not available');
        return;
    }

    // Create map centered on world view
    worldMap = L.map('worldMap', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 8,
        scrollWheelZoom: false,
        attributionControl: false
    });

    // Add dark style tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(worldMap);

    // Custom marker icons
    const createIcon = (type) => {
        const colors = {
            popular: '#764ba2',
            trending: '#4facfe',
            budget: '#00d2d3'
        };
        return L.divIcon({
            className: `map-marker ${type}`,
            html: `<div class="marker-pulse" style="background: ${colors[type]}"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    };

    // Add markers for each destination
    mapDestinations.forEach(dest => {
        const marker = L.marker([dest.lat, dest.lng], {
            icon: createIcon(dest.type)
        }).addTo(worldMap);

        // Create popup
        const popup = L.popup({
            className: 'custom-popup'
        }).setContent(`
            <div class="map-popup">
                <div class="popup-header">
                    <span class="popup-emoji">${dest.emoji}</span>
                    <span class="popup-name">${dest.name}</span>
                </div>
                <div class="popup-price">from ${dest.price}</div>
                <button class="popup-btn" onclick="searchDestination('${dest.name}')">
                    <i class="fas fa-search"></i> Plan Trip
                </button>
            </div>
        `);

        marker.bindPopup(popup);

        // Hover effect
        marker.on('mouseover', function() {
            this.openPopup();
        });
    });

    // Map toggle functionality
    const mapToggle = document.getElementById('mapToggle');
    const mapSection = document.querySelector('.map-section');
    let isExpanded = false;

    if (mapToggle && mapSection) {
        mapToggle.addEventListener('click', () => {
            isExpanded = !isExpanded;
            mapSection.classList.toggle('expanded', isExpanded);
            mapToggle.innerHTML = isExpanded ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand"></i>';
            setTimeout(() => worldMap.invalidateSize(), 300);
        });
    }
}

// Search from map popup
function searchDestination(destination) {
    const input = document.getElementById('messageInput');
    if (input) {
        input.value = `Plan a trip to ${destination}`;
        document.getElementById('sendBtn')?.click();
    }
}
