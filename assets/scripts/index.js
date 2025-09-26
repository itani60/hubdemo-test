// API Configuration
const API_BASE_URL = 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com';
const SMARTPHONES_API_URL = `${API_BASE_URL}/smartphones`;

// Laptop API Configuration
const LAPTOP_ENDPOINTS = {
    'chromebooks-laptops': `${API_BASE_URL}/chromebooks-laptops`,
    'windows-laptops': `${API_BASE_URL}/windows-laptops`,
    'macbooks-laptops': `${API_BASE_URL}/macbooks-laptops`
};

// Global variables
let smartphonesData = [];
let laptopData = {
    'chromebooks-laptops': [],
    'windows-laptops': [],
    'macbooks-laptops': []
};
let currentLaptopSlide = 0;
let laptopSlideOrder = []; // Will be randomized

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const carouselIndicators = document.getElementById('carousel-indicators');
const laptopProductsGrid = document.getElementById('laptop-products-grid');
const laptopCarouselIndicators = document.getElementById('laptop-carousel-indicators');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadSmartphones();
    loadLaptops();
    initializeQuickAccess();
    loadLocalBusinesses();
});

// Fetch smartphones from API
async function loadSmartphones() {
    try {
        showLoadingState();
        
        const response = await fetch(SMARTPHONES_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        smartphonesData = data;
        
        renderSmartphones(data);
        generateCarouselIndicators(data);
        
    } catch (error) {
        console.error('Error fetching smartphones:', error);
        showErrorState();
    }
}

// Show loading state
function showLoadingState() {
    productsGrid.innerHTML = `
        <div class="col-12">
            <div class="d-flex justify-content-center align-items-center" style="height: 300px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <span class="ms-3">Loading smartphones...</span>
            </div>
        </div>
    `;
}

// Show error state
function showErrorState() {
    productsGrid.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger text-center" role="alert">
                <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                <h4>Unable to load smartphones</h4>
                <p>There was an error loading the smartphone data. Please try again later.</p>
                <button class="btn btn-primary" onclick="loadSmartphones()">Retry</button>
            </div>
        </div>
    `;
}

// Render smartphones to the grid
function renderSmartphones(smartphones) {
    if (!smartphones || smartphones.length === 0) {
        showEmptyState();
        return;
    }

    // Group products into slides of 4
    const productsPerSlide = 4;
    const slides = [];
    for (let i = 0; i < smartphones.length; i += productsPerSlide) {
        slides.push(smartphones.slice(i, i + productsPerSlide));
    }

    // Create carousel HTML
    const carouselHTML = createCarouselHTML(slides);
    productsGrid.innerHTML = carouselHTML;
}

// Create carousel HTML with slides
function createCarouselHTML(slides) {
    if (slides.length === 0) return '';

    const slidesHTML = slides.map((slideProducts, index) => {
        const isActive = index === 0 ? 'active' : '';
        const productsHTML = slideProducts.map(phone => createProductCard(phone)).join('');
        
        return `
            <div class="carousel-item ${isActive}">
                <div class="row">
                    ${productsHTML}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div id="smartphonesCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                ${slidesHTML}
            </div>
        </div>
    `;
}

// Create individual product card HTML
function createProductCard(phone) {
    const bestOffer = getBestOffer(phone.offers);
    const originalPrice = bestOffer.originalPrice;
    const currentPrice = bestOffer.price;
    const discount = originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
    
    return `
        <div class="col-lg-3 col-md-6 col-sm-12">
            <div class="card h-100 shadow-sm border-0">
                <div class="card-img-container">
                    <img src="${phone.imageUrl}" 
                         class="card-img-top" 
                         alt="${phone.brand} ${phone.model}"
                         loading="lazy"
                         onerror="handleImageError(this, '${phone.brand}', '${phone.model}')"
                         onload="handleImageLoad(this)">
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <h5 class="card-title fw-bold text-dark mb-1">${phone.brand}</h5>
                        <h6 class="card-subtitle text-muted">${phone.model}</h6>
                        <div class="specs mt-1">
                            <small class="text-muted">
                                ${phone.specs?.Performance?.Storage || 'N/A'}
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
                        <div class="d-grid gap-2 d-md-flex">
                            <button class="btn btn-success flex-fill me-md-2" onclick="compareProduct('${phone.product_id}')">
                                Compare
                            </button>
                            <button class="btn btn-danger flex-fill" onclick="addToWishlist('${phone.product_id}')">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get the best offer (lowest price)
function getBestOffer(offers) {
    if (!offers || offers.length === 0) {
        return { price: 0, originalPrice: 0 };
    }
    
    return offers.reduce((best, current) => {
        return current.price < best.price ? current : best;
    });
}

// Generate carousel indicators
function generateCarouselIndicators(smartphones) {
    if (!smartphones || smartphones.length === 0) return;
    
    const totalSlides = Math.ceil(smartphones.length / 4); // 4 products per slide
    const maxIndicators = 4; // Show maximum 4 indicators
    const indicatorsToShow = Math.min(totalSlides, maxIndicators);
    
    let indicatorsHTML = '';
    
    for (let i = 0; i < indicatorsToShow; i++) {
        indicatorsHTML += `
            <button type="button" 
                    data-bs-target="#smartphonesCarousel" 
                    data-bs-slide-to="${i}" 
                    class="${i === 0 ? 'active' : ''}" 
                    aria-current="${i === 0 ? 'true' : 'false'}" 
                    aria-label="Slide ${i + 1}">
            </button>
        `;
    }
    
    carouselIndicators.innerHTML = indicatorsHTML;
}


// Show empty state
function showEmptyState() {
    productsGrid.innerHTML = `
        <div class="col-12">
            <div class="text-center py-5">
                <i class="fas fa-mobile-alt fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No smartphones found</h4>
                <p class="text-muted">We couldn't find any smartphones at the moment.</p>
            </div>
        </div>
    `;
}

// Compare product function
function compareProduct(productId) {
    const product = smartphonesData.find(p => p.product_id === productId);
    if (product) {
        // You can implement comparison logic here
        console.log('Comparing product:', product);
        alert(`Comparing ${product.brand} ${product.model}`);
    }
}

// Add to wishlist function
function addToWishlist(productId) {
    const product = smartphonesData.find(p => p.product_id === productId);
    if (product) {
        // You can implement wishlist logic here
        console.log('Adding to wishlist:', product);
        alert(`${product.brand} ${product.model} added to wishlist!`);
    }
}

// Search functionality
function searchSmartphones(query) {
    if (!query.trim()) {
        renderSmartphones(smartphonesData);
        return;
    }
    
    const filtered = smartphonesData.filter(phone => 
        phone.brand.toLowerCase().includes(query.toLowerCase()) ||
        phone.model.toLowerCase().includes(query.toLowerCase()) ||
        phone.color.toLowerCase().includes(query.toLowerCase())
    );
    
    renderSmartphones(filtered);
}

// Filter by brand
function filterByBrand(brand) {
    if (brand === 'all') {
        renderSmartphones(smartphonesData);
        return;
    }
    
    const filtered = smartphonesData.filter(phone => 
        phone.brand.toLowerCase() === brand.toLowerCase()
    );
    
    renderSmartphones(filtered);
}

// Sort products
function sortProducts(sortBy) {
    let sorted = [...smartphonesData];
    
    switch (sortBy) {
        case 'price-low':
            sorted.sort((a, b) => {
                const priceA = getBestOffer(a.offers).price;
                const priceB = getBestOffer(b.offers).price;
                return priceA - priceB;
            });
            break;
        case 'price-high':
            sorted.sort((a, b) => {
                const priceA = getBestOffer(a.offers).price;
                const priceB = getBestOffer(b.offers).price;
                return priceB - priceA;
            });
            break;
        case 'brand':
            sorted.sort((a, b) => a.brand.localeCompare(b.brand));
            break;
        case 'model':
            sorted.sort((a, b) => a.model.localeCompare(b.model));
            break;
        default:
            break;
    }
    
    renderSmartphones(sorted);
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR'
    }).format(amount);
}

