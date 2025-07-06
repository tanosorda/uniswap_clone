// Comprehensive cryptocurrency icons and symbols mapping

// Main cryptocurrency symbols and icons
const CRYPTO_SYMBOLS = {
    // Major cryptocurrencies
    BTC: { symbol: '₿', icon: '🪙', name: 'Bitcoin', color: '#F7931A' },
    ETH: { symbol: 'Ξ', icon: '💎', name: 'Ethereum', color: '#627EEA' },
    USDC: { symbol: '$', icon: '🪙', name: 'USD Coin', color: '#2775CA' },
    USDT: { symbol: '₮', icon: '🪙', name: 'Tether', color: '#26A17B' },
    WBTC: { symbol: '₿', icon: '🔗', name: 'Wrapped Bitcoin', color: '#F7931A' },
    DAI: { symbol: '◈', icon: '🪙', name: 'Dai Stablecoin', color: '#F5AC37' },
    UNI: { symbol: '🦄', icon: '🦄', name: 'Uniswap', color: '#FF007A' },
    LINK: { symbol: '🔗', icon: '🔗', name: 'Chainlink', color: '#375BD2' },
    AAVE: { symbol: '👻', icon: '👻', name: 'Aave', color: '#B6509E' },
    COMP: { symbol: '🏛️', icon: '🏛️', name: 'Compound', color: '#00D395' },
    MATIC: { symbol: '🔷', icon: '🔷', name: 'Polygon', color: '#8247E5' },
    
    // Additional popular cryptocurrencies
    ADA: { symbol: '₳', icon: '🪙', name: 'Cardano', color: '#0033AD' },
    SOL: { symbol: '☀️', icon: '☀️', name: 'Solana', color: '#9945FF' },
    DOT: { symbol: '●', icon: '🔴', name: 'Polkadot', color: '#E6007A' },
    AVAX: { symbol: '🏔️', icon: '🏔️', name: 'Avalanche', color: '#E84142' },
    ATOM: { symbol: '⚛️', icon: '⚛️', name: 'Cosmos', color: '#2E3148' },
    NEAR: { symbol: '🌈', icon: '🌈', name: 'NEAR Protocol', color: '#00C08B' },
    FTM: { symbol: '👻', icon: '🔮', name: 'Fantom', color: '#1969FF' },
    ALGO: { symbol: '🔺', icon: '🔺', name: 'Algorand', color: '#000000' },
    XTZ: { symbol: '🏛️', icon: '⚪', name: 'Tezos', color: '#2C7DF7' },
    FLOW: { symbol: '🌊', icon: '🌊', name: 'Flow', color: '#00EF8B' },
    
    // DeFi tokens
    SUSHI: { symbol: '🍣', icon: '🍣', name: 'SushiSwap', color: '#FA52A0' },
    CRV: { symbol: '📈', icon: '📈', name: 'Curve DAO', color: '#40649F' },
    BAL: { symbol: '⚖️', icon: '⚖️', name: 'Balancer', color: '#1E1E1E' },
    YFI: { symbol: '💰', icon: '💰', name: 'yearn.finance', color: '#006AE3' },
    SNX: { symbol: '⚡', icon: '⚡', name: 'Synthetix', color: '#5FCDF9' },
    MKR: { symbol: '🏭', icon: '🏭', name: 'Maker', color: '#1AAB9B' },
    
    // Layer 2 and scaling
    LRC: { symbol: '🔄', icon: '🔄', name: 'Loopring', color: '#1C60FF' },
    IMX: { symbol: '⚔️', icon: '⚔️', name: 'Immutable X', color: '#0B0B0B' },
    
    // Meme coins
    DOGE: { symbol: '🐕', icon: '🐕', name: 'Dogecoin', color: '#C2A633' },
    SHIB: { symbol: '🐕', icon: '🦮', name: 'Shiba Inu', color: '#FFA409' },
    
    // Stablecoins
    BUSD: { symbol: '$', icon: '🟡', name: 'Binance USD', color: '#F0B90B' },
    FRAX: { symbol: '$', icon: '🔺', name: 'Frax', color: '#000000' },
    
    // Default fallback
    DEFAULT: { symbol: '🪙', icon: '🪙', name: 'Cryptocurrency', color: '#6B7280' }
};

