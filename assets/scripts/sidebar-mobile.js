// Mobile and Tablet Sidebar Functionality
// Global variables for mobile sidebar
let isMobileSidebarOpen = false;

// Main toggle sidebar function
window.toggleSidebar = function() {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    console.log('toggleSidebar called, current state:', isMobileSidebarOpen);

    if (!sidebar) {
        console.error('Mobile sidebar element not found!');
        return;
    }

    isMobileSidebarOpen = !isMobileSidebarOpen;

    if (isMobileSidebarOpen) {
        // Open sidebar
        sidebar.classList.add('active');
        if (overlay) {
            overlay.classList.add('active');
        }
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        console.log('Sidebar opened');
    } else {
        // Close sidebar
        sidebar.classList.remove('active');
        if (overlay) {
            overlay.classList.remove('active');
        }
        // Restore body scroll
        document.body.style.overflow = '';
        console.log('Sidebar closed');
    }
}

// Close sidebar when clicking outside
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('mobileSidebar');
    const clickedInsideToggle = e.target.closest('.sidebar-toggle') !== null;
    const clickedInsideSidebar = sidebar && sidebar.contains(e.target);

    // Close sidebar if clicking outside (not the sidebar nor any toggle) and it's open
    if (isMobileSidebarOpen && !clickedInsideSidebar && !clickedInsideToggle) {
        window.toggleSidebar();
    }
});

// Close sidebar on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMobileSidebarOpen) {
        window.toggleSidebar();
    }
});

// Handle window resize - close sidebar on desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 1400 && isMobileSidebarOpen) {
        window.toggleSidebar();
    }
});

// Mobile sidebar login button functionality
function handleMobileSidebarLogin() {
    // Close sidebar first
    if (isMobileSidebarOpen) {
        window.toggleSidebar();
    }
    
    // Small delay to allow sidebar to close, then redirect
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 300);
}

// Initialize mobile sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to close button
    const closeButton = document.getElementById('sidebarClose');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            if (isMobileSidebarOpen) {
                window.toggleSidebar();
            }
        });
    }
    
    // Add event listeners to sidebar links to close sidebar when clicked
    const sidebarLinks = document.querySelectorAll('.sidebar-item');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Small delay to allow the click action to complete
            setTimeout(() => {
                if (isMobileSidebarOpen) {
                    window.toggleSidebar();
                }
            }, 100);
        });
    });
    
    // Add click event listener for mobile sidebar login button
    const mobileLoginBtn = document.querySelector('#mobileSidebar a[href="login.html"]');
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleMobileSidebarLogin();
        });
    }
    
    // Add click event listener for mobile sidebar login link (alternative selector)
    const mobileLoginLink = document.querySelector('.mobile-sidebar a[href="login.html"]');
    if (mobileLoginLink) {
        mobileLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleMobileSidebarLogin();
        });
    }
    
    // Add click event listener for any login link in mobile sidebar
    const allMobileLoginLinks = document.querySelectorAll('#mobileSidebar a, .mobile-sidebar a');
    allMobileLoginLinks.forEach(link => {
        if (link.getAttribute('href') === 'login.html' || link.textContent.toLowerCase().includes('login')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                handleMobileSidebarLogin();
            });
        }
    });
    
    console.log('Mobile sidebar functionality initialized');
});

// Toggle submenu function
window.toggleSubmenu = function(element) {
    const item = element.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close all other submenus
    document.querySelectorAll('.menu-items .item').forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
        }
    });
    
    // Toggle current submenu
    if (isActive) {
        item.classList.remove('active');
    } else {
        item.classList.add('active');
    }
}
