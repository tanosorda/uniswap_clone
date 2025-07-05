// Animated background with floating crypto icons

class AnimatedBackground {
    constructor() {
        this.container = null;
        this.icons = [];
        this.isRunning = false;
        this.cryptoSymbols = ['eth', 'btc', 'usdc', 'uni', 'link', 'aave'];
    }

    initialize() {
        this.createContainer();
        this.startAnimation();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'animated-background';
        document.body.appendChild(this.container);
    }

    createIcon() {
        const icon = document.createElement('div');
        const randomSymbol = this.cryptoSymbols[Math.floor(Math.random() * this.cryptoSymbols.length)];
        
        icon.className = `crypto-icon ${randomSymbol}`;
        
        // Random horizontal position
        icon.style.left = Math.random() * 100 + '%';
        
        // Random size between 20px and 60px
        const size = Math.random() * 40 + 20;
        icon.style.width = size + 'px';
        icon.style.height = size + 'px';
        
        // Random animation duration between 15s and 25s
        const duration = Math.random() * 10 + 15;
        icon.style.animationDuration = duration + 's';
        
        // Random delay
        const delay = Math.random() * 5;
        icon.style.animationDelay = delay + 's';
        
        // Add symbol text
        icon.textContent = randomSymbol.toUpperCase();
        
        this.container.appendChild(icon);
        this.icons.push(icon);
        
        // Remove icon after animation completes
        setTimeout(() => {
            if (this.container.contains(icon)) {
                this.container.removeChild(icon);
                const index = this.icons.indexOf(icon);
                if (index > -1) {
                    this.icons.splice(index, 1);
                }
            }
        }, (duration + delay) * 1000);
    }

    startAnimation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        
        // Create initial icons
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.createIcon(), i * 1000);
        }
        
        // Continue creating icons
        this.animationInterval = setInterval(() => {
            if (this.icons.length < 15) { // Limit number of icons
                this.createIcon();
            }
        }, 2000);
    }

    stopAnimation() {
        this.isRunning = false;
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }

    destroy() {
        this.stopAnimation();
        if (this.container && document.body.contains(this.container)) {
            document.body.removeChild(this.container);
        }
        this.icons = [];
    }
}

// Initialize background animation
const animatedBackground = new AnimatedBackground();

// Export for global access
window.animatedBackground = animatedBackground;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        animatedBackground.initialize();
    });
} else {
    animatedBackground.initialize();
}