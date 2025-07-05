// Mock data for Uniswap clone

// Token data with real-like information
window.tokenData = {
    ETH: {
        name: 'Ethereum',
        symbol: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        price: 2450.32,
        priceChange1h: 0.12,
        priceChange24h: 3.25,
        priceChange7d: -2.15,
        volume24h: 15420000000,
        marketCap: 294500000000,
        tvl: 125000000000,
        icon: 'eth-icon',
        isCommon: true
    },
    USDC: {
        name: 'USD Coin',
        symbol: 'USDC',
        address: '0xA0b86a33E6441b4C3b0bF8B0b7e3e6b5B6c6A6b7',
        decimals: 6,
        price: 1.00,
        priceChange1h: 0.01,
        priceChange24h: 0.02,
        priceChange7d: -0.01,
        volume24h: 8500000000,
        marketCap: 32500000000,
        tvl: 85000000000,
        icon: 'usdc-icon',
        isCommon: true
    },
    USDT: {
        name: 'Tether',
        symbol: 'USDT',
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6,
        price: 1.00,
        priceChange1h: -0.01,
        priceChange24h: -0.02,
        priceChange7d: 0.01,
        volume24h: 12800000000,
        marketCap: 83200000000,
        tvl: 95000000000,
        icon: 'usdt-icon',
        isCommon: true
    },
    WBTC: {
        name: 'Wrapped Bitcoin',
        symbol: 'WBTC',
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        decimals: 8,
        price: 42350.75,
        priceChange1h: 0.25,
        priceChange24h: 2.15,
        priceChange7d: -1.85,
        volume24h: 1200000000,
        marketCap: 6800000000,
        tvl: 28000000000,
        icon: 'wbtc-icon',
        isCommon: true
    },
    DAI: {
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        decimals: 18,
        price: 1.00,
        priceChange1h: 0.00,
        priceChange24h: 0.05,
        priceChange7d: -0.02,
        volume24h: 850000000,
        marketCap: 5200000000,
        tvl: 45000000000,
        icon: 'dai-icon',
        isCommon: true
    },
    UNI: {
        name: 'Uniswap',
        symbol: 'UNI',
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        decimals: 18,
        price: 6.82,
        priceChange1h: -0.45,
        priceChange24h: -1.25,
        priceChange7d: 5.85,
        volume24h: 280000000,
        marketCap: 5100000000,
        tvl: 35000000000,
        icon: 'uni-icon',
        isCommon: true
    },
    LINK: {
        name: 'Chainlink',
        symbol: 'LINK',
        address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        decimals: 18,
        price: 14.32,
        priceChange1h: 0.78,
        priceChange24h: 4.25,
        priceChange7d: -2.15,
        volume24h: 420000000,
        marketCap: 8200000000,
        tvl: 28000000000,
        icon: 'link-icon',
        isCommon: false
    },
    AAVE: {
        name: 'Aave',
        symbol: 'AAVE',
        address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        decimals: 18,
        price: 87.45,
        priceChange1h: -0.25,
        priceChange24h: -2.15,
        priceChange7d: 8.45,
        volume24h: 180000000,
        marketCap: 1300000000,
        tvl: 22000000000,
        icon: 'aave-icon',
        isCommon: false
    },
    COMP: {
        name: 'Compound',
        symbol: 'COMP',
        address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        decimals: 18,
        price: 56.78,
        priceChange1h: 1.25,
        priceChange24h: 1.85,
        priceChange7d: -5.25,
        volume24h: 95000000,
        marketCap: 580000000,
        tvl: 18000000000,
        icon: 'comp-icon',
        isCommon: false
    },
    MATIC: {
        name: 'Polygon',
        symbol: 'MATIC',
        address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        decimals: 18,
        price: 0.92,
        priceChange1h: 2.15,
        priceChange24h: 5.85,
        priceChange7d: 12.45,
        volume24h: 320000000,
        marketCap: 8500000000,
        tvl: 15000000000,
        icon: 'matic-icon',
        isCommon: false
    }
};

// Pool data
window.poolData = [
    {
        id: '1',
        token0: 'ETH',
        token1: 'USDC',
        fee: 0.3,
        tvl: 125000000,
        volume24h: 15000000,
        volume7d: 95000000,
        fees24h: 45000,
        apr: 12.5
    },
    {
        id: '2',
        token0: 'USDC',
        token1: 'USDT',
        fee: 0.05,
        tvl: 85000000,
        volume24h: 8500000,
        volume7d: 52000000,
        fees24h: 4250,
        apr: 3.2
    },
    {
        id: '3',
        token0: 'WBTC',
        token1: 'ETH',
        fee: 0.3,
        tvl: 95000000,
        volume24h: 12000000,
        volume7d: 78000000,
        fees24h: 36000,
        apr: 15.8
    },
    {
        id: '4',
        token0: 'DAI',
        token1: 'USDC',
        fee: 0.05,
        tvl: 45000000,
        volume24h: 3200000,
        volume7d: 21000000,
        fees24h: 1600,
        apr: 2.1
    },
    {
        id: '5',
        token0: 'UNI',
        token1: 'ETH',
        fee: 0.3,
        tvl: 35000000,
        volume24h: 2800000,
        volume7d: 18500000,
        fees24h: 8400,
        apr: 8.7
    },
    {
        id: '6',
        token0: 'LINK',
        token1: 'ETH',
        fee: 0.3,
        tvl: 28000000,
        volume24h: 2100000,
        volume7d: 14200000,
        fees24h: 6300,
        apr: 9.4
    },
    {
        id: '7',
        token0: 'AAVE',
        token1: 'ETH',
        fee: 0.3,
        tvl: 22000000,
        volume24h: 1800000,
        volume7d: 11800000,
        fees24h: 5400,
        apr: 11.2
    }
];

// NFT collection data
window.nftData = [
    {
        id: '1',
        name: 'Bored Ape Yacht Club',
        slug: 'boredapeyachtclub',
        floorPrice: 15.2,
        volume24h: 1250.5,
        change24h: 5.2,
        image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
        id: '2',
        name: 'CryptoPunks',
        slug: 'cryptopunks',
        floorPrice: 45.8,
        volume24h: 2150.8,
        change24h: -2.1,
        image: 'https://images.pexels.com/photos/7567526/pexels-photo-7567526.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
        id: '3',
        name: 'Azuki',
        slug: 'azuki',
        floorPrice: 8.5,
        volume24h: 850.2,
        change24h: 12.5,
        image: 'https://images.pexels.com/photos/7567240/pexels-photo-7567240.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
        id: '4',
        name: 'Mutant Ape Yacht Club',
        slug: 'mutant-ape-yacht-club',
        floorPrice: 4.2,
        volume24h: 420.8,
        change24h: -8.5,
        image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
        id: '5',
        name: 'Doodles',
        slug: 'doodles-official',
        floorPrice: 2.8,
        volume24h: 185.5,
        change24h: 3.2,
        image: 'https://images.pexels.com/photos/7567526/pexels-photo-7567526.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
        id: '6',
        name: 'CloneX',
        slug: 'clonex',
        floorPrice: 3.5,
        volume24h: 285.2,
        change24h: 7.8,
        image: 'https://images.pexels.com/photos/7567240/pexels-photo-7567240.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    }
];

// User balances (mock data)
window.userBalances = {
    ETH: 1.2345,
    USDC: 1250.50,
    USDT: 850.25,
    WBTC: 0.0234,
    DAI: 500.00,
    UNI: 45.67,
    LINK: 125.80,
    AAVE: 8.45,
    COMP: 12.50,
    MATIC: 1250.00
};

// Common tokens for quick selection
window.commonTokens = ['ETH', 'USDC', 'USDT', 'WBTC', 'DAI', 'UNI'];

// Wallet connection state
window.walletState = {
    isConnected: false,
    address: null,
    balance: 0,
    network: 'ethereum'
};