// Wallet connection functionality

// Initialize wallet functionality
function initializeWallet() {
    setupWalletConnection();
    checkStoredConnection();
}

// Setup wallet connection
function setupWalletConnection() {
    const connectWalletBtn = document.getElementById('connect-wallet');
    const walletModal = document.getElementById('wallet-modal');
    const walletClose = document.getElementById('wallet-close');
    const modalBackdrop = walletModal.querySelector('.modal-backdrop');

    connectWalletBtn.addEventListener('click', () => {
        if (window.walletState.isConnected) {
            showWalletMenu();
        } else {
            openWalletModal();
        }
    });

    walletClose.addEventListener('click', closeWalletModal);
    modalBackdrop.addEventListener('click', closeWalletModal);

    // Setup wallet options
    const walletOptions = walletModal.querySelectorAll('.wallet-option');
    walletOptions.forEach(option => {
        option.addEventListener('click', () => {
            const walletType = option.dataset.wallet;
            connectWallet(walletType);
        });
    });
}

// Open wallet modal
function openWalletModal() {
    const modal = document.getElementById('wallet-modal');
    modal.classList.add('active');
}

// Close wallet modal
function closeWalletModal() {
    const modal = document.getElementById('wallet-modal');
    modal.classList.remove('active');
}

// Connect wallet
async function connectWallet(walletType) {
    closeWalletModal();
    
    try {
        // Show loading state
        const connectBtn = document.getElementById('connect-wallet');
        const originalText = connectBtn.textContent;
        connectBtn.innerHTML = '<div class="loading"><div class="spinner"></div> Connecting...</div>';
        connectBtn.disabled = true;

        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock successful connection
        const mockAddresses = [
            '0x742d35Cc6634C0532925a3b8D404d3aDD36fF0a2',
            '0x8ba1f109551bD432803012645Hac136c9851B4bd',
            '0x4e83362442B8d1beC281594ceA3050c8EB01311C'
        ];

        const randomAddress = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
        const mockBalance = Math.random() * 5 + 0.1; // Random balance between 0.1 and 5.1 ETH

        // Update wallet state
        window.walletState.isConnected = true;
        window.walletState.address = randomAddress;
        window.walletState.balance = mockBalance;

        // Update UI
        updateWalletDisplay();
        updateSwapButton();

        // Store connection
        utils.storage.set('wallet_connection', {
            type: walletType,
            address: randomAddress,
            balance: mockBalance
        });

        utils.showToast(`Connected to ${getWalletName(walletType)}`, 'success');

    } catch (error) {
        console.error('Wallet connection error:', error);
        utils.showToast('Failed to connect wallet', 'error');
        
        // Reset button
        const connectBtn = document.getElementById('connect-wallet');
        connectBtn.textContent = 'Connect Wallet';
        connectBtn.disabled = false;
    }
}

// Disconnect wallet
function disconnectWallet() {
    window.walletState.isConnected = false;
    window.walletState.address = null;
    window.walletState.balance = 0;

    updateWalletDisplay();
    updateSwapButton();

    utils.storage.remove('wallet_connection');
    utils.showToast('Wallet disconnected', 'info');
}

// Update wallet display
function updateWalletDisplay() {
    const connectBtn = document.getElementById('connect-wallet');

    if (window.walletState.isConnected) {
        const truncatedAddress = utils.truncateAddress(window.walletState.address);
        connectBtn.textContent = truncatedAddress;
    } else {
        connectBtn.textContent = 'Connect Wallet';
    }

    connectBtn.disabled = false;
}

// Update swap button
function updateSwapButton() {
    if (window.tokens && window.tokens.updateSwapButton) {
        window.tokens.updateSwapButton();
    }
}

// Show wallet menu
function showWalletMenu() {
    const menu = document.createElement('div');
    menu.className = 'dropdown-content';
    menu.style.position = 'absolute';
    menu.style.top = '100%';
    menu.style.right = '0';
    menu.style.marginTop = '8px';
    menu.style.zIndex = '1000';

    menu.innerHTML = `
        <div class="dropdown-item" onclick="copyAddress()">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6H2C1.45 6 1 6.45 1 7V14C1 14.55 1.45 15 2 15H9C9.55 15 10 14.55 10 14V12" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M6 1H13C13.55 1 14 1.45 14 2V9C14 9.55 13.55 10 13 10H6C5.45 10 5 9.55 5 9V2C5 1.45 5.45 1 6 1Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
            Copy Address
        </div>
        <div class="dropdown-item" onclick="viewOnExplorer()">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            View on Explorer
        </div>
        <div class="dropdown-item" onclick="disconnectWallet()">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 2H14V14H6" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M10 8H2M2 8L4 6M2 8L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Disconnect
        </div>
    `;

    // Position menu relative to connect button
    const connectBtn = document.getElementById('connect-wallet');
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown active';
    dropdown.style.position = 'relative';
    dropdown.style.display = 'inline-block';

    dropdown.appendChild(menu);
    connectBtn.parentNode.insertBefore(dropdown, connectBtn.nextSibling);

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 100);

    function handleClickOutside(e) {
        if (!dropdown.contains(e.target) && !connectBtn.contains(e.target)) {
            document.removeEventListener('click', handleClickOutside);
            if (dropdown.parentNode) {
                dropdown.parentNode.removeChild(dropdown);
            }
        }
    }
}

// Copy address to clipboard
function copyAddress() {
    if (window.walletState.address) {
        utils.copyToClipboard(window.walletState.address);
    }
}

// View on explorer
function viewOnExplorer() {
    if (window.walletState.address) {
        const url = `https://etherscan.io/address/${window.walletState.address}`;
        window.open(url, '_blank');
    }
}

// Check for stored wallet connection
function checkStoredConnection() {
    const storedConnection = utils.storage.get('wallet_connection');
    
    if (storedConnection) {
        window.walletState.isConnected = true;
        window.walletState.address = storedConnection.address;
        window.walletState.balance = storedConnection.balance;
        
        updateWalletDisplay();
        updateSwapButton();
    }
}

// Get wallet name
function getWalletName(walletType) {
    const names = {
        metamask: 'MetaMask',
        walletconnect: 'WalletConnect',
        coinbase: 'Coinbase Wallet'
    };
    
    return names[walletType] || 'Wallet';
}

// Make functions globally available
window.copyAddress = copyAddress;
window.viewOnExplorer = viewOnExplorer;
window.disconnectWallet = disconnectWallet;

// Export wallet functions
window.wallet = {
    initialize: initializeWallet,
    connect: connectWallet,
    disconnect: disconnectWallet,
    isConnected: () => window.walletState.isConnected,
    getAddress: () => window.walletState.address,
    getBalance: () => window.walletState.balance
};