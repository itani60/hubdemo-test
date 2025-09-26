// Device Detection functionality for the web application
// This file handles Modernizr-based device detection and classification

// Global device detection variables
let isTouchDevice = false;
let isMobileDevice = false;
let isTabletDevice = false;
let isDesktopDevice = false;
let isLandscape = false;
let screenWidth = 0;
let screenHeight = 0;

// Device detection configuration
const DEVICE_BREAKPOINTS = {
    mobile: 767,
    tablet: 1400
};

// Initialize device detection
document.addEventListener('DOMContentLoaded', function() {
    initializeDeviceDetection();
});

function initializeDeviceDetection() {
    // Perform initial device detection
    detectDevice();
    
    // Listen for window resize events to update device detection
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Listen for orientation change events
    window.addEventListener('orientationchange', debounce(handleOrientationChange, 500));
}

function detectMacOS() {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    
    // Comprehensive macOS detection
    return userAgent.includes('mac') || 
           platform.includes('mac') || 
           platform.includes('darwin') ||
           userAgent.includes('macintosh') ||
           userAgent.includes('mac os x');
}

function detectMacBook() {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    
    // Check for MacBook indicators
    const isMacOS = detectMacOS();
    
    // More comprehensive MacBook detection
    const isMacBook = isMacOS && (
        // Check for MacBook-specific user agent strings
        userAgent.includes('macbook') ||
        // Check for MacBook Air/Pro in user agent
        userAgent.includes('macbook air') ||
        userAgent.includes('macbook pro') ||
        // Check for MacBook in platform
        platform.includes('macbook') ||
        // Check for Intel Mac indicators
        userAgent.includes('intel mac') ||
        userAgent.includes('intel_mac') ||
        // Check for Apple Silicon Mac indicators
        userAgent.includes('arm64') ||
        userAgent.includes('apple silicon') ||
        // Additional MacBook detection based on screen characteristics
        // MacBooks typically have larger screens and are not touch devices
        (isMacOS && screenWidth >= 1024 && screenHeight >= 768 && !isTouchDevice) ||
        // Force desktop for any macOS device with reasonable screen size
        (isMacOS && screenWidth >= 1280 && !isTouchDevice)
    );
    
    return isMacBook;
}

function detectDevice() {
    // Get current screen dimensions
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    isLandscape = screenWidth > screenHeight;
    
    // Touch detection using Modernizr
    if (typeof Modernizr !== 'undefined') {
        isTouchDevice = Modernizr.touch;
    } else {
        // Fallback touch detection if Modernizr is not available
        isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    // MacBook/macOS detection - force desktop version
    const isMacBook = detectMacBook();
    const isMacOS = detectMacOS();
    
    // Device type detection based on screen width and macOS detection
    if (isMacBook || isMacOS) {
        // Force all macOS devices (including MacBook Air) to use desktop version regardless of screen size
        isMobileDevice = false;
        isTabletDevice = false;
        isDesktopDevice = true;
    } else if (screenWidth <= DEVICE_BREAKPOINTS.mobile) {
        isMobileDevice = true;
        isTabletDevice = false;
        isDesktopDevice = false;
    } else if (screenWidth >= 768 && screenWidth <= DEVICE_BREAKPOINTS.tablet) {
        isMobileDevice = false;
        isTabletDevice = true;
        isDesktopDevice = false;
    } else {
        isMobileDevice = false;
        isTabletDevice = false;
        isDesktopDevice = true;
    }
    
    // Apply device-specific CSS classes
    applyDeviceClasses();
    
    // Log device detection results
    logDeviceInfo();
    
    // Trigger custom event for other scripts to listen to
    dispatchDeviceDetectionEvent();
}

function applyDeviceClasses() {
    // Remove existing device classes
    document.body.classList.remove(
        'touch-device', 'no-touch-device',
        'mobile-device', 'tablet-device', 'desktop-device',
        'landscape', 'portrait'
    );
    
    // Add touch/no-touch classes
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('no-touch-device');
    }
    
    // Add device type classes
    if (isMobileDevice) {
        document.body.classList.add('mobile-device');
    } else if (isTabletDevice) {
        document.body.classList.add('tablet-device');
    } else {
        document.body.classList.add('desktop-device');
    }
    
    // Add orientation classes
    if (isLandscape) {
        document.body.classList.add('landscape');
    } else {
        document.body.classList.add('portrait');
    }
}

function logDeviceInfo() {
    const isMacBook = detectMacBook();
    const isMacOS = detectMacOS();
    console.log('Device Detection:', {
        touch: isTouchDevice,
        mobile: isMobileDevice,
        tablet: isTabletDevice,
        desktop: isDesktopDevice,
        macbook: isMacBook,
        macos: isMacOS,
        landscape: isLandscape,
        screenWidth: screenWidth,
        screenHeight: screenHeight,
        userAgent: navigator.userAgent,
        platform: navigator.platform
    });
}

function handleResize() {
    detectDevice();
}

function handleOrientationChange() {
    // Small delay to ensure dimensions are updated after orientation change
    setTimeout(() => {
        detectDevice();
    }, 100);
}

function dispatchDeviceDetectionEvent() {
    const event = new CustomEvent('deviceDetection', {
        detail: {
            isTouchDevice,
            isMobileDevice,
            isTabletDevice,
            isDesktopDevice,
            isLandscape,
            screenWidth,
            screenHeight
        }
    });
    
    document.dispatchEvent(event);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Public API functions
function getDeviceInfo() {
    return {
        isTouchDevice,
        isMobileDevice,
        isTabletDevice,
        isDesktopDevice,
        isLandscape,
        screenWidth,
        screenHeight
    };
}

function isDevice(type) {
    switch (type.toLowerCase()) {
        case 'mobile':
            return isMobileDevice;
        case 'tablet':
            return isTabletDevice;
        case 'desktop':
            return isDesktopDevice;
        case 'touch':
            return isTouchDevice;
        case 'landscape':
            return isLandscape;
        case 'portrait':
            return !isLandscape;
        case 'macbook':
            return detectMacBook();
        case 'macos':
            return detectMacOS();
        default:
            return false;
    }
}

function getScreenSize() {
    return {
        width: screenWidth,
        height: screenHeight,
        aspectRatio: screenWidth / screenHeight
    };
}

function isRetinaDisplay() {
    return window.devicePixelRatio > 1;
}

function getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
}

// Export functions for use in other scripts
window.deviceDetection = {
    getDeviceInfo,
    isDevice,
    getScreenSize,
    isRetinaDisplay,
    getDevicePixelRatio,
    detectDevice,
    detectMacBook,
    detectMacOS,
    DEVICE_BREAKPOINTS
};

// Make variables globally accessible for backward compatibility
window.isTouchDevice = () => isTouchDevice;
window.isMobileDevice = () => isMobileDevice;
window.isTabletDevice = () => isTabletDevice;
window.isDesktopDevice = () => isDesktopDevice;

