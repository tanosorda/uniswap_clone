// Main application controller

// Application state
let currentSection = 'swap';

// Initialize application
function initializeApp() {
    setupNavigation();
    setupSettings();
    setupSwapButton();
    initializeModules();
    populateNFTs();
    populatePools();
    
    console.log('🦄 Uniswap clone initialized');
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetSection = link.dataset.section;
            showSection(targetSection);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Show section
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }
}

// Setup settings modal
function setupSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const settingsClose = document.getElementById('settings-close');
    const modalBackdrop = settingsModal.querySelector('.modal-backdrop');
    
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });
    
    settingsClose.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });
    
    modalBackdrop.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });
    
    // Setup slippage buttons
    const slippageButtons = settingsModal.querySelectorAll('.slippage-btn');
    slippageButtons.forEach(button => {
        button.addEventListener('click', () => {
            slippageButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Store slippage setting
            utils.storage.set('slippage', button.textContent);
        });
    });
    
    // Setup toggles
    const toggles = settingsModal.querySelectorAll('.toggle input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            utils.storage.set(toggle.id, toggle.checked);
        });
        
        // Load stored value
        const stored = utils.storage.get(toggle.id);
        if (stored !== null) {
            toggle.checked = stored;
        }
    });
}

// Setup swap button
function setupSwapButton() {
    const swapButton = document.getElementById('swap-button');
    
    swapButton.addEventListener('click', () => {
        if (!window.walletState.isConnected) {
            // Open wallet modal
            const walletModal = document.getElementById('wallet-modal');
            walletModal.classList.add('active');
            return;
        }
        
        executeSwap();
    });
}

// Execute swap
async function executeSwap() {
    const fromAmount = parseFloat(document.getElementById('from-amount').value) || 0;
    const fromToken = window.tokens.getSelectedFromToken();
    const toToken = window.tokens.getSelectedToToken();
    
    if (!fromAmount || !fromToken || !toToken) {
        utils.showToast('Please enter an amount and select tokens', 'warning');
        return;
    }
    
    const balance = window.userBalances[fromToken] || 0;
    if (fromAmount > balance) {
        utils.showToast(`Insufficient ${fromToken} balance`, 'error');
        return;
    }
    
    try {
        // Show loading state
        const swapButton = document.getElementById('swap-button');
        const originalText = swapButton.innerHTML;
        swapButton.innerHTML = '<div class="loading"><div class="spinner"></div> Swapping...</div>';
        swapButton.disabled = true;
        
        // Simulate transaction
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Update balances
        const outputAmount = utils.calculateSwapOutput(fromAmount, fromToken, toToken);
        window.userBalances[fromToken] = (window.userBalances[fromToken] || 0) - fromAmount;
        window.userBalances[toToken] = (window.userBalances[toToken] || 0) + outputAmount;
        
        // Clear inputs
        document.getElementById('from-amount').value = '';
        document.getElementById('to-amount').value = '';
        document.getElementById('from-value').textContent = '0.00';
        document.getElementById('to-value').textContent = '0.00';
        document.getElementById('swap-details').style.display = 'none';
        
        // Update token balances display
        if (window.tokens && window.tokens.updateTokenBalances) {
            window.tokens.updateTokenBalances();
        }
        
        // Reset button
        swapButton.innerHTML = originalText;
        swapButton.disabled = false;
        
        utils.showToast(`Swapped ${fromAmount} ${fromToken} for ${utils.formatTokenAmount(outputAmount)} ${toToken}`, 'success');
        
    } catch (error) {
        console.error('Swap error:', error);
        utils.showToast('Swap failed. Please try again.', 'error');
        
        // Reset button
        const swapButton = document.getElementById('swap-button');
        swapButton.innerHTML = '<span>Swap</span>';
        swapButton.disabled = false;
    }
}

// Initialize modules
function initializeModules() {
    if (window.tokens) {
        window.tokens.initialize();
    }
    
    if (window.wallet) {
        window.wallet.initialize();
    }
}

// Populate NFTs
function populateNFTs() {
    const nftsGrid = document.getElementById('nfts-grid');
    if (!nftsGrid) return;
    
    nftsGrid.innerHTML = '';
    
    window.nftData.forEach(nft => {
        const nftCard = document.createElement('div');
        nftCard.className = 'nft-card';
        nftCard.innerHTML = `
            <div class="nft-image" style="background-image: url('${nft.image}')"></div>
            <div class="nft-info">
                <div class="nft-name">${nft.name}</div>
                <div class="nft-stats">
                    <span>Floor: ${nft.floorPrice} ETH</span>
                    <span class="${utils.getPercentageColor(nft.change24h)}">
                        ${utils.formatPercentage(nft.change24h)}
                    </span>
                </div>
            </div>
        `;
        
        nftCard.addEventListener('click', () => {
            utils.showToast(`Viewing ${nft.name} collection`, 'info');
        });
        
        nftsGrid.appendChild(nftCard);
    });
}

// Populate pools
function populatePools() {
    const poolsTableBody = document.getElementById('pools-table-body');
    if (!poolsTableBody) return;
    
    poolsTableBody.innerHTML = '';
    
    window.poolData.forEach((pool, index) => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div class="table-cell">${index + 1}</div>
            <div class="table-cell">
                <div class="pool-name-cell">
                    <div class="pool-tokens">
                        <div class="token-icon ${utils.getTokenIcon(pool.token0)}"></div>
                        <div class="token-icon ${utils.getTokenIcon(pool.token1)}"></div>
                    </div>
                    <div class="pool-name">${pool.token0}/${pool.token1}</div>
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
            utils.showToast(`Viewing ${pool.token0}/${pool.token1} pool details`, 'info');
        });
        
        poolsTableBody.appendChild(row);
    });
}

// Setup filter buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from siblings
            const siblings = button.parentNode.querySelectorAll('.filter-btn');
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Apply filter (placeholder)
            utils.showToast(`Applied ${button.textContent} filter`, 'info');
        });
    });
}

// Handle keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Escape key closes modals
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
        
        // Ctrl/Cmd + K opens search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
}

// Setup error handling
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        utils.showToast('Something went wrong', 'error');
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        utils.showToast('Network error occurred', 'error');
    });
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Setup additional functionality
setupFilters();
setupKeyboardShortcuts();
setupErrorHandling();

// Export app functions
window.app = {
    showSection,
    executeSwap
};