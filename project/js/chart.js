// Price chart functionality

// Chart data
let chartData = [];
let currentTimeframe = '1H';
let chartContainer = null;

// Initialize chart
function initializeChart() {
  chartContainer = document.getElementById('price-chart');
  setupChartControls();
  generateInitialData();
  renderChart();
  startChartUpdates();
}

// Setup chart timeframe controls
function setupChartControls() {
  const timeframeButtons = document.querySelectorAll('.chart-timeframe');
  
  timeframeButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      timeframeButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Update timeframe
      currentTimeframe = button.textContent;
      generateDataForTimeframe(currentTimeframe);
      renderChart();
    });
  });
}

// Generate initial chart data
function generateInitialData() {
  generateDataForTimeframe(currentTimeframe);
}

// Generate data for specific timeframe
function generateDataForTimeframe(timeframe) {
  const now = new Date();
  const dataPoints = getDataPointsForTimeframe(timeframe);
  const interval = getIntervalForTimeframe(timeframe);
  
  chartData = [];
  let basePrice = 2450.32; // Starting ETH price
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * interval));
    
    // Generate realistic price movement
    const volatility = getVolatilityForTimeframe(timeframe);
    const change = (Math.random() - 0.5) * volatility;
    basePrice *= (1 + change);
    
    // Add some trend
    const trend = Math.sin(i / 10) * 0.001;
    basePrice *= (1 + trend);
    
    chartData.push({
      timestamp: timestamp,
      price: Math.max(basePrice, 0),
      volume: Math.random() * 1000000 + 500000
    });
  }
}

// Get number of data points for timeframe
function getDataPointsForTimeframe(timeframe) {
  switch (timeframe) {
    case '1H': return 60; // 1 minute intervals
    case '1D': return 24; // 1 hour intervals
    case '1W': return 7; // 1 day intervals
    case '1M': return 30; // 1 day intervals
    default: return 60;
  }
}

// Get interval in milliseconds for timeframe
function getIntervalForTimeframe(timeframe) {
  switch (timeframe) {
    case '1H': return 60 * 1000; // 1 minute
    case '1D': return 60 * 60 * 1000; // 1 hour
    case '1W': return 24 * 60 * 60 * 1000; // 1 day
    case '1M': return 24 * 60 * 60 * 1000; // 1 day
    default: return 60 * 1000;
  }
}

// Get volatility for timeframe
function getVolatilityForTimeframe(timeframe) {
  switch (timeframe) {
    case '1H': return 0.002; // 0.2%
    case '1D': return 0.01; // 1%
    case '1W': return 0.03; // 3%
    case '1M': return 0.05; // 5%
    default: return 0.002;
  }
}

// Render chart
function renderChart() {
  if (!chartContainer || chartData.length === 0) return;
  
  const containerRect = chartContainer.getBoundingClientRect();
  const width = containerRect.width;
  const height = containerRect.height;
  
  // Clear previous chart
  chartContainer.innerHTML = '';
  
  // Create SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  
  // Calculate price range
  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  
  // Add some padding
  const padding = priceRange * 0.1;
  const adjustedMin = minPrice - padding;
  const adjustedMax = maxPrice + padding;
  const adjustedRange = adjustedMax - adjustedMin;
  
  // Create price line path
  const pathData = chartData.map((point, index) => {
    const x = (index / (chartData.length - 1)) * width;
    const y = height - ((point.price - adjustedMin) / adjustedRange) * height;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  // Create gradient
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'priceGradient');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '100%');
  gradient.setAttribute('y2', '0%');
  
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#FF007A');
  
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#00D9FF');
  
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  svg.appendChild(defs);
  
  // Create area under the curve
  const areaPath = pathData + ` L ${width} ${height} L 0 ${height} Z`;
  const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  area.setAttribute('d', areaPath);
  area.setAttribute('fill', 'url(#priceGradient)');
  area.setAttribute('opacity', '0.1');
  svg.appendChild(area);
  
  // Create price line
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  line.setAttribute('d', pathData);
  line.setAttribute('stroke', 'url(#priceGradient)');
  line.setAttribute('stroke-width', '2');
  line.setAttribute('fill', 'none');
  svg.appendChild(line);
  
  // Add data points
  chartData.forEach((point, index) => {
    const x = (index / (chartData.length - 1)) * width;
    const y = height - ((point.price - adjustedMin) / adjustedRange) * height;
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '2');
    circle.setAttribute('fill', '#FF007A');
    circle.setAttribute('opacity', '0.8');
    
    // Add hover effect
    circle.addEventListener('mouseenter', () => {
      showTooltip(point, x, y);
    });
    
    circle.addEventListener('mouseleave', () => {
      hideTooltip();
    });
    
    svg.appendChild(circle);
  });
  
  chartContainer.appendChild(svg);
}

// Show tooltip
function showTooltip(dataPoint, x, y) {
  const tooltip = document.createElement('div');
  tooltip.className = 'chart-tooltip';
  tooltip.innerHTML = `
    <div class="tooltip-price">${utils.formatCurrency(dataPoint.price)}</div>
    <div class="tooltip-time">${formatTime(dataPoint.timestamp)}</div>
    <div class="tooltip-volume">Volume: ${utils.formatCurrency(dataPoint.volume, 0)}</div>
  `;
  
  // Add styles
  tooltip.style.cssText = `
    position: absolute;
    background: var(--surface-primary);
    border: 1px solid var(--border-secondary);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-tooltip);
    font-size: var(--font-size-sm);
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--transition-fast);
  `;
  
  document.body.appendChild(tooltip);
  
  // Position tooltip
  const rect = chartContainer.getBoundingClientRect();
  tooltip.style.left = (rect.left + x + 10) + 'px';
  tooltip.style.top = (rect.top + y - 50) + 'px';
  
  // Fade in
  setTimeout(() => {
    tooltip.style.opacity = '1';
  }, 10);
}

// Hide tooltip
function hideTooltip() {
  const tooltip = document.querySelector('.chart-tooltip');
  if (tooltip) {
    tooltip.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(tooltip)) {
        document.body.removeChild(tooltip);
      }
    }, 150);
  }
}

// Format time for tooltip
function formatTime(timestamp) {
  const now = new Date();
  const diff = now - timestamp;
  
  if (diff < 60 * 1000) {
    return 'Just now';
  } else if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}m ago`;
  } else if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
  } else {
    return timestamp.toLocaleDateString();
  }
}

// Start chart updates
function startChartUpdates() {
  setInterval(() => {
    // Add new data point
    const lastPoint = chartData[chartData.length - 1];
    const volatility = getVolatilityForTimeframe(currentTimeframe);
    const change = (Math.random() - 0.5) * volatility;
    const newPrice = lastPoint.price * (1 + change);
    
    const newPoint = {
      timestamp: new Date(),
      price: Math.max(newPrice, 0),
      volume: Math.random() * 1000000 + 500000
    };
    
    chartData.push(newPoint);
    
    // Keep only the required number of points
    const maxPoints = getDataPointsForTimeframe(currentTimeframe);
    if (chartData.length > maxPoints) {
      chartData.shift();
    }
    
    // Re-render chart
    renderChart();
    
    // Update swap rate if tokens are selected
    if (window.tokens && window.tokens.selectedFromToken() && window.tokens.selectedToToken()) {
      // Update token price in tokenData
      const fromToken = window.tokens.selectedFromToken();
      if (fromToken === 'ETH') {
        window.tokenData.ETH.price = newPrice;
      }
    }
    
  }, getIntervalForTimeframe(currentTimeframe));
}

// Handle window resize
function handleResize() {
  utils.debounce(() => {
    renderChart();
  }, 300)();
}

// Setup resize listener
window.addEventListener('resize', handleResize);

// Export chart functions
window.chart = {
  initialize: initializeChart
};