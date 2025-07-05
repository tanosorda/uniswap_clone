// Real wallet connection functionality with MetaMask, WalletConnect, and Coinbase

class RealWalletConnector {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.address = null;
        this.chainId = null;
        this.walletType = null;
        this.isConnected = false;
        
        // Initialize ethers if available
        this.ethers = window.ethers;
        
        // WalletConnect provider
        this.walletConnectProvider = null;
        
        // Coinbase Wallet SDK
        this.coinbaseWallet = null;
    }

    async initialize() {
        // Check if already connected
        await this.checkExistingConnection();
        this.setupEventListeners();
    }

    async checkExistingConnection() {
        // Check MetaMask
        if (window.ethereum && window.ethereum.selectedAddress) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    await this.connectMetaMask(false);
                }
            } catch (error) {
                console.log('No existing MetaMask connection');
            }
        }
    }

    setupEventListeners() {
        // MetaMask events
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.disconnect();
                } else {
                    this.address = accounts[0];
                    this.updateUI();
                }
            });

            window.ethereum.on('chainChanged', (chainId) => {
                this.chainId = chainId;
                this.updateUI();
            });

            window.ethereum.on('disconnect', () => {
                this.disconnect();
            });
        }
    }

    async connectMetaMask(requestPermission = true) {
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed');
            }

            let accounts;
            if (requestPermission) {
                accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
            } else {
                accounts = await window.ethereum.request({ 
                    method: 'eth_accounts' 
                });
            }

            if (accounts.length === 0) {
                throw new Error('No accounts found');
            }

            this.provider = new this.ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            this.address = accounts[0];
            this.chainId = await window.ethereum.request({ method: 'eth_chainId' });
            this.walletType = 'metamask';
            this.isConnected = true;

            // Update wallet state
            window.walletState.isConnected = true;
            window.walletState.address = this.address;
            window.walletState.balance = await this.getBalance();

            this.updateUI();
            utils.showToast('MetaMask connected successfully!', 'success');
            
            return true;
        } catch (error) {
            console.error('MetaMask connection error:', error);
            utils.showToast(error.message || 'Failed to connect MetaMask', 'error');
            return false;
        }
    }

    async connectWalletConnect() {
        try {
            // Dynamic import for WalletConnect
            const WalletConnectProvider = (await import('@walletconnect/web3-provider')).default;
            
            this.walletConnectProvider = new WalletConnectProvider({
                infuraId: "9aa3d95b3bc440fa88ea12eaa4456161", // Public Infura ID
                rpc: {
                    1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                    137: "https://polygon-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
                }
            });

            await this.walletConnectProvider.enable();

            this.provider = new this.ethers.providers.Web3Provider(this.walletConnectProvider);
            this.signer = this.provider.getSigner();
            this.address = await this.signer.getAddress();
            this.chainId = await this.provider.getNetwork().then(n => n.chainId);
            this.walletType = 'walletconnect';
            this.isConnected = true;

            // Update wallet state
            window.walletState.isConnected = true;
            window.walletState.address = this.address;
            window.walletState.balance = await this.getBalance();

            this.updateUI();
            utils.showToast('WalletConnect connected successfully!', 'success');
            
            return true;
        } catch (error) {
            console.error('WalletConnect connection error:', error);
            utils.showToast(error.message || 'Failed to connect WalletConnect', 'error');
            return false;
        }
    }

    async connectCoinbase() {
        try {
            // Dynamic import for Coinbase Wallet SDK
            const { CoinbaseWalletSDK } = await import('@coinbase/wallet-sdk');
            
            this.coinbaseWallet = new CoinbaseWalletSDK({
                appName: 'Uniswap Clone',
                appLogoUrl: 'https://app.uniswap.org/favicon.ico',
                darkMode: false
            });

            const coinbaseProvider = this.coinbaseWallet.makeWeb3Provider(
                "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                1
            );

            const accounts = await coinbaseProvider.request({
                method: 'eth_requestAccounts'
            });

            this.provider = new this.ethers.providers.Web3Provider(coinbaseProvider);
            this.signer = this.provider.getSigner();
            this.address = accounts[0];
            this.chainId = await this.provider.getNetwork().then(n => n.chainId);
            this.walletType = 'coinbase';
            this.isConnected = true;

            // Update wallet state
            window.walletState.isConnected = true;
            window.walletState.address = this.address;
            window.walletState.balance = await this.getBalance();

            this.updateUI();
            utils.showToast('Coinbase Wallet connected successfully!', 'success');
            
            return true;
        } catch (error) {
            console.error('Coinbase Wallet connection error:', error);
            utils.showToast(error.message || 'Failed to connect Coinbase Wallet', 'error');
            return false;
        }
    }

    async getBalance() {
        try {
            if (!this.provider || !this.address) return 0;
            
            const balance = await this.provider.getBalance(this.address);
            return parseFloat(this.ethers.utils.formatEther(balance));
        } catch (error) {
            console.error('Error getting balance:', error);
            return 0;
        }
    }

    async switchNetwork(chainId) {
        try {
            if (!window.ethereum) return false;

            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chainId.toString(16)}` }],
            });
            
            this.chainId = chainId;
            return true;
        } catch (error) {
            console.error('Error switching network:', error);
            return false;
        }
    }

    disconnect() {
        // Disconnect WalletConnect
        if (this.walletConnectProvider && this.walletConnectProvider.disconnect) {
            this.walletConnectProvider.disconnect();
        }

        // Disconnect Coinbase
        if (this.coinbaseWallet && this.coinbaseWallet.disconnect) {
            this.coinbaseWallet.disconnect();
        }

        // Reset state
        this.provider = null;
        this.signer = null;
        this.address = null;
        this.chainId = null;
        this.walletType = null;
        this.isConnected = false;
        this.walletConnectProvider = null;
        this.coinbaseWallet = null;

        // Update global wallet state
        window.walletState.isConnected = false;
        window.walletState.address = null;
        window.walletState.balance = 0;

        this.updateUI();
        utils.showToast('Wallet disconnected', 'info');
    }

    updateUI() {
        const connectBtn = document.getElementById('connect-wallet');
        
        if (this.isConnected && this.address) {
            const truncatedAddress = utils.truncateAddress(this.address);
            connectBtn.textContent = truncatedAddress;
        } else {
            connectBtn.textContent = 'Connect Wallet';
        }

        // Update swap button
        if (window.tokens && window.tokens.updateSwapButton) {
            window.tokens.updateSwapButton();
        }
    }

    getWalletInfo() {
        return {
            isConnected: this.isConnected,
            address: this.address,
            chainId: this.chainId,
            walletType: this.walletType,
            balance: window.walletState.balance
        };
    }
}

// Initialize real wallet connector
const realWalletConnector = new RealWalletConnector();

// Override the original wallet functions
window.connectWallet = async function(walletType) {
    const modal = document.getElementById('wallet-modal');
    modal.classList.remove('active');
    
    const connectBtn = document.getElementById('connect-wallet');
    const originalText = connectBtn.textContent;
    connectBtn.innerHTML = '<div class="loading"><div class="spinner"></div> Connecting...</div>';
    connectBtn.disabled = true;

    let success = false;

    try {
        switch (walletType) {
            case 'metamask':
                success = await realWalletConnector.connectMetaMask();
                break;
            case 'walletconnect':
                success = await realWalletConnector.connectWalletConnect();
                break;
            case 'coinbase':
                success = await realWalletConnector.connectCoinbase();
                break;
            default:
                throw new Error('Unsupported wallet type');
        }
    } catch (error) {
        console.error('Wallet connection error:', error);
        utils.showToast('Failed to connect wallet', 'error');
    }

    if (!success) {
        connectBtn.textContent = originalText;
        connectBtn.disabled = false;
    }
};

window.disconnectWallet = function() {
    realWalletConnector.disconnect();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        realWalletConnector.initialize();
    });
} else {
    realWalletConnector.initialize();
}

// Export for global access
window.realWalletConnector = realWalletConnector;