// Function to get crypto symbol with icon
function getCryptoWithIcon(tokenSymbol, includeSymbol = true, includeIcon = true) {
    const crypto = CRYPTO_SYMBOLS[tokenSymbol] || CRYPTO_SYMBOLS.DEFAULT;
    let result = '';
    
    if (includeIcon) {
        result += crypto.icon + ' ';
    }
    
    if (includeSymbol && crypto.symbol !== tokenSymbol) {
        result += crypto.symbol + ' ';
    }
    
    result += tokenSymbol;
    return result;
}

// Function to get just the icon
function getCryptoIcon(tokenSymbol) {
    const crypto = CRYPTO_SYMBOLS[tokenSymbol] || CRYPTO_SYMBOLS.DEFAULT;
    return crypto.icon;
}

// Function to get just the symbol
function getCryptoSymbol(tokenSymbol) {
    const crypto = CRYPTO_SYMBOLS[tokenSymbol] || CRYPTO_SYMBOLS.DEFAULT;
    return crypto.symbol;
}

// Function to get crypto color
function getCryptoColor(tokenSymbol) {
    const crypto = CRYPTO_SYMBOLS[tokenSymbol] || CRYPTO_SYMBOLS.DEFAULT;
    return crypto.color;
}

// Function to enhance text with crypto icons
function enhanceTextWithCryptoIcons(text) {
    let enhancedText = text;
    
    // Replace cryptocurrency mentions with icons
    Object.keys(CRYPTO_SYMBOLS).forEach(symbol => {
        if (symbol === 'DEFAULT') return;
        
        const crypto = CRYPTO_SYMBOLS[symbol];
        const regex = new RegExp(`\\b${symbol}\\b`, 'g');
        enhancedText = enhancedText.replace(regex, `${crypto.icon} ${symbol}`);
    });
    
    return enhancedText;
}

// Function to create enhanced token display element
function createEnhancedTokenDisplay(tokenSymbol, size = 'medium') {
    const crypto = CRYPTO_SYMBOLS[tokenSymbol] || CRYPTO_SYMBOLS.DEFAULT;
    const element = document.createElement('span');
    element.className = `crypto-display crypto-display-${size}`;
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'crypto-icon-emoji';
    iconSpan.textContent = crypto.icon;
    
    const symbolSpan = document.createElement('span');
    symbolSpan.className = 'crypto-symbol-text';
    symbolSpan.textContent = tokenSymbol;
    
    element.appendChild(iconSpan);
    element.appendChild(symbolSpan);
    
    return element;
}

// Export functions for global use
window.cryptoIcons = {
    CRYPTO_SYMBOLS,
    getCryptoWithIcon,
    getCryptoIcon,
    getCryptoSymbol,
    getCryptoColor,
    enhanceTextWithCryptoIcons,
    createEnhancedTokenDisplay
};

// Auto-enhance existing content when DOM is ready
function enhanceExistingContent() {
    // Enhance headers
    const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headers.forEach(header => {
        header.innerHTML = enhanceTextWithCryptoIcons(header.innerHTML);
    });
    
    // Enhance table cells
    const tableCells = document.querySelectorAll('.table-cell, .token-symbol, .token-name');
    tableCells.forEach(cell => {
        if (cell.textContent && CRYPTO_SYMBOLS[cell.textContent.trim()]) {
            const symbol = cell.textContent.trim();
            cell.innerHTML = getCryptoWithIcon(symbol);
        }
    });
    
    // Enhance navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.innerHTML = enhanceTextWithCryptoIcons(link.innerHTML);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceExistingContent);
} else {
    enhanceExistingContent();
}