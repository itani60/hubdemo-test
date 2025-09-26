// Global variables
let isDropdownOpen = false;


// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.querySelector('.dropdown');
        
        if (dropdown && !dropdown.contains(e.target)) {
            closeDropdown();
        }
    });
}


// Notification button functions
function showNewArrivals() {
    // Use search functions from search.js
    if (window.searchFunctions) {
        window.searchFunctions.setSearchState('', 'all');
    }
}

function showNotifications() {
    // Use search functions from search.js
    if (window.searchFunctions) {
        window.searchFunctions.setSearchState('', 'all');
    }
}

function showLocalBusiness() {
    // Use search functions from search.js
    if (window.searchFunctions) {
        window.searchFunctions.setSearchState('', 'all');
    }
}

function showMyAccount() {
    // Use search functions from search.js
    if (window.searchFunctions) {
        window.searchFunctions.setSearchState('', 'all');
    }
}

// Simulate login function for testing
function simulateLogin() {
    const myAccountLink = document.querySelector('a[href="#my-account"]');
    if (myAccountLink) {
        // Add logged-in class and change text
        myAccountLink.classList.add('logged-in');
        myAccountLink.textContent = 'John Doe';
        myAccountLink.onclick = function() {
            showLoggedInAccount();
            return false;
        };
        
        // Show notification
        showNotification('Successfully logged in as John Doe!', 'success');
    }
}

// Simulate logout function for testing
function simulateLogout() {
    const myAccountLink = document.querySelector('a[href="#my-account"]');
    if (myAccountLink) {
        // Remove logged-in class and restore original text
        myAccountLink.classList.remove('logged-in');
        myAccountLink.textContent = 'My Account';
        myAccountLink.onclick = function() {
            showMyAccount();
            return false;
        };
        
        // Show notification
        showNotification('Successfully logged out!', 'info');
    }
}

function showLoggedInAccount() {
    // Use search functions from search.js
    if (window.searchFunctions) {
        window.searchFunctions.setSearchState('', 'all');
    }
    
    // Show notification
    showNotification('Here are your personalized recommendations!', 'success');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}



// Dropdown functionality
function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown');
    isDropdownOpen = !isDropdownOpen;
    
    if (isDropdownOpen) {
        dropdown.classList.add('active');
    } else {
        dropdown.classList.remove('active');
    }
}

function closeDropdown() {
    const dropdown = document.querySelector('.dropdown');
    dropdown.classList.remove('active');
    isDropdownOpen = false;
}

// Header categories dropdown functionality moved to sidebar-header.js

// Sidebar toggle functionality moved to sidebar-header.js




// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close dropdowns with Escape key
    if (e.key === 'Escape') {
        if (isDropdownOpen) {
            closeDropdown();
        }
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        // Only proceed if href is not just '#' and is a valid selector
        if (href && href !== '#' && href.length > 1) {
            try {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } catch (error) {
                console.warn('Invalid selector:', href, error);
            }
        }
    });
});
