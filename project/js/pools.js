// Liquidity pools management

// Mock pool data
const poolData = [
  {
    id: '1',
    token0: 'ETH',
    token1: 'USDC',
    fee: 0.3,
    tvl: 125000000,
    volume24h: 15000000,
    fees24h: 45000,
    apr: 12.5,
    userLiquidity: 5000,
    userPosition: true
  },
  {
    id: '2',
    token0: 'USDC',
    token1: 'USDT',
    fee: 0.05,
    tvl: 85000000,
    volume24h: 8500000,
    fees24h: 4250,
    apr: 3.2,
    userLiquidity: 0,
    userPosition: false
  },
  {
    id: '3',
    token0: 'WBTC',
    token1: 'ETH',
    fee: 0.3,
    tvl: 95000000,
    volume24h: 12000000,
    fees24h: 36000,
    apr: 15.8,
    userLiquidity: 2500,
    userPosition: true
  },
  {
    id: '4',
    token0: 'DAI',
    token1: 'USDC',
    fee: 0.05,
    tvl: 45000000,
    volume24h: 3200000,
    fees24h: 1600,
    apr: 2.1,
    userLiquidity: 0,
    userPosition: false
  },
  {
    id: '5',
    token0: 'UNI',
    token1: 'ETH',
    fee: 0.3,
    tvl: 35000000,
    volume24h: 2800000,
    fees24h: 8400,
    apr: 8.7,
    userLiquidity: 0,
    userPosition: false
  },
  {
    id: '6',
    token0: 'LINK',
    token1: 'ETH',
    fee: 0.3,
    tvl: 28000000,
    volume24h: 2100000,
    fees24h: 6300,
    apr: 9.4,
    userLiquidity: 0,
    userPosition: false
  },
  {
    id: '7',
    token0: 'AAVE',
    token1: 'ETH',
    fee: 0.3,
    tvl: 22000000,
    volume24h: 1800000,
    fees24h: 5400,
    apr: 11.2,
    userLiquidity: 0,
    userPosition: false
  },
  {
    id: '8',
    token0: 'COMP',
    token1: 'ETH',
    fee: 0.3,
    tvl: 18000000,
    volume24h: 1500000,
    fees24h: 4500,
    apr: 10.1,
    userLiquidity: 0,
    userPosition: false
  },
  {
    id: '9',
    token0: 'MATIC',
    token1: 'ETH',
    fee: 0.3,
    tvl: 15000000,
    volume24h: 1200000,
    fees24h: 3600,
    apr: 8.9,
    userLiquidity: 0,
    userPosition: false
  }
];

// Filter state
let currentFilter = 'all';
let searchQuery = '';

// Initialize pools functionality
function initializePools() {
  setupPoolFilters();
  setupPoolSearch();
  renderPools();
  startPoolUpdates();
}

// Setup pool filters
function setupPoolFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Update filter
      currentFilter = button.textContent.toLowerCase().replace(' ', '-');
      renderPools();
    });
  });
}

// Setup pool search
function setupPoolSearch() {
  const searchInput = document.getElementById('pool-search');
  const debouncedSearch = utils.debounce(searchPools, 300);
  
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    debouncedSearch();
  });
}

// Search pools
function searchPools() {
  renderPools();
}

// Filter pools based on current filter and search
function filterPools() {
  let filteredPools = [...poolData];
  
  // Apply filter
  switch (currentFilter) {
    case 'my-pools':
      filteredPools = filteredPools.filter(pool => pool.userPosition);
      break;
    case 'top-pools':
      filteredPools = filteredPools.sort((a, b) => b.tvl - a.tvl).slice(0, 10);
      break;
    default:
      // Show all pools
      break;
  }
  
  // Apply search
  if (searchQuery) {
    filteredPools = filteredPools.filter(pool => 
      pool.token0.toLowerCase().includes(searchQuery) ||
      pool.token1.toLowerCase().includes(searchQuery) ||
      `${pool.token0}/${pool.token1}`.toLowerCase().includes(searchQuery)
    );
  }
  
  return filteredPools;
}

// Render pools
function renderPools() {
  const poolsGrid = document.getElementById('pools-grid');
  const filteredPools = filterPools();
  
  poolsGrid.innerHTML = '';
  
  if (filteredPools.length === 0) {
    poolsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M24 16V32M16 24H32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h3>No pools found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    `;
    return;
  }
  
  filteredPools.forEach(pool => {
    const poolCard = createPoolCard(pool);
    poolsGrid.appendChild(poolCard);
  });
}

// Create pool card
function createPoolCard(pool) {
  const poolCard = document.createElement('div');
  poolCard.className = 'pool-card';
  
  const token0 = window.tokens.getToken(pool.token0);
  const token1 = window.tokens.getToken(pool.token1);
  
  poolCard.innerHTML = `
    <div class="pool-card-header">
      <div class="pool-tokens">
        <div class="pool-token" style="background: linear-gradient(135deg, #FF007A, #00D9FF);">
          ${token0 ? token0.icon : pool.token0[0]}
        </div>
        <div class="pool-token" style="background: linear-gradient(135deg, #7C4DFF, #FF4081);">
          ${token1 ? token1.icon : pool.token1[0]}
        </div>
      </div>
      <div class="pool-name">${pool.token0}/${pool.token1}</div>
      <div class="pool-fee">${pool.fee}%</div>
    </div>
    
    <div class="pool-stats">
      <div class="pool-stat">
        <div class="pool-stat-label">TVL</div>
        <div class="pool-stat-value">${utils.formatCurrency(pool.tvl, 0)}</div>
      </div>
      <div class="pool-stat">
        <div class="pool-stat-label">24h Volume</div>
        <div class="pool-stat-value">${utils.formatCurrency(pool.volume24h, 0)}</div>
      </div>
      <div class="pool-stat">
        <div class="pool-stat-label">24h Fees</div>
        <div class="pool-stat-value">${utils.formatCurrency(pool.fees24h, 0)}</div>
      </div>
      <div class="pool-stat">
        <div class="pool-stat-label">APR</div>
        <div class="pool-stat-value">${utils.formatPercentage(pool.apr)}</div>
      </div>
    </div>
    
    ${pool.userPosition ? `
      <div class="pool-user-position">
        <div class="pool-stat-label">Your Position</div>
        <div class="pool-stat-value">${utils.formatCurrency(pool.userLiquidity)}</div>
      </div>
    ` : ''}
  `;
  
  poolCard.addEventListener('click', () => {
    showPoolDetails(pool);
  });
  
  return poolCard;
}

// Show pool details modal
function showPoolDetails(pool) {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  
  const token0 = window.tokens.getToken(pool.token0);
  const token1 = window.tokens.getToken(pool.token1);
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${pool.token0}/${pool.token1} Pool</h3>
        <button class="modal-close">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      
      <div class="pool-details">
        <div class="pool-detail-section">
          <h4>Pool Information</h4>
          <div class="pool-detail-grid">
            <div class="pool-detail-item">
              <span class="label">Fee Tier</span>
              <span class="value">${pool.fee}%</span>
            </div>
            <div class="pool-detail-item">
              <span class="label">Total Value Locked</span>
              <span class="value">${utils.formatCurrency(pool.tvl)}</span>
            </div>
            <div class="pool-detail-item">
              <span class="label">24h Volume</span>
              <span class="value">${utils.formatCurrency(pool.volume24h)}</span>
            </div>
            <div class="pool-detail-item">
              <span class="label">24h Fees</span>
              <span class="value">${utils.formatCurrency(pool.fees24h)}</span>
            </div>
            <div class="pool-detail-item">
              <span class="label">APR</span>
              <span class="value">${utils.formatPercentage(pool.apr)}</span>
            </div>
          </div>
        </div>
        
        ${pool.userPosition ? `
          <div class="pool-detail-section">
            <h4>Your Position</h4>
            <div class="pool-detail-grid">
              <div class="pool-detail-item">
                <span class="label">Your Liquidity</span>
                <span class="value">${utils.formatCurrency(pool.userLiquidity)}</span>
              </div>
              <div class="pool-detail-item">
                <span class="label">Share of Pool</span>
                <span class="value">${utils.formatPercentage(pool.userLiquidity / pool.tvl * 100)}</span>
              </div>
            </div>
            <div class="pool-actions">
              <button class="btn btn-primary">Add Liquidity</button>
              <button class="btn btn-secondary">Remove Liquidity</button>
            </div>
          </div>
        ` : `
          <div class="pool-detail-section">
            <div class="pool-actions">
              <button class="btn btn-primary">Add Liquidity</button>
            </div>
          </div>
        `}
      </div>
    </div>
  `;
  
  // Add styles for pool details
  const style = document.createElement('style');
  style.textContent = `
    .pool-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }
    
    .pool-detail-section h4 {
      margin-bottom: var(--spacing-md);
      color: var(--text-primary);
      font-weight: var(--font-weight-bold);
    }
    
    .pool-detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
    }
    
    .pool-detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm);
      background-color: var(--surface-secondary);
      border-radius: var(--radius-md);
    }
    
    .pool-detail-item .label {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
    }
    
    .pool-detail-item .value {
      color: var(--text-primary);
      font-weight: var(--font-weight-medium);
    }
    
    .pool-actions {
      display: flex;
      gap: var(--spacing-sm);
    }
    
    .pool-actions .btn {
      flex: 1;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(modal);
  
  // Add event listeners
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
    document.head.removeChild(style);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
      document.head.removeChild(style);
    }
  });
  
  // Add liquidity button
  const addLiquidityBtn = modal.querySelector('.btn-primary');
  addLiquidityBtn.addEventListener('click', () => {
    utils.showToast('Add liquidity feature coming soon!', 'info');
  });
  
  // Remove liquidity button
  const removeLiquidityBtn = modal.querySelector('.btn-secondary');
  if (removeLiquidityBtn) {
    removeLiquidityBtn.addEventListener('click', () => {
      utils.showToast('Remove liquidity feature coming soon!', 'info');
    });
  }
}

// Setup create pool button
function setupCreatePool() {
  const createPoolBtn = document.querySelector('.create-pool-btn');
  
  createPoolBtn.addEventListener('click', () => {
    utils.showToast('Create pool feature coming soon!', 'info');
  });
}

// Simulate pool data updates
function startPoolUpdates() {
  setInterval(() => {
    poolData.forEach(pool => {
      // Simulate small changes in volume, fees, and APR
      const volumeChange = (Math.random() - 0.5) * 0.02; // ±1%
      const feesChange = volumeChange; // Fees follow volume
      const aprChange = (Math.random() - 0.5) * 0.1; // ±0.05%
      
      pool.volume24h *= (1 + volumeChange);
      pool.fees24h *= (1 + feesChange);
      pool.apr += aprChange;
      
      // Keep APR positive
      if (pool.apr < 0) pool.apr = 0.1;
    });
    
    // Re-render pools if we're on the pools section
    const poolsSection = document.getElementById('pools');
    if (poolsSection.classList.contains('active')) {
      renderPools();
    }
  }, 30000); // Update every 30 seconds
}

// Get pool by ID
function getPool(id) {
  return poolData.find(pool => pool.id === id);
}

// Get all pools
function getAllPools() {
  return poolData;
}

// Get user pools
function getUserPools() {
  return poolData.filter(pool => pool.userPosition);
}

// Export pool functions
window.pools = {
  initialize: initializePools,
  setupCreatePool,
  getPool,
  getAllPools,
  getUserPools
};