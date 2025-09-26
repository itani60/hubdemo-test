// Sidebar and Header Functionality
// Global variables for header and sidebar
let isHeaderCategoriesOpen = false;
let isSidebarOpen = false;

// Categories subcategory data
const subcategories = {
    'smartphones-tablets': {
        title: 'Smartphones and Tablets',
        items: [
            { name: 'Smartphones', href: '#smartphones' },
            { name: 'Tablets', href: '#tablets' },
            { name: 'Accessories', href: '#accessories' }
        ]
    },
    'laptops-accessories': {
        title: 'Laptops and Accessories',
        items: [
            { name: 'Windows Laptops', href: '#windows-laptops' },
            { name: 'Chromebooks', href: '#chromebooks' },
            { name: 'MacBooks', href: '#macbooks' },
            { name: 'Accessories', href: '#laptop-accessories' }
        ]
    },
    'wearables': {
        title: 'Wearables Devices',
        items: [
            { name: 'Smartwatches', href: '#smartwatches' },
            { name: 'Fitness Trackers', href: '#fitness-trackers' }
        ]
    },
    'televisions': {
        title: 'Televisions & Streaming Devices',
        items: [
            { name: 'Televisions', href: '#televisions' },
            { name: 'Streaming Devices', href: '#streaming-devices' }
        ]
    },
    'audio': {
        title: 'Audio',
        items: [
            { name: 'Earbuds', href: '#earbuds' },
            { name: 'Headphones', href: '#headphones' },
            { name: 'Bluetooth Speakers', href: '#bluetooth-speakers' },
            { name: 'Party Speakers', href: '#party-speakers' },
            { name: 'Soundbars', href: '#soundbars' },
            { name: 'Hi-fi Systems', href: '#hifi-systems' }
        ]
    },
    'gaming': {
        title: 'Gaming',
        items: [
            { name: 'Consoles', href: '#consoles' },
            { name: 'Gaming Laptops', href: '#gaming-laptops' },
            { name: 'Gaming Monitors', href: '#gaming-monitors' },
            { name: 'Consoles Accessories', href: '#console-accessories' },
            { name: 'PC Gaming Accessories', href: '#pc-gaming-accessories' }
        ]
    },
    'networking': {
        title: 'Wi-Fi & Networking',
        items: [
            { name: 'Routers', href: '#routers' },
            { name: 'WiFi Ups', href: '#wifi-ups' },
            { name: 'Extenders & Repeaters', href: '#extenders-repeaters' }
        ]
    },
    'appliances': {
        title: 'Appliances',
        items: [
            { name: 'Fridges & Freezers', href: '#fridges-freezers', subItems: [
                { name: 'Fridges', href: '#fridges' },
                { name: 'Freezers', href: '#freezers' }
            ]},
            { name: 'Microwaves, Ovens & Stoves', href: '#microwaves-ovens-stoves' },
            { name: 'Kettles, Coffee Machines', href: '#kettles-coffee-machines' },
            { name: 'Floorcare', href: '#floorcare' },
            { name: 'Food Preparation', href: '#food-preparation' },
            { name: 'Heaters & Electric Blankets', href: '#heaters-electric-blankets' },
            { name: 'Personal Care', href: '#personal-care' },
            { name: 'Cookers & Air Fryers', href: '#cookers-air-fryers' },
            { name: 'Toasters & Sandwich Makers', href: '#toasters-sandwich-makers' },
            { name: 'Dishwashers', href: '#dishwashers' },
            { name: 'Irons & Steamers', href: '#irons-steamers' },
            { name: 'Sewing Machine', href: '#sewing-machine' },
            { name: 'Humidifiers & Purifiers', href: '#humidifiers-purifiers' }
        ]
    }
};

// Header categories dropdown functionality
function toggleHeaderCategories() {
    const headerCategoriesDropdown = document.querySelector('.header-categories-dropdown');
    isHeaderCategoriesOpen = !isHeaderCategoriesOpen;
    
    if (isHeaderCategoriesOpen) {
        headerCategoriesDropdown.classList.add('active');
    } else {
        headerCategoriesDropdown.classList.remove('active');
    }
}

function selectHeaderCategory(category, categoryName) {
    // Filter by the selected category
    filterByCategory(category);
    closeHeaderCategories();
}

function closeHeaderCategories() {
    const headerCategoriesDropdown = document.querySelector('.header-categories-dropdown');
    if (headerCategoriesDropdown) {
        headerCategoriesDropdown.classList.remove('active');
        isHeaderCategoriesOpen = false;
    }
}

// Note: Mobile sidebar functionality moved to sidebar-mobile.js

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    const headerCategoriesDropdown = document.querySelector('.header-categories-dropdown');
    
    if (headerCategoriesDropdown && !headerCategoriesDropdown.contains(e.target)) {
        closeHeaderCategories();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close dropdowns with Escape key
    if (e.key === 'Escape') {
        if (isHeaderCategoriesOpen) {
            closeHeaderCategories();
        }
    }
});

// Initialize categories dropdown functionality
function initializeCategoriesDropdown() {
    const categoryItems = document.querySelectorAll('.category-item');
    const subcategoryTitle = document.getElementById('subcategory-title');
    const subcategoryContent = document.getElementById('subcategory-content');
    const subSubcategoryTitle = document.getElementById('sub-subcategory-title');
    const subSubcategoryContent = document.getElementById('sub-subcategory-content');

    categoryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const category = this.getAttribute('data-category');
            const subcategoryData = subcategories[category];
            
            if (subcategoryData) {
                subcategoryTitle.textContent = subcategoryData.title;
                subcategoryContent.innerHTML = subcategoryData.items.map(item => {
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const chevronIcon = hasSubItems ? '<i class="fas fa-chevron-right"></i>' : '';
                    return `<a href="${item.href}" class="subcategory-item" data-subcategory="${item.name}" data-category="${category}">${item.name} ${chevronIcon}</a>`;
                }).join('');
                
                // Add event listeners to the newly created subcategory items
                const newSubcategoryItems = subcategoryContent.querySelectorAll('.subcategory-item');
                newSubcategoryItems.forEach(item => {
                    item.addEventListener('mouseenter', function() {
                        const subcategoryName = this.getAttribute('data-subcategory');
                        const currentCategory = this.getAttribute('data-category');
                        
                        console.log('Direct hover on:', subcategoryName, 'in category:', currentCategory);
                        
                        if (currentCategory && subcategories[currentCategory]) {
                            const subcategoryData = subcategories[currentCategory].items.find(item => item.name === subcategoryName);
                            
                            if (subcategoryData && subcategoryData.subItems) {
                                console.log('Found subItems:', subcategoryData.subItems);
                                subSubcategoryTitle.textContent = subcategoryData.name;
                                subSubcategoryContent.innerHTML = subcategoryData.subItems.map(subItem => 
                                    `<a href="${subItem.href}" class="sub-subcategory-item">${subItem.name}</a>`
                                ).join('');
                            } else {
                                subSubcategoryTitle.textContent = 'No further options';
                                subSubcategoryContent.innerHTML = '<p>No additional subcategories available.</p>';
                            }
                        }
                    });
                });
                
                // Clear third column
                subSubcategoryTitle.textContent = 'Select a subcategory';
                subSubcategoryContent.innerHTML = '<p>Hover over a subcategory to see more options</p>';
            } else {
                subcategoryTitle.textContent = 'No subcategories';
                subcategoryContent.innerHTML = '<p>No subcategories available for this category.</p>';
            }
        });
    });

    // Add event listeners for subcategory items (third column) - using direct event delegation
    document.addEventListener('mouseover', function(e) {
        if (e.target.classList.contains('subcategory-item')) {
            const subcategoryName = e.target.getAttribute('data-subcategory');
            console.log('Hovering over subcategory:', subcategoryName);
            
            // Find the parent category dropdown to get the current category
            const categoriesDropdown = e.target.closest('.categories-dropdown');
            const activeCategoryItem = categoriesDropdown.querySelector('.category-item:hover');
            
            if (activeCategoryItem) {
                const currentCategory = activeCategoryItem.getAttribute('data-category');
                console.log('Current category:', currentCategory);
                
                if (currentCategory && subcategories[currentCategory]) {
                    const subcategoryData = subcategories[currentCategory].items.find(item => item.name === subcategoryName);
                    console.log('Subcategory data:', subcategoryData);
                    
                    if (subcategoryData && subcategoryData.subItems) {
                        console.log('SubItems found:', subcategoryData.subItems);
                        subSubcategoryTitle.textContent = subcategoryData.name;
                        subSubcategoryContent.innerHTML = subcategoryData.subItems.map(subItem => 
                            `<a href="${subItem.href}" class="sub-subcategory-item">${subItem.name}</a>`
                        ).join('');
                    } else {
                        console.log('No subItems found');
                        subSubcategoryTitle.textContent = 'No further options';
                        subSubcategoryContent.innerHTML = '<p>No additional subcategories available.</p>';
                    }
                }
            }
        }
    });

}

// Header login button functionality
function handleHeaderLogin() {
    // Close header categories if open (safe call)
    try { closeHeaderCategories(); } catch (e) {}

    const redirect = () => {
        window.location.href = 'login.html';
    };

    try {
        // If mobile sidebar is open, close it first, then navigate (match mobile behavior)
        if (typeof isMobileSidebarOpen !== 'undefined' && isMobileSidebarOpen && typeof window.toggleSidebar === 'function') {
            window.toggleSidebar();
            setTimeout(redirect, 300);
        } else {
            redirect();
        }
    } catch (err) {
        redirect();
    }
}

// Initialize header functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Header and Sidebar functionality loaded');
    
    // Initialize categories dropdown
    initializeCategoriesDropdown();
    
    // Add click event listeners for sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSidebar();
        });
    }
    
    // Add click event listener for header login button
    const headerLoginBtn = document.getElementById('desktopLoginBtn');
    if (headerLoginBtn) {
        headerLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleHeaderLogin();
        });
    }
    
    // Add click event listener for header login link (if exists)
    const headerLoginLink = document.querySelector('a[href="login.html"]');
    if (headerLoginLink && !headerLoginLink.id) {
        headerLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleHeaderLogin();
        });
    }
});