// Image handling functions
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
    // Add a subtle fade-in effect when image loads
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
        img.style.opacity = '1';
    }, 100);
}


// Quick Access functionality
function initializeQuickAccess() {
    const quickAccessCards = document.querySelectorAll('.quick-access-card');
    
    quickAccessCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            handleQuickAccessClick(title);
        });
        
        // Add keyboard accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const title = this.querySelector('h3').textContent;
                handleQuickAccessClick(title);
            }
        });
        
        // Make cards focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        const title = card.querySelector('h3').textContent;
        card.setAttribute('aria-label', `Quick access to ${title}`);
    });
}

function handleQuickAccessClick(feature) {
    switch(feature) {
        case 'Profile':
            // Open login modal or redirect to profile
            if (typeof toggleLoginState === 'function') {
                toggleLoginState();
            } else {
                showNotification('Profile feature coming soon!', 'info');
            }
            break;
        case 'Essentials':
            // Scroll to main content or show essentials
            document.querySelector('.smartphones-deals').scrollIntoView({ 
                behavior: 'smooth' 
            });
            break;
        case 'Price Alerts':
            // Open notifications or price alerts
            if (typeof showNotifications === 'function') {
                showNotifications();
            } else {
                showNotification('Price alerts feature coming soon!', 'info');
            }
            break;
        case 'Wishlist':
            // Show wishlist or redirect
            showNotification('Wishlist feature coming soon!', 'info');
            break;
        default:
            showNotification(`${feature} feature coming soon!`, 'info');
    }
}

