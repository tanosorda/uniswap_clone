// Enhanced token display with comprehensive crypto icons

// Override existing token display functions to include crypto icons
function enhanceTokenDisplays() {
    // Enhanced token selector display
    function updateTokenSelectorDisplay(tokenSymbol, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const tokenInfo = container.querySelector('.token-info');
        if (!tokenInfo) return;
        
        if (tokenSymbol && window.cryptoIcons) {
            const crypto = window.cryptoIcons.CRYPTO_SYMBOLS[tokenSymbol];
            if (crypto) {
                tokenInfo.innerHTML = `
                    <div class="token-icon-enhanced" style="background-color: ${crypto.color}">
                        <span class="crypto-emoji">${crypto.icon}</span>
                    </div>
                    <span class="token-symbol-enhanced">${crypto.icon} ${tokenSymbol}</span>
                `;
            } else {
                tokenInfo.innerHTML = `<span class="token-symbol">${tokenSymbol}</span>`;
            }
        } else {
            tokenInfo.innerHTML = '<span class="token-symbol">Select token</span>';
        }
    }
    
    // Enhanced common tokens display
    function populateEnhancedCommonTokens() {
        const container = document.getElementById('common-tokens-list');
        if (!container) return;
        
        container.innerHTML = '';

        window.commonTokens.forEach(symbol => {
            const token = window.tokenData[symbol];
            const crypto = window.cryptoIcons?.CRYPTO_SYMBOLS[symbol];
            if (!token) return;

            const tokenElement = document.createElement('div');
            tokenElement.className = 'common-token enhanced';
            
            if (crypto) {
                tokenElement.innerHTML = `
                    <div class="token-icon-enhanced" style="background-color: ${crypto.color}">
                        <span class="crypto-emoji">${crypto.icon}</span>
                    </div>
                    <span class="token-symbol-enhanced">${crypto.icon} ${symbol}</span>
                `;
            } else {
                tokenElement.innerHTML = `
                    <div class="token-icon ${utils.getTokenIcon(symbol)}"></div>
                    <span class="token-symbol">${symbol}</span>
                `;
            }

            tokenElement.addEventListener('click', () => {
                if (window.tokens && window.tokens.selectToken) {
                    window.tokens.selectToken(symbol);
                }
            });

            container.appendChild(tokenElement);
        });
    }
    
    // Enhanced token list display
    function populateEnhancedTokenList(searchQuery = '') {
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
            const crypto = window.cryptoIcons?.CRYPTO_SYMBOLS[token.symbol];
            
            const tokenElement = document.createElement('div');
            tokenElement.className = 'token-list-item enhanced';
            
            if (crypto) {
                tokenElement.innerHTML = `
                    <div class="token-icon-enhanced" style="background-color: ${crypto.color}">
                        <span class="crypto-emoji">${crypto.icon}</span>
                    </div>
                    <div class="token-info">
                        <div class="token-name">${crypto.icon} ${token.name}</div>
                        <div class="token-symbol">${crypto.symbol} ${token.symbol}</div>
                    </div>
                    <div class="token-balance">${utils.formatTokenAmount(balance)}</div>
                `;
            } else {
                tokenElement.innerHTML = `
                    <div class="token-icon ${utils.getTokenIcon(token.symbol)}"></div>
                    <div class="token-info">
                        <div class="token-name">${token.name}</div>
                        <div class="token-symbol">${token.symbol}</div>
                    </div>
                    <div class="token-balance">${utils.formatTokenAmount(balance)}</div>
                `;
            }

            tokenElement.addEventListener('click', () => {
                if (window.tokens && window.tokens.selectToken) {
                    window.tokens.selectToken(token.symbol);
                }
            });

            container.appendChild(tokenElement);
        });
    }
    
    // Enhanced tokens table display
    function populateEnhancedTokensTable() {
        const tableBody = document.getElementById('tokens-table-body');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        const tokens = Object.values(window.tokenData)
            .sort((a, b) => b.marketCap - a.marketCap);
        
        tokens.forEach((token, index) => {
            const crypto = window.cryptoIcons?.CRYPTO_SYMBOLS[token.symbol];
            const row = document.createElement('div');
            row.className = 'table-row enhanced';
            
            if (crypto) {
                row.innerHTML = `
                    <div class="table-cell">${index + 1}</div>
                    <div class="table-cell">
                        <div class="token-name-cell enhanced">
                            <div class="token-icon-enhanced" style="background-color: ${crypto.color}">
                                <span class="crypto-emoji">${crypto.icon}</span>
                            </div>
                            <div class="token-name-info">
                                <div class="token-name">${crypto.icon} ${token.name}</div>
                                <div class="token-symbol">${crypto.symbol} ${token.symbol}</div>
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
            } else {
                row.innerHTML = `
                    <div class="table-cell">${index + 1}</div>
                    <div class="table-cell">
                        <div class="token-name-cell">
                            <div class="token-icon ${utils.getTokenIcon(token.symbol)}"></div>
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
            }
            
            row.addEventListener('click', () => {
                utils.showToast(`Viewing ${crypto?.icon || ''} ${token.name} details`, 'info');
            });
            
            tableBody.appendChild(row);
        });
    }
    
    // Enhanced pools display
    function populateEnhancedPools() {
        const poolsTableBody = document.getElementById('pools-table-body');
        if (!poolsTableBody) return;
        
        poolsTableBody.innerHTML = '';
        
        window.poolData.forEach((pool, index) => {
            const crypto0 = window.cryptoIcons?.CRYPTO_SYMBOLS[pool.token0];
            const crypto1 = window.cryptoIcons?.CRYPTO_SYMBOLS[pool.token1];
            
            const row = document.createElement('div');
            row.className = 'table-row enhanced';
            
            row.innerHTML = `
                <div class="table-cell">${index + 1}</div>
                <div class="table-cell">
                    <div class="pool-name-cell enhanced">
                        <div class="pool-tokens">
                            <div class="token-icon-enhanced small" style="background-color: ${crypto0?.color || '#6B7280'}">
                                <span class="crypto-emoji">${crypto0?.icon || '🪙'}</span>
                            </div>
                            <div class="token-icon-enhanced small" style="background-color: ${crypto1?.color || '#6B7280'}">
                                <span class="crypto-emoji">${crypto1?.icon || '🪙'}</span>
                            </div>
                        </div>
                        <div class="pool-name">${crypto0?.icon || '🪙'} ${pool.token0}/${crypto1?.icon || '🪙'} ${pool.token1}</div>
                        <div class="pool-fee">${pool.fee}%</div>
                    </div>
                </div>
                <div class="table-cell">${utils.formatCurrency(pool.tvl, 0)}</div>
                <div class="table-cell">${utils.formatCurrency(pool.volume24h, 0)}</div>
                <div class="table-cell">${utils.formatCurrency(pool.volume7d, 0)}</div>
                <div class="table-cell">${utils.formatCurrency(pool.fees24h, 0)}</div>
                <div class="table-cell">${utils.formatPercentage(pool.apr)}</div>
            `;
            
            row.addEventListener('click', () => {
                utils.showToast(`Viewing ${crypto0?.icon || '🪙'} ${pool.token0}/${crypto1?.icon || '🪙'} ${pool.token1} pool details`, 'info');
            });
            
            poolsTableBody.appendChild(row);
        });
    }
    
    // Override existing functions
    if (window.tokens) {
        window.tokens.populateCommonTokens = populateEnhancedCommonTokens;
        window.tokens.populateTokenList = populateEnhancedTokenList;
        window.tokens.populateTokensTable = populateEnhancedTokensTable;
        window.tokens.updateFromTokenDisplay = () => updateTokenSelectorDisplay(window.tokens.getSelectedFromToken(), 'from-token');
        window.tokens.updateToTokenDisplay = () => updateTokenSelectorDisplay(window.tokens.getSelectedToToken(), 'to-token');
    }
    
    // Export enhanced functions
    window.enhancedTokenDisplay = {
        updateTokenSelectorDisplay,
        populateEnhancedCommonTokens,
        populateEnhancedTokenList,
        populateEnhancedTokensTable,
        populateEnhancedPools
    };
}

// Initialize enhanced displays
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(enhanceTokenDisplays, 100);
    });
} else {
    setTimeout(enhanceTokenDisplays, 100);
}