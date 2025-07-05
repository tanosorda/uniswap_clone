// Utility functions for the Uniswap clone

// Format number with appropriate decimals and suffixes
function formatNumber(num, decimals = 2) {
    if (num === null || num === undefined || isNaN(num)) {
        return '0';
    }
    
    const number = parseFloat(num);
    
    if (number === 0) {
        return '0';
    }
    
    if (Math.abs(number) < 0.01 && decimals <= 2) {
        return '< 0.01';
    }
    
    if (Math.abs(number) >= 1000000000) {
        return (number / 1000000000).toFixed(1) + 'B';
    }
    
    if (Math.abs(number) >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    }
    
    if (Math.abs(number) >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
    }
    
    return number.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
    });
}

// Format currency with dollar sign
function formatCurrency(num, decimals = 2) {
    if (num === null || num === undefined || isNaN(num)) {
        return '$0.00';
    }
    
    const formatted = formatNumber(num, decimals);
    return formatted.startsWith('<') ? formatted : `$${formatted}`;
}

// Format percentage with proper styling
function formatPercentage(num, decimals = 2) {
    if (num === null || num === undefined || isNaN(num)) {
        return '0.00%';
    }
    
    const number = parseFloat(num);
    const sign = number >= 0 ? '+' : '';
    return `${sign}${number.toFixed(decimals)}%`;
}

// Get percentage color class
function getPercentageColor(num) {
    if (num > 0) return 'green';
    if (num < 0) return 'red';
    return '';
}

// Truncate address for display
function truncateAddress(address, startLength = 6, endLength = 4) {
    if (!address || address.length <= startLength + endLength) {
        return address;
    }
    
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

// Debounce function for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast('Copied to clipboard!', 'success');
        } catch (err) {
            showToast('Failed to copy', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}

// Generate random price movement
function generatePriceMovement(basePrice, volatility = 0.02) {
    const change = (Math.random() - 0.5) * volatility;
    return basePrice * (1 + change);
}

// Calculate swap output amount
function calculateSwapOutput(inputAmount, inputToken, outputToken) {
    if (!inputAmount || !inputToken || !outputToken) {
        return 0;
    }
    
    const inputPrice = window.tokenData[inputToken]?.price || 0;
    const outputPrice = window.tokenData[outputToken]?.price || 0;
    
    if (inputPrice === 0 || outputPrice === 0) {
        return 0;
    }
    
    // Simple calculation: (inputAmount * inputPrice) / outputPrice
    // Apply 0.3% fee like Uniswap
    const outputAmount = (inputAmount * inputPrice) / outputPrice;
    return outputAmount * 0.997; // 0.3% fee
}

// Calculate price impact
function calculatePriceImpact(inputAmount, inputToken, outputToken) {
    // Simplified price impact calculation
    // In reality, this would depend on liquidity pool reserves
    const amount = parseFloat(inputAmount) || 0;
    
    if (amount < 1000) return 0.01;
    if (amount < 10000) return 0.05;
    if (amount < 100000) return 0.1;
    return 0.5;
}

// Format token amount with proper decimals
function formatTokenAmount(amount, decimals = 18) {
    if (!amount) return '0';
    
    const num = parseFloat(amount);
    if (num === 0) return '0';
    
    if (num < 0.0001) return '< 0.0001';
    if (num < 1) return num.toFixed(6);
    if (num < 1000) return num.toFixed(4);
    
    return formatNumber(num, 2);
}

// Validate Ethereum address
function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Validate number input
function isValidNumber(value) {
    return !isNaN(value) && isFinite(value) && value > 0;
}

// Get token icon class
function getTokenIcon(symbol) {
    const iconMap = {
        ETH: 'eth-icon',
        USDC: 'usdc-icon',
        USDT: 'usdt-icon',
        WBTC: 'wbtc-icon',
        DAI: 'dai-icon',
        UNI: 'uni-icon',
        LINK: 'link-icon',
        AAVE: 'aave-icon',
        COMP: 'comp-icon',
        MATIC: 'matic-icon'
    };
    
    return iconMap[symbol] || 'default-icon';
}

// Local storage helpers
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error('Failed to save to localStorage:', err);
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (err) {
            console.error('Failed to read from localStorage:', err);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (err) {
            console.error('Failed to remove from localStorage:', err);
        }
    }
};

// Export utility functions
window.utils = {
    formatNumber,
    formatCurrency,
    formatPercentage,
    getPercentageColor,
    truncateAddress,
    debounce,
    showToast,
    copyToClipboard,
    generatePriceMovement,
    calculateSwapOutput,
    calculatePriceImpact,
    formatTokenAmount,
    isValidAddress,
    isValidNumber,
    getTokenIcon,
    storage
};