function showNotification(message, type = 'info') {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'info' ? 'primary' : type} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Laptop Functions
async function loadLaptops() {
    try {
        showLaptopLoadingState();
        
        // Load all laptop categories
        const promises = Object.entries(LAPTOP_ENDPOINTS).map(async ([category, url]) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                laptopData[category] = data;
                return { category, data };
            } catch (error) {
                console.error(`Error fetching ${category}:`, error);
                laptopData[category] = [];
                return { category, data: [] };
            }
        });
        
        await Promise.all(promises);
        
        // Create 4 slides with random laptops from all categories
        const allLaptops = [];
        Object.values(laptopData).forEach(categoryLaptops => {
            allLaptops.push(...categoryLaptops);
        });
        
        // Shuffle all laptops and create 4 slides
        const shuffledLaptops = [...allLaptops].sort(() => Math.random() - 0.5);
        laptopSlideOrder = [];
        
        // Create 4 slides with random laptops
        for (let i = 0; i < 4; i++) {
            const slideLaptops = shuffledLaptops.slice(i * 4, (i + 1) * 4);
            laptopSlideOrder.push(slideLaptops);
        }
        
        // Render the first slide
        renderLaptops(0);
        generateLaptopCarouselIndicators();
        
    } catch (error) {
        console.error('Error loading laptops:', error);
        showLaptopErrorState();
    }
}

function showLaptopLoadingState() {
    laptopProductsGrid.innerHTML = `
        <div class="col-12">
            <div class="d-flex justify-content-center align-items-center" style="height: 300px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <span class="ms-3">Loading laptops...</span>
            </div>
        </div>
    `;
}

function showLaptopErrorState() {
    laptopProductsGrid.innerHTML = `
        <div class="col-12">
            <div class="d-flex flex-column justify-content-center align-items-center" style="height: 300px;">
                <i class="fas fa-exclamation-triangle text-warning mb-3" style="font-size: 3rem;"></i>
                <h5 class="text-muted">Unable to load laptops</h5>
                <p class="text-muted">Please try again later</p>
                <button class="btn btn-primary" onclick="loadLaptops()">Retry</button>
            </div>
        </div>
    `;
}

function renderLaptops(slideIndex) {
    const slideLaptops = laptopSlideOrder[slideIndex] || [];
    
    if (slideLaptops.length === 0) {
        laptopProductsGrid.innerHTML = `
            <div class="col-12">
                <div class="d-flex flex-column justify-content-center align-items-center" style="height: 300px;">
                    <i class="fas fa-laptop text-muted mb-3" style="font-size: 3rem;"></i>
                    <h5 class="text-muted">No laptops found</h5>
                    <p class="text-muted">Check back later for new deals</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Create carousel HTML with the current slide
    const carouselHTML = createLaptopCarouselHTML([slideLaptops]);
    laptopProductsGrid.innerHTML = carouselHTML;
}

// Create laptop carousel HTML with slides (same as smartphones)
function createLaptopCarouselHTML(slides) {
    if (slides.length === 0) return '';

    const slidesHTML = slides.map((slideProducts, index) => {
        const isActive = index === 0 ? 'active' : '';
        const productsHTML = slideProducts.map(laptop => createLaptopProductCard(laptop)).join('');
        
        return `
            <div class="carousel-item ${isActive}">
                <div class="row">
                    ${productsHTML}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div id="laptopCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                ${slidesHTML}
            </div>
        </div>
    `;
}

// Create individual laptop product card HTML (exact same structure as smartphones)
function createLaptopProductCard(laptop) {
    const price = laptop.price || 0;
    const originalPrice = laptop.originalPrice || 0;
    const discount = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    
    return `
        <div class="col-lg-3 col-md-6 col-sm-12">
            <div class="card h-100 shadow-sm border-0">
                <div class="card-img-container">
                    <img src="${laptop.image || laptop.imageUrl || ''}" 
                         class="card-img-top" 
                         alt="${laptop.brand || ''} ${laptop.model || ''}"
                         loading="lazy"
                         onerror="handleLaptopImageError(this, '${laptop.brand || ''}', '${laptop.model || ''}')"
                         onload="handleImageLoad(this)">
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <h5 class="card-title fw-bold text-dark mb-1">${laptop.brand || 'Laptop'}</h5>
                        <h6 class="card-subtitle text-muted">${laptop.model || laptop.name || ''}</h6>
                        <div class="specs mt-1">
                            <small class="text-muted">
                                ${laptop.specs?.Performance?.Storage || laptop.storage || 'N/A'}
                            </small>
                        </div>
                    </div>
                    <div class="mt-auto">
                        <div class="d-flex align-items-center mb-2">
                            <h4 class="text-success fw-bold mb-0 me-2">R${price.toLocaleString()}</h4>
                            ${originalPrice > 0 && discount > 0 ? `
                                <span class="text-decoration-line-through text-muted small">R${originalPrice.toLocaleString()}</span>
                            ` : ''}
                        </div>
                        <div class="d-grid gap-2 d-md-flex">
                            <button class="btn btn-success flex-fill me-md-2" onclick="compareLaptop('${laptop.category || 'laptop'}')">
                                Compare
                            </button>
                            <button class="btn btn-danger flex-fill" onclick="addLaptopToWishlist('${laptop.category || 'laptop'}')">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateLaptopCarouselIndicators() {
    laptopCarouselIndicators.innerHTML = laptopSlideOrder.map((_, index) => `
        <button type="button" 
                class="carousel-indicator ${index === currentLaptopSlide ? 'active' : ''}" 
                onclick="showLaptopSlide(${index})"
                aria-label="Slide ${index + 1}">
        </button>
    `).join('');
}

function showLaptopSlide(slideIndex) {
    currentLaptopSlide = slideIndex;
    renderLaptops(slideIndex);
    generateLaptopCarouselIndicators();
}

function handleLaptopImageError(img, brand, model) {
    img.style.display = 'none';
    const container = img.parentElement;
    container.innerHTML = `
        <div class="laptop-image-placeholder">
            <div class="laptop-placeholder-icon">💻</div>
            <div class="laptop-placeholder-text">
                <div class="laptop-brand-name">${brand}</div>
                <div class="laptop-model-name">${model}</div>
            </div>
        </div>
    `;
}

function getCategoryDisplayName(category) {
    const displayNames = {
        'chromebooks-laptops': 'Chromebooks',
        'windows-laptops': 'Windows Laptops',
        'macbooks-laptops': 'MacBooks'
    };
    return displayNames[category] || category.replace('-', ' ');
}

function compareLaptop(category) {
    console.log('Comparing laptop category:', category);
    showNotification(`Comparing ${getCategoryDisplayName(category)} - feature coming soon!`, 'info');
}

function addLaptopToWishlist(category) {
    console.log('Adding laptop category to wishlist:', category);
    showNotification(`${getCategoryDisplayName(category)} added to wishlist!`, 'success');
}

// Placeholder function for showPage (if needed elsewhere)
function showPage(pageNumber) {
    console.log('Showing page:', pageNumber);
    // This function can be implemented if pagination is needed
}

// Format price function (South African Rand)
function formatPrice(amount) {
    if (!amount || isNaN(amount)) return 'Price not available';
    
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR'
    }).format(amount);
}

// Generate stars for rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Auto-rotate laptop slides every 5 seconds
setInterval(() => {
    currentLaptopSlide = (currentLaptopSlide + 1) % 4;
    showLaptopSlide(currentLaptopSlide);
}, 5000);

// Export functions for global access
window.loadSmartphones = loadSmartphones;
window.compareProduct = compareProduct;
window.addToWishlist = addToWishlist;
window.searchSmartphones = searchSmartphones;
window.filterByBrand = filterByBrand;
window.sortProducts = sortProducts;
window.showPage = showPage;
window.handleImageError = handleImageError;
window.handleImageLoad = handleImageLoad;
window.initializeQuickAccess = initializeQuickAccess;
window.handleQuickAccessClick = handleQuickAccessClick;
window.loadLaptops = loadLaptops;
window.showLaptopSlide = showLaptopSlide;
window.compareLaptop = compareLaptop;
window.addLaptopToWishlist = addLaptopToWishlist;
window.handleLaptopImageError = handleLaptopImageError;

// Load local businesses
function loadLocalBusinesses() {
    try {
        // Check if the renderBusinessCards function exists from local-business.js
        if (typeof renderBusinessCards === 'function') {
            // Render 3 business cards for the local businesses section
            renderBusinessCards('localBusinessesGrid', 3);
        } else {
            console.error('renderBusinessCards function not found. Make sure local-business.js is loaded.');
            showLocalBusinessErrorState();
        }
    } catch (error) {
        console.error('Error loading local businesses:', error);
        showLocalBusinessErrorState();
    }
}

// Show error state for local businesses
function showLocalBusinessErrorState() {
    const container = document.getElementById('localBusinessesGrid');
    if (container) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center" role="alert">
                    <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                    <h4>Local Businesses Coming Soon</h4>
                    <p>We're working on loading local business information. Please check back later.</p>
                </div>
            </div>
        `;
    }
}
