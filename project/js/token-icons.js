// Token icons and visual enhancements

// Enhanced token data with proper icons
const enhancedTokenData = {
    ETH: {
        ...window.tokenData.ETH,
        icon: 'eth-icon',
        symbol_display: 'Ξ'
    },
    USDC: {
        ...window.tokenData.USDC,
        icon: 'usdc-icon',
        symbol_display: 'USDC'
    },
    USDT: {
        ...window.tokenData.USDT,
        icon: 'usdt-icon',
        symbol_display: 'USDT'
    },
    WBTC: {
        ...window.tokenData.WBTC,
        icon: 'wbtc-icon',
        symbol_display: '₿'
    },
    DAI: {
        ...window.tokenData.DAI,
        icon: 'dai-icon',
        symbol_display: 'DAI'
    },
    UNI: {
        ...window.tokenData.UNI,
        icon: 'uni-icon',
        symbol_display: 'UNI'
    },
    LINK: {
        ...window.tokenData.LINK,
        icon: 'link-icon',
        symbol_display: 'LINK'
    },
    AAVE: {
        ...window.tokenData.AAVE,
        icon: 'aave-icon',
        symbol_display: 'AAVE'
    },
    COMP: {
        ...window.tokenData.COMP,
        icon: 'comp-icon',
        symbol_display: 'COMP'
    },
    MATIC: {
        ...window.tokenData.MATIC,
        icon: 'matic-icon',
        symbol_display: 'MATIC'
    }
};

// Update global token data
Object.assign(window.tokenData, enhancedTokenData);

// Enhanced token icon utility
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

// Create token icon element
function createTokenIcon(symbol, size = 24) {
    const icon = document.createElement('div');
    icon.className = `token-icon ${getTokenIcon(symbol)}`;
    icon.style.width = size + 'px';
    icon.style.height = size + 'px';
    
    // Add symbol text for better recognition
    const tokenData = window.tokenData[symbol];
    if (tokenData && tokenData.symbol_display) {
        icon.textContent = tokenData.symbol_display;
    } else {
        icon.textContent = symbol.charAt(0);
    }
    
    return icon;
}

// Enhanced token selector display
function updateTokenDisplay(tokenSymbol, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const tokenInfo = container.querySelector('.token-info');
    if (!tokenInfo) return;
    
    if (tokenSymbol) {
        const token = window.tokenData[tokenSymbol];
        const icon = createTokenIcon(tokenSymbol, 24);
        
        tokenInfo.innerHTML = '';
        tokenInfo.appendChild(icon);
        
        const symbolSpan = document.createElement('span');
        symbolSpan.className = 'token-symbol';
        symbolSpan.textContent = tokenSymbol;
        tokenInfo.appendChild(symbolSpan);
    } else {
        tokenInfo.innerHTML = '<span class="token-symbol">Select token</span>';
    }
}

// Enhanced common tokens display
function populateCommonTokensWithIcons() {
    const container = document.getElementById('common-tokens-list');
    if (!container) return;
    
    container.innerHTML = '';

    window.commonTokens.forEach(symbol => {
        const token = window.tokenData[symbol];
        if (!token) return;

        const tokenElement = document.createElement('div');
        tokenElement.className = 'common-token';
        
        const icon = createTokenIcon(symbol, 32);
        const symbolSpan = document.createElement('span');
        symbolSpan.className = 'token-symbol';
        symbolSpan.textContent = symbol;
        
        tokenElement.appendChild(icon);
        tokenElement.appendChild(symbolSpan);

        tokenElement.addEventListener('click', () => {
            if (window.tokens && window.tokens.selectToken) {
                window.tokens.selectToken(symbol);
            }
        });

        container.appendChild(tokenElement);
    });
}

// Enhanced token list display
function populateTokenListWithIcons(searchQuery = '') {
    const container = document.getElementById('token-list');
    if (!container) return;
    
    container.innerHTML = '';

    const tokens = Object.values(window.tokenData).filter(token => {
        if (!searchQuery) return true;
        
        const query = searchQuery.toLowerCase();
        return token.name.toLowerCase().includes(query) ||
               token.symbol.toLowerCase().includes(query) ||
               token.address.toLowerCase().includes(query);
    });

    tokens.forEach(token => {
        const balance = window.userBalances[token.symbol] || 0;
        
        const tokenElement = document.createElement('div');
        tokenElement.className = 'token-list-item';
        
        const icon = createTokenIcon(token.symbol, 36);
        
        const tokenInfo = document.createElement('div');
        tokenInfo.className = 'token-info';
        
        const tokenName = document.createElement('div');
        tokenName.className = 'token-name';
        tokenName.textContent = token.name;
        
        const tokenSymbol = document.createElement('div');
        tokenSymbol.className = 'token-symbol';
        tokenSymbol.textContent = token.symbol;
        
        tokenInfo.appendChild(tokenName);
        tokenInfo.appendChild(tokenSymbol);
        
        const tokenBalance = document.createElement('div');
        tokenBalance.className = 'token-balance';
        tokenBalance.textContent = utils.formatTokenAmount(balance);
        
        tokenElement.appendChild(icon);
        tokenElement.appendChild(tokenInfo);
        tokenElement.appendChild(tokenBalance);

        tokenElement.addEventListener('click', () => {
            if (window.tokens && window.tokens.selectToken) {
                window.tokens.selectToken(token.symbol);
            }
        });

        container.appendChild(tokenElement);
    });
}

// Enhanced tokens table with icons
function populateTokensTableWithIcons() {
    const tableBody = document.getElementById('tokens-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const tokens = Object.values(window.tokenData)
        .sort((a, b) => b.marketCap - a.marketCap);
    
    tokens.forEach((token, index) => {
        const row = document.createElement('div');
        row.className = 'table-row';
        
        const icon = createTokenIcon(token.symbol, 32);
        
        row.innerHTML = `
            <div class="table-cell">${index + 1}</div>
            <div class="table-cell">
                <div class="token-name-cell">
                    <div class="token-name-info">
                        <div class="token-name">${token.name}</div>
                        <div class="token-symbol">${token.symbol}</div>
                    </div>
                </div>
            </div>
            <div class="table-cell">${utils.formatCurrency(token.price)}</div>
            <div class="table-cell">
                <span class="${utils.getPercentageColor(token.priceChange1h)}">
                    ${utils.formatPercentage(token.priceChange1h)}
                </span>
            </div>
            <div class="table-cell">
                <span class="${utils.getPercentageColor(token.priceChange24h)}">
                    ${utils.formatPercentage(token.priceChange24h)}
                </span>
            </div>
            <div class="table-cell">
                <span class="${utils.getPercentageColor(token.priceChange7d)}">
                    ${utils.formatPercentage(token.priceChange7d)}
                </span>
            </div>
            <div class="table-cell">${utils.formatCurrency(token.marketCap, 0)}</div>
            <div class="table-cell">${utils.formatCurrency(token.volume24h, 0)}</div>
            <div class="table-cell">${utils.formatCurrency(token.tvl, 0)}</div>
        `;
        
        // Insert icon into the token name cell
        const tokenNameCell = row.querySelector('.token-name-cell');
        tokenNameCell.insertBefore(icon, tokenNameCell.firstChild);
        
        row.addEventListener('click', () => {
            utils.showToast(`Viewing ${token.name} details`, 'info');
        });
        
        tableBody.appendChild(row);
    });
}

// Override utils.getTokenIcon
if (window.utils) {
    window.utils.getTokenIcon = getTokenIcon;
}

// Override token functions to use enhanced icons
if (window.tokens) {
    const originalPopulateCommonTokens = window.tokens.populateCommonTokens;
    const originalPopulateTokenList = window.tokens.populateTokenList;
    const originalPopulateTokensTable = window.tokens.populateTokensTable;
    
    window.tokens.populateCommonTokens = populateCommonTokensWithIcons;
    window.tokens.populateTokenList = populateTokenListWithIcons;
    window.tokens.populateTokensTable = populateTokensTableWithIcons;
}

// Export enhanced functions
window.tokenIcons = {
    getTokenIcon,
    createTokenIcon,
    updateTokenDisplay,
    populateCommonTokensWithIcons,
    populateTokenListWithIcons,
    populateTokensTableWithIcons
};

// Auto-update displays when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Update existing displays
        setTimeout(() => {
            populateCommonTokensWithIcons();
            populateTokenListWithIcons();
            populateTokensTableWithIcons();
        }, 100);
    });
} else {
    // Update existing displays
    setTimeout(() => {
        populateCommonTokensWithIcons();
        populateTokenListWithIcons();
        populateTokensTableWithIcons();
    }, 100);
}