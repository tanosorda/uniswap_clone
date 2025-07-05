// Token management functionality

let selectedFromToken = 'ETH';
let selectedToToken = null;
let isSelectingFromToken = false;

// Initialize token functionality
function initializeTokens() {
    setupTokenSelection();
    setupTokenSearch();
    setupSwapCalculation();
    populateTokensTable();
    startPriceUpdates();
}

// Setup token selection
function setupTokenSelection() {
    const fromTokenBtn = document.getElementById('from-token');
    const toTokenBtn = document.getElementById('to-token');
    const tokenModal = document.getElementById('token-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = tokenModal.querySelector('.modal-backdrop');

    fromTokenBtn.addEventListener('click', () => {
        isSelectingFromToken = true;
        openTokenModal();
    });

    toTokenBtn.addEventListener('click', () => {
        isSelectingFromToken = false;
        openTokenModal();
    });

    modalClose.addEventListener('click', closeTokenModal);
    modalBackdrop.addEventListener('click', closeTokenModal);

    // Setup swap direction button
    const swapDirectionBtn = document.getElementById('swap-direction');
    swapDirectionBtn.addEventListener('click', swapTokens);
}

// Setup token search
function setupTokenSearch() {
    const searchInput = document.getElementById('token-search');
    const debouncedSearch = utils.debounce(searchTokens, 300);

    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
}

// Setup swap calculation
function setupSwapCalculation() {
    const fromAmountInput = document.getElementById('from-amount');
    const debouncedCalculate = utils.debounce(calculateSwap, 300);

    fromAmountInput.addEventListener('input', debouncedCalculate);
}

// Open token modal
function openTokenModal() {
    const modal = document.getElementById('token-modal');
    modal.classList.add('active');
    
    // Populate common tokens
    populateCommonTokens();
    
    // Populate token list
    populateTokenList();
    
    // Focus search input
    const searchInput = document.getElementById('token-search');
    searchInput.focus();
    searchInput.value = '';
}

// Close token modal
function closeTokenModal() {
    const modal = document.getElementById('token-modal');
    modal.classList.remove('active');
}

// Populate common tokens
function populateCommonTokens() {
    const container = document.getElementById('common-tokens-list');
    container.innerHTML = '';

    window.commonTokens.forEach(symbol => {
        const token = window.tokenData[symbol];
        if (!token) return;

        const tokenElement = document.createElement('div');
        tokenElement.className = 'common-token';
        tokenElement.innerHTML = `
            <div class="token-icon ${utils.getTokenIcon(symbol)}"></div>
            <span class="token-symbol">${symbol}</span>
        `;

        tokenElement.addEventListener('click', () => {
            selectToken(symbol);
        });

        container.appendChild(tokenElement);
    });
}

// Populate token list
function populateTokenList(searchQuery = '') {
    const container = document.getElementById('token-list');
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
        tokenElement.innerHTML = `
            <div class="token-icon ${utils.getTokenIcon(token.symbol)}"></div>
            <div class="token-info">
                <div class="token-name">${token.name}</div>
                <div class="token-symbol">${token.symbol}</div>
            </div>
            <div class="token-balance">${utils.formatTokenAmount(balance)}</div>
        `;

        tokenElement.addEventListener('click', () => {
            selectToken(token.symbol);
        });

        container.appendChild(tokenElement);
    });
}

// Search tokens
function searchTokens(query) {
    populateTokenList(query);
}

// Select token
function selectToken(symbol) {
    if (isSelectingFromToken) {
        // Don't allow selecting the same token as "to" token
        if (symbol === selectedToToken) {
            swapTokens();
        } else {
            selectedFromToken = symbol;
            updateFromTokenDisplay();
        }
    } else {
        // Don't allow selecting the same token as "from" token
        if (symbol === selectedFromToken) {
            swapTokens();
        } else {
            selectedToToken = symbol;
            updateToTokenDisplay();
        }
    }
    
    closeTokenModal();
    updateTokenBalances();
    calculateSwap();
    updateSwapButton();
}

// Swap tokens
function swapTokens() {
    const temp = selectedFromToken;
    selectedFromToken = selectedToToken;
    selectedToToken = temp;
    
    updateFromTokenDisplay();
    updateToTokenDisplay();
    updateTokenBalances();
    
    // Swap amounts
    const fromAmountInput = document.getElementById('from-amount');
    const toAmountInput = document.getElementById('to-amount');
    const tempAmount = fromAmountInput.value;
    fromAmountInput.value = toAmountInput.value;
    toAmountInput.value = tempAmount;
    
    calculateSwap();
}

// Update from token display
function updateFromTokenDisplay() {
    const fromTokenBtn = document.getElementById('from-token');
    const tokenInfo = fromTokenBtn.querySelector('.token-info');
    
    if (selectedFromToken) {
        const token = window.tokenData[selectedFromToken];
        tokenInfo.innerHTML = `
            <div class="token-icon ${utils.getTokenIcon(selectedFromToken)}"></div>
            <span class="token-symbol">${selectedFromToken}</span>
        `;
    }
}

// Update to token display
function updateToTokenDisplay() {
    const toTokenBtn = document.getElementById('to-token');
    const tokenInfo = toTokenBtn.querySelector('.token-info');
    
    if (selectedToToken) {
        const token = window.tokenData[selectedToToken];
        tokenInfo.innerHTML = `
            <div class="token-icon ${utils.getTokenIcon(selectedToToken)}"></div>
            <span class="token-symbol">${selectedToToken}</span>
        `;
    } else {
        tokenInfo.innerHTML = '<span class="token-symbol">Select token</span>';
    }
}

// Update token balances
function updateTokenBalances() {
    const fromBalance = document.getElementById('from-balance');
    const toBalance = document.getElementById('to-balance');
    
    if (selectedFromToken) {
        const balance = window.userBalances[selectedFromToken] || 0;
        fromBalance.textContent = utils.formatTokenAmount(balance);
    }
    
    if (selectedToToken) {
        const balance = window.userBalances[selectedToToken] || 0;
        toBalance.textContent = utils.formatTokenAmount(balance);
    } else {
        toBalance.textContent = '0';
    }
}

// Calculate swap
function calculateSwap() {
    const fromAmountInput = document.getElementById('from-amount');
    const toAmountInput = document.getElementById('to-amount');
    const fromValueSpan = document.getElementById('from-value');
    const toValueSpan = document.getElementById('to-value');
    const swapDetails = document.getElementById('swap-details');
    
    const fromAmount = parseFloat(fromAmountInput.value) || 0;
    
    if (fromAmount > 0 && selectedFromToken && selectedToToken) {
        // Calculate output amount
        const outputAmount = utils.calculateSwapOutput(fromAmount, selectedFromToken, selectedToToken);
        toAmountInput.value = utils.formatTokenAmount(outputAmount);
        
        // Calculate USD values
        const fromToken = window.tokenData[selectedFromToken];
        const toToken = window.tokenData[selectedToToken];
        const fromValue = fromAmount * fromToken.price;
        const toValue = outputAmount * toToken.price;
        
        fromValueSpan.textContent = utils.formatNumber(fromValue, 2);
        toValueSpan.textContent = utils.formatNumber(toValue, 2);
        
        // Update swap details
        updateSwapDetails(fromAmount, outputAmount);
        swapDetails.style.display = 'block';
    } else {
        toAmountInput.value = '';
        fromValueSpan.textContent = '0.00';
        toValueSpan.textContent = '0.00';
        swapDetails.style.display = 'none';
    }
}

// Update swap details
function updateSwapDetails(fromAmount, toAmount) {
    const swapRateText = document.getElementById('swap-rate-text');
    const expectedOutput = document.getElementById('expected-output');
    const priceImpact = document.getElementById('price-impact');
    
    if (selectedFromToken && selectedToToken) {
        const rate = toAmount / fromAmount;
        swapRateText.textContent = `1 ${selectedFromToken} = ${utils.formatTokenAmount(rate)} ${selectedToToken}`;
        
        expectedOutput.textContent = `${utils.formatTokenAmount(toAmount)} ${selectedToToken}`;
        
        const impact = utils.calculatePriceImpact(fromAmount, selectedFromToken, selectedToToken);
        priceImpact.textContent = `${impact.toFixed(2)}%`;
        priceImpact.className = impact > 3 ? 'red' : impact > 1 ? 'orange' : 'green';
    }
}

// Update swap button
function updateSwapButton() {
    const swapButton = document.getElementById('swap-button');
    const swapButtonText = swapButton.querySelector('span');
    
    if (!window.walletState.isConnected) {
        swapButtonText.textContent = 'Connect Wallet';
        swapButton.disabled = false;
        return;
    }
    
    const fromAmount = parseFloat(document.getElementById('from-amount').value) || 0;
    
    if (!selectedToToken) {
        swapButtonText.textContent = 'Select a token';
        swapButton.disabled = true;
        return;
    }
    
    if (fromAmount === 0) {
        swapButtonText.textContent = 'Enter an amount';
        swapButton.disabled = true;
        return;
    }
    
    const balance = window.userBalances[selectedFromToken] || 0;
    if (fromAmount > balance) {
        swapButtonText.textContent = `Insufficient ${selectedFromToken} balance`;
        swapButton.disabled = true;
        return;
    }
    
    swapButtonText.textContent = 'Swap';
    swapButton.disabled = false;
}

// Populate tokens table
function populateTokensTable() {
    const tableBody = document.getElementById('tokens-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const tokens = Object.values(window.tokenData)
        .sort((a, b) => b.marketCap - a.marketCap);
    
    tokens.forEach((token, index) => {
        const row = document.createElement('div');
        row.className = 'table-row';
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
        
        row.addEventListener('click', () => {
            // Navigate to token detail (placeholder)
            utils.showToast(`Viewing ${token.name} details`, 'info');
        });
        
        tableBody.appendChild(row);
    });
}

// Start price updates
function startPriceUpdates() {
    setInterval(() => {
        // Update token prices with small random changes
        Object.keys(window.tokenData).forEach(symbol => {
            const token = window.tokenData[symbol];
            const volatility = symbol === 'USDC' || symbol === 'USDT' || symbol === 'DAI' ? 0.001 : 0.02;
            token.price = utils.generatePriceMovement(token.price, volatility);
            
            // Update price changes
            token.priceChange1h += (Math.random() - 0.5) * 0.1;
            token.priceChange24h += (Math.random() - 0.5) * 0.2;
            token.priceChange7d += (Math.random() - 0.5) * 0.5;
        });
        
        // Recalculate swap if active
        const fromAmount = parseFloat(document.getElementById('from-amount').value) || 0;
        if (fromAmount > 0 && selectedFromToken && selectedToToken) {
            calculateSwap();
        }
        
        // Update tokens table if visible
        const tokensSection = document.getElementById('tokens');
        if (tokensSection && tokensSection.classList.contains('active')) {
            populateTokensTable();
        }
    }, 10000); // Update every 10 seconds
}

// Export token functions
window.tokens = {
    initialize: initializeTokens,
    getSelectedFromToken: () => selectedFromToken,
    getSelectedToToken: () => selectedToToken,
    updateSwapButton
};