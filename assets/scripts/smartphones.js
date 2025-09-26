// Smartphones Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize filter functionality
    initializeFilters();
    
    // Load smartphone data from API
    loadSmartphoneData();
});

// Available brands
const availableBrands = [
    'apple',
    'huawei', 
    'honor',
    'samsung',
    'oppo',
    'nokia',
    'realme',
    'tecno',
    'xiaomi'
];

// Filter state
let selectedBrands = [];
let selectedOS = [];
let selectedPriceRanges = [];
let currentActivePanel = null;

// Initialize filter functionality
function initializeFilters() {
    // Add event listeners to filter buttons
    const filterButtons = document.querySelectorAll('.filter-button[data-panel]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const panelId = this.getAttribute('data-panel');
            toggleFilterPanel(panelId);
        });
    });

    // Add event listeners to apply and cancel buttons
    const applyButtons = document.querySelectorAll('.apply-filters');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const panel = this.closest('.filter-panel');
            applyPanelFiltersWithFiltering(panel);
        });
    });

    const cancelButtons = document.querySelectorAll('.cancel-filters');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const panel = this.closest('.filter-panel');
            cancelPanelFilters(panel);
        });
    });

    // Add event listener to clear all button
    const clearAllButton = document.getElementById('clear-filters');
    if (clearAllButton) {
        clearAllButton.addEventListener('click', clearAllFiltersWithFiltering);
    }

    // Add event listeners to checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            handleCheckboxChange(this);
        });
    });
    
    // Initially hide the clear all button
    updateClearAllButtonVisibility();
}

// Toggle filter panel visibility
function toggleFilterPanel(panelId) {
    const panel = document.getElementById(panelId);
    const allPanels = document.querySelectorAll('.filter-panel');
    
    // Close all panels first
    allPanels.forEach(p => {
        p.classList.remove('active');
    });
    
    // Toggle the clicked panel
    if (currentActivePanel === panelId) {
        currentActivePanel = null;
    } else {
        panel.classList.add('active');
        currentActivePanel = panelId;
    }
}

// Handle checkbox changes
function handleCheckboxChange(checkbox) {
    const value = checkbox.value;
    const name = checkbox.name;
    
    if (name === 'brand') {
        if (value === 'all') {
            // Handle "All Brands" checkbox
            const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
            if (checkbox.checked) {
                // Check all brand checkboxes
                brandCheckboxes.forEach(cb => cb.checked = true);
                selectedBrands = [...availableBrands];
            } else {
                // Uncheck all brand checkboxes
                brandCheckboxes.forEach(cb => cb.checked = false);
                selectedBrands = [];
            }
        } else {
            // Handle individual brand checkboxes
            if (checkbox.checked) {
                if (!selectedBrands.includes(value)) {
                    selectedBrands.push(value);
                }
            } else {
                selectedBrands = selectedBrands.filter(b => b !== value);
                // Uncheck "All Brands" if any individual brand is unchecked
                const allBrandsCheckbox = document.querySelector('input[name="brand"][value="all"]');
                if (allBrandsCheckbox) {
                    allBrandsCheckbox.checked = false;
                }
            }
        }
    } else if (name === 'os') {
        if (checkbox.checked) {
            if (!selectedOS.includes(value)) {
                selectedOS.push(value);
            }
        } else {
            selectedOS = selectedOS.filter(os => os !== value);
        }
    } else if (name === 'price') {
        if (checkbox.checked) {
            if (!selectedPriceRanges.includes(value)) {
                selectedPriceRanges.push(value);
            }
        } else {
            selectedPriceRanges = selectedPriceRanges.filter(price => price !== value);
        }
    }
    
    // Update clear all button visibility
    updateClearAllButtonVisibility();
}

// Apply panel filters
function applyPanelFilters(panel) {
    // Close the panel
    panel.classList.remove('active');
    currentActivePanel = null;
    
    // Log filter state for debugging
    console.log('Filters applied:', {
        brands: selectedBrands,
        os: selectedOS,
        priceRanges: selectedPriceRanges
    });
}

// Cancel panel filters
function cancelPanelFilters(panel) {
    // Close the panel
    panel.classList.remove('active');
    currentActivePanel = null;
}

// Update clear all button visibility
function updateClearAllButtonVisibility() {
    const clearAllButton = document.getElementById('clear-filters');
    if (!clearAllButton) return;
    
    const hasActiveFilters = selectedBrands.length > 0 || selectedOS.length > 0 || selectedPriceRanges.length > 0;
    
    if (hasActiveFilters) {
        clearAllButton.style.display = 'flex';
    } else {
        clearAllButton.style.display = 'none';
    }
}

// Clear all filters
function clearAllFilters() {
    // Reset all filter states
    selectedBrands = [];
    selectedOS = [];
    selectedPriceRanges = [];
    
    // Uncheck all checkboxes
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Close all panels
    const allPanels = document.querySelectorAll('.filter-panel');
    allPanels.forEach(panel => {
        panel.classList.remove('active');
    });
    currentActivePanel = null;
    
    // Hide clear all button
    updateClearAllButtonVisibility();
    
    console.log('All filters cleared');
}

// API Configuration
const API_BASE_URL = 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com';
let smartphoneData = [];
let filteredData = [];
let currentPage = 1;
const productsPerPage = 15;

// Load smartphone data from API with retry mechanism
async function loadSmartphoneData(retryCount = 0) {
    const maxRetries = 2;
    
    // Show loading spinner
    showLoadingSpinner();
    
    try {
        console.log(`Fetching data from: ${API_BASE_URL}/smartphones (Attempt ${retryCount + 1})`);
        
        const response = await fetch(`${API_BASE_URL}/smartphones`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            // Add timeout
            signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        // Check if data is valid
        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid data format received from API');
        }
        
        smartphoneData = data;
        filteredData = [...smartphoneData];
        
        // Update available brands based on API data
        updateAvailableBrands();
        
        // Hide loading spinner and display products
        hideLoadingSpinner();
        displayProducts(filteredData);
        
        console.log('Smartphone data loaded successfully:', smartphoneData.length, 'products');
    } catch (error) {
        console.error(`Error loading smartphone data (Attempt ${retryCount + 1}):`, error);
        
        // Retry logic
        if (retryCount < maxRetries && !error.message.includes('Invalid data format')) {
            console.log(`Retrying in 2 seconds... (${retryCount + 1}/${maxRetries})`);
            hideLoadingSpinner();
            setTimeout(() => {
                loadSmartphoneData(retryCount + 1);
            }, 2000);
            return;
        }
        
        hideLoadingSpinner();
        
        // Show more detailed error message
        let errorMessage = 'Failed to load smartphone data. ';
        if (error.name === 'TimeoutError') {
            errorMessage += 'Request timed out. Please check your internet connection.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Network error. Please check your internet connection.';
        } else if (error.message.includes('HTTP error')) {
            errorMessage += `Server error: ${error.message}`;
        } else {
            errorMessage += error.message;
        }
        
        displayError(errorMessage);
        
        // Try to load fallback data for development
        console.log('Attempting to load fallback data...');
        loadFallbackData();
    }
}

// Fallback data for development/testing
function loadFallbackData() {
    const fallbackData = [
        {
            product_id: "fallback-1",
            name: "iPhone 15 Pro",
            brand: "Apple",
            description: "Latest iPhone with advanced features",
            specs: {
                Os: {
                    OperatingSystem: "iOS 17"
                }
            },
            offers: [
                {
                    price: 999,
                    store: "Apple Store",
                    url: "#"
                }
            ],
            image_url: "https://via.placeholder.com/300x300?text=iPhone+15+Pro"
        },
        {
            product_id: "fallback-2", 
            name: "Samsung Galaxy S24",
            brand: "Samsung",
            description: "Premium Android smartphone",
            specs: {
                Os: {
                    OperatingSystem: "Android 14"
                }
            },
            offers: [
                {
                    price: 899,
                    store: "Samsung Store",
                    url: "#"
                }
            ],
            image_url: "https://via.placeholder.com/300x300?text=Galaxy+S24"
        },
        {
            product_id: "fallback-3",
            name: "Google Pixel 8",
            brand: "Google", 
            description: "AI-powered smartphone",
            specs: {
                Os: {
                    OperatingSystem: "Android 14"
                }
            },
            offers: [
                {
                    price: 699,
                    store: "Google Store",
                    url: "#"
                }
            ],
            image_url: "https://via.placeholder.com/300x300?text=Pixel+8"
        }
    ];
    
    smartphoneData = fallbackData;
    filteredData = [...smartphoneData];
    
    // Update available brands based on fallback data
    updateAvailableBrands();
    
    // Display fallback products
    displayProducts(filteredData);
    
    console.log('Fallback data loaded:', smartphoneData.length, 'products');
}

// Update available brands based on API data
function updateAvailableBrands() {
    const brandsFromAPI = [...new Set(smartphoneData.map(product => product.brand.toLowerCase()))];
    
    // Update the availableBrands array
    availableBrands.length = 0;
    availableBrands.push(...brandsFromAPI);
    
    // Update brand filter options in the UI
    updateBrandFilterOptions();
}

// Update brand filter options in the UI
function updateBrandFilterOptions() {
    const brandPanel = document.getElementById('brand-panel');
    if (!brandPanel) return;
    
    const filterOptions = brandPanel.querySelector('.filter-options');
    if (!filterOptions) return;
    
    // Clear existing brand options (except "All Brands")
    const existingBrandOptions = filterOptions.querySelectorAll('input[name="brand"]:not([value="all"])');
    existingBrandOptions.forEach(option => option.parentElement.remove());
    
    // Add brand options from API data
    availableBrands.forEach(brand => {
        const label = document.createElement('label');
        label.className = 'filter-option';
        label.innerHTML = `
            <input type="checkbox" name="brand" value="${brand}"> ${brand.charAt(0).toUpperCase() + brand.slice(1)}
        `;
        
        // Add event listener
        const checkbox = label.querySelector('input');
        checkbox.addEventListener('change', function() {
            handleCheckboxChange(this);
        });
        
        filterOptions.appendChild(label);
    });
}

// Display products in the grid with pagination
function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="no-products-message">
                    <i class="fas fa-mobile-alt fa-3x text-muted mb-3"></i>
                    <h4>No smartphones found</h4>
                    <p class="text-muted">Try adjusting your filters or check back later for new products.</p>
                </div>
            </div>
        `;
        // Hide pagination when no products
        hidePagination();
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);
    
    // Display current page products
    productsGrid.innerHTML = currentProducts.map(product => createProductCard(product)).join('');
    
    // Update pagination
    updatePagination(products.length, totalPages);
}

// Create product card HTML (matching index.html smartphone deals styling)
function createProductCard(product) {
    const bestOffer = getBestOffer(product.offers);
    const originalPrice = bestOffer.originalPrice;
    const currentPrice = bestOffer.price;
    const discount = originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
    
    return `
        <div class="col-lg-3 col-md-6 col-sm-12">
            <div class="card h-100 shadow-sm border-0">
                <div class="card-img-container">
                    <img src="${product.imageUrl}" 
                         class="card-img-top" 
                         alt="${product.brand} ${product.model}"
                         loading="lazy"
                         onerror="handleImageError(this, '${product.brand}', '${product.model}')"
                         onload="handleImageLoad(this)">
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <h5 class="card-title fw-bold text-dark mb-1">${product.brand}</h5>
                        <h6 class="card-subtitle text-muted">${product.model}</h6>
                        <div class="specs mt-1">
                            <small class="text-muted">
                                ${product.specs?.Performance?.Storage || 'N/A'}
                            </small>
                        </div>
                    </div>
                    <div class="mt-auto">
                        <div class="d-flex align-items-center mb-2">
                            <h4 class="text-success fw-bold mb-0 me-2">R${currentPrice.toLocaleString()}</h4>
                            ${originalPrice > 0 && discount > 0 ? `
                                <span class="text-decoration-line-through text-muted small">R${originalPrice.toLocaleString()}</span>
                            ` : ''}
                        </div>
                        ${product.offers && product.offers.length > 0 ? `
                            <div class="offers-info mb-2">
                                <small class="text-muted">
                                    <i class="fas fa-store me-1"></i>
                                    ${product.offers.length} offer${product.offers.length > 1 ? 's' : ''} available
                                </small>
                            </div>
                        ` : ''}
                        <div class="d-grid gap-2 d-md-flex">
                            <button class="btn btn-primary flex-fill me-md-2" onclick="compareProduct('${product.product_id}')">
                                View
                            </button>
                            <button class="btn btn-wishlist flex-fill" onclick="addToWishlist('${product.product_id}')">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get the best offer (lowest price) - same as index.js
function getBestOffer(offers) {
    if (!offers || offers.length === 0) {
        return { price: 0, originalPrice: 0 };
    }
    
    return offers.reduce((best, current) => {
        return current.price < best.price ? current : best;
    });
}

// Image handling functions (same as index.js)
function handleImageError(img, brand, model) {
    // Create a fallback image with brand and model text
    img.style.display = 'none';
    const container = img.parentElement;
    container.innerHTML = `
        <div class="image-placeholder">
            <div class="placeholder-icon">📱</div>
            <div class="placeholder-text">
                <div class="brand-name">${brand}</div>
                <div class="model-name">${model}</div>
            </div>
        </div>
    `;
}

function handleImageLoad(img) {
    // No animation - just ensure image is visible
    img.style.opacity = '1';
}

// Display error message
function displayError(message) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="error-message">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h4>Error Loading Products</h4>
                <p class="text-muted">${message}</p>
                <button class="btn btn-primary" onclick="loadSmartphoneData()">
                    <i class="fas fa-refresh"></i> Try Again
                </button>
            </div>
        </div>
    `;
}

// Apply filters to products
function applyFilters() {
    let filtered = [...smartphoneData];
    
    // Apply brand filter
    if (selectedBrands.length > 0) {
        filtered = filtered.filter(product => 
            selectedBrands.includes(product.brand.toLowerCase())
        );
    }
    
    // Apply OS filter
    if (selectedOS.length > 0) {
        filtered = filtered.filter(product => {
            const productOS = product.specs?.Os?.OperatingSystem?.toLowerCase() || '';
            return selectedOS.some(os => productOS.includes(os.toLowerCase()));
        });
    }
    
    // Apply price filter
    if (selectedPriceRanges.length > 0) {
        filtered = filtered.filter(product => {
            const bestOffer = product.offers && product.offers.length > 0 ? product.offers[0] : null;
            const price = bestOffer ? bestOffer.price : 0;
            
            return selectedPriceRanges.some(range => {
                const [min, max] = range.split('-').map(p => parseInt(p));
                if (range.endsWith('+')) {
                    return price >= min;
                }
                return price >= min && price <= max;
            });
        });
    }
    
    filteredData = filtered;
    currentPage = 1; // Reset to first page when filters change
    
    // Show loading spinner for filtering
    showLoadingSpinner();
    
    // Add a small delay to show the spinner (for better UX)
    setTimeout(() => {
        hideLoadingSpinner();
        displayProducts(filteredData);
    }, 300);
}

// Update pagination controls
function updatePagination(totalProducts, totalPages) {
    const paginationContainer = document.getElementById('pagination-container');
    
    if (!paginationContainer) {
        console.error('Pagination container not found');
        return;
    }
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    const startProduct = (currentPage - 1) * productsPerPage + 1;
    const endProduct = Math.min(currentPage * productsPerPage, totalProducts);
    
    let paginationHTML = `
        <div class="pagination-info mb-3">
            <p class="text-muted mb-0">
                Showing ${startProduct}-${endProduct} of ${totalProducts} products
            </p>
        </div>
        <nav aria-label="Products pagination" class="d-flex justify-content-center">
            <ul class="pagination mb-0">
    `;
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    paginationHTML += `
            </ul>
        </nav>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Change page function
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / productsPerPage);
    
    if (page < 1 || page > totalPages) {
        return;
    }
    
    currentPage = page;
    
    // Show loading spinner for page change
    showLoadingSpinner();
    
    // Add a small delay to show the spinner (for better UX)
    setTimeout(() => {
        hideLoadingSpinner();
        displayProducts(filteredData);
        
        // Scroll to top of products
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 200);
}

// Hide pagination
function hidePagination() {
    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) {
        paginationContainer.innerHTML = '';
    }
}

// Add missing functions for product interactions
function addToWishlist(productId) {
    console.log('Adding to wishlist:', productId);
    // TODO: Implement wishlist functionality
}

function compareProduct(productId) {
    console.log('Comparing product:', productId);
    // Redirect to smartphone-info.html with product ID
    window.location.href = `smartphone-info.html?id=${productId}`;
}

// Check if product matches brand filters
function matchesBrandFilters(product) {
    if (selectedBrands.length === 0) return true;
    return selectedBrands.includes(product.brand.toLowerCase());
}

// Override the original applyPanelFilters function to include filtering
function applyPanelFiltersWithFiltering(panel) {
    // Close the panel
    panel.classList.remove('active');
    currentActivePanel = null;
    
    // Log filter state for debugging
    console.log('Filters applied:', {
        brands: selectedBrands,
        os: selectedOS,
        priceRanges: selectedPriceRanges
    });
    
    // Apply filters to products
    applyFilters();
}

// Override the original clearAllFilters function to include filtering
function clearAllFiltersWithFiltering() {
    // Reset all filter states
    selectedBrands = [];
    selectedOS = [];
    selectedPriceRanges = [];
    
    // Uncheck all checkboxes
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Close all panels
    const allPanels = document.querySelectorAll('.filter-panel');
    allPanels.forEach(panel => {
        panel.classList.remove('active');
    });
    currentActivePanel = null;
    
    // Hide clear all button
    updateClearAllButtonVisibility();
    
    console.log('All filters cleared');
    
    // Apply filters to products (should show all products)
    applyFilters();
}

// Export functions for global access
window.getSelectedBrands = () => selectedBrands;
window.getSelectedOS = () => selectedOS;
window.getSelectedPriceRanges = () => selectedPriceRanges;
// Loading spinner functions
function showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    const productsGrid = document.getElementById('products-grid');
    
    if (spinner) {
        spinner.classList.remove('hidden');
    }
    if (productsGrid) {
        productsGrid.style.display = 'none';
    }
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    const productsGrid = document.getElementById('products-grid');
    
    if (spinner) {
        spinner.classList.add('hidden');
    }
    if (productsGrid) {
        productsGrid.style.display = 'flex';
    }
}

window.clearAllFilters = clearAllFiltersWithFiltering;
window.matchesBrandFilters = matchesBrandFilters;
window.loadSmartphoneData = loadSmartphoneData;
window.addToWishlist = addToWishlist;
window.compareProduct = compareProduct;
window.handleImageError = handleImageError;
window.handleImageLoad = handleImageLoad;
window.getBestOffer = getBestOffer;
window.changePage = changePage;
window.showLoadingSpinner = showLoadingSpinner;
window.hideLoadingSpinner = hideLoadingSpinner;

// Enhanced search functionality with loading spinner
function performSmartphoneSearch(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        // If search is empty, show all products
        filteredData = [...smartphoneData];
        currentPage = 1;
        showLoadingSpinner();
        setTimeout(() => {
            hideLoadingSpinner();
            displayProducts(filteredData);
        }, 200);
        return;
    }
    
    // Show loading spinner
    showLoadingSpinner();
    
    // Filter products based on search term
    const filtered = smartphoneData.filter(product => {
        const searchLower = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchLower) ||
            product.brand.toLowerCase().includes(searchLower) ||
            (product.specs?.Os?.OperatingSystem && product.specs.Os.OperatingSystem.toLowerCase().includes(searchLower)) ||
            (product.description && product.description.toLowerCase().includes(searchLower))
        );
    });
    
    filteredData = filtered;
    currentPage = 1;
    
    // Add a small delay to show the spinner (for better UX)
    setTimeout(() => {
        hideLoadingSpinner();
        displayProducts(filteredData);
    }, 300);
}

// Override the search functions to use our enhanced search
window.performHeaderSearch = function() {
    const headerSearchInput = document.getElementById('headerSearchInput');
    if (headerSearchInput) {
        performSmartphoneSearch(headerSearchInput.value);
    }
};

window.performMobileSearch = function() {
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    if (mobileSearchInput) {
        performSmartphoneSearch(mobileSearchInput.value);
    }
};