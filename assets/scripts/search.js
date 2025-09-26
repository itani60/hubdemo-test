// Search functionality for the web application
// This file handles all search-related operations

// Global search variables
let currentCategory = 'all';
let currentSearchTerm = '';
let currentSort = 'relevance';

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

function initializeSearch() {
    // Add search event listeners
    setupSearchEventListeners();
    
    // Initialize search suggestions
    initializeSearchSuggestions();
    
    // Initialize scroll effects for mobile search
    initializeMobileSearchScrollEffects();
}

function setupSearchEventListeners() {
    
    // Header search input event listeners
    const headerSearchInput = document.getElementById('headerSearchInput');
    if (headerSearchInput) {
        headerSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performHeaderSearch();
            }
        });
        
        headerSearchInput.addEventListener('input', function(e) {
            currentSearchTerm = e.target.value.toLowerCase();
        });
    }
    
    // Mobile search input event listeners
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performMobileSearch();
            }
        });
        
        mobileSearchInput.addEventListener('input', function(e) {
            currentSearchTerm = e.target.value.toLowerCase();
        });
    }
}


// Header search functionality
function performHeaderSearch() {
    const headerSearchInput = document.getElementById('headerSearchInput');
    if (headerSearchInput) {
        currentSearchTerm = headerSearchInput.value.toLowerCase();
        console.log('Header search performed:', currentSearchTerm);
        // Here you can add actual search logic or API calls
    }
}

// Mobile search functionality
function performMobileSearch() {
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    if (mobileSearchInput) {
        currentSearchTerm = mobileSearchInput.value.toLowerCase();
        console.log('Mobile search performed:', currentSearchTerm);
        // Here you can add actual search logic or API calls
    }
}

// Mobile header search functionality
function performMobileHeaderSearch() {
    const mobileHeaderSearchInput = document.getElementById('mobileHeaderSearchInput');
    if (mobileHeaderSearchInput) {
        currentSearchTerm = mobileHeaderSearchInput.value.toLowerCase();
        console.log('Mobile header search performed:', currentSearchTerm);
        // Here you can add actual search logic or API calls
    }
}

// Search suggestions functionality
function initializeSearchSuggestions() {
    // Initialize mobile search suggestions
    initializeMobileSearchSuggestions();
    
    // Initialize mobile header search suggestions
    initializeMobileHeaderSearchSuggestions();
    
    // Initialize desktop search suggestions
    initializeDesktopSearchSuggestions();
}

function initializeMobileSearchSuggestions() {
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchSuggestions = document.getElementById('mobileSearchSuggestions');
    
    if (mobileSearchInput && mobileSearchSuggestions) {
        let currentSuggestions = [];
        let selectedIndex = -1;
        
        // Sample suggestions data
        const suggestionsData = [
            { text: 'iPhone 15 Pro', category: 'Electronics', icon: '📱' },
            { text: 'Samsung Galaxy S24', category: 'Electronics', icon: '📱' },
            { text: 'MacBook Pro', category: 'Electronics', icon: '💻' },
            { text: 'Nike Air Max', category: 'Fashion', icon: '👟' },
            { text: 'Adidas Ultraboost', category: 'Fashion', icon: '👟' },
            { text: 'KitchenAid Mixer', category: 'Home', icon: '🍳' },
            { text: 'Dyson Vacuum', category: 'Home', icon: '🧹' },
            { text: 'Sony Headphones', category: 'Electronics', icon: '🎧' },
            { text: 'Yoga Mat', category: 'Sports', icon: '🧘' },
            { text: 'The Great Gatsby', category: 'Books', icon: '📚' },
            { text: 'L\'Oreal Foundation', category: 'Beauty', icon: '💄' },
            { text: 'Car Phone Mount', category: 'Automotive', icon: '📱' }
        ];
        
        // Input event listener
        mobileSearchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();
            
            if (query.length >= 2) {
                showSuggestions(query, suggestionsData);
            } else {
                hideSuggestions();
            }
        });
        
        // Focus event listener
        mobileSearchInput.addEventListener('focus', function(e) {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                showSuggestions(query, suggestionsData);
            }
        });
        
        // Blur event listener (with delay to allow clicking on suggestions)
        mobileSearchInput.addEventListener('blur', function() {
            setTimeout(() => {
                hideSuggestions();
            }, 200);
        });
        
        // Keyboard navigation
        mobileSearchInput.addEventListener('keydown', function(e) {
            if (!mobileSearchSuggestions.classList.contains('show')) return;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, currentSuggestions.length - 1);
                    updateSelection();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, -1);
                    updateSelection();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && currentSuggestions[selectedIndex]) {
                        selectSuggestion(currentSuggestions[selectedIndex]);
                    } else {
                        performMobileSearch();
                    }
                    break;
                case 'Escape':
                    hideSuggestions();
                    break;
            }
        });
        
        function showSuggestions(query, data) {
            // Filter suggestions based on query
            currentSuggestions = data.filter(item => 
                item.text.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 8); // Limit to 8 suggestions
            
            if (currentSuggestions.length > 0) {
                renderSuggestions(currentSuggestions, query);
                mobileSearchSuggestions.classList.add('show');
                selectedIndex = -1;
            } else {
                showNoSuggestions();
                mobileSearchSuggestions.classList.add('show');
            }
        }
        
        function renderSuggestions(suggestions, query) {
            const content = mobileSearchSuggestions.querySelector('.suggestions-content');
            content.innerHTML = suggestions.map((suggestion, index) => `
                <div class="suggestion-item" data-index="${index}" onclick="selectSuggestion(${JSON.stringify(suggestion).replace(/"/g, '&quot;')})">
                    <div class="suggestion-icon">${suggestion.icon}</div>
                    <div class="suggestion-text">${highlightText(suggestion.text, query)}</div>
                    <div class="suggestion-category">${suggestion.category}</div>
                </div>
            `).join('');
        }
        
        function showNoSuggestions() {
            const content = mobileSearchSuggestions.querySelector('.suggestions-content');
            content.innerHTML = '<div class="no-suggestions">No suggestions found</div>';
        }
        
        function highlightText(text, query) {
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<span class="suggestion-highlight">$1</span>');
        }
        
        function updateSelection() {
            const items = mobileSearchSuggestions.querySelectorAll('.suggestion-item');
            items.forEach((item, index) => {
                item.classList.toggle('active', index === selectedIndex);
            });
        }
        
        function selectSuggestion(suggestion) {
            mobileSearchInput.value = suggestion.text;
            hideSuggestions();
            performMobileSearch();
        }
        
        function hideSuggestions() {
            mobileSearchSuggestions.classList.remove('show');
            selectedIndex = -1;
        }
        
        // Make functions globally accessible
        window.selectSuggestion = selectSuggestion;
    }
}

function initializeMobileHeaderSearchSuggestions() {
    const mobileHeaderSearchInput = document.getElementById('mobileHeaderSearchInput');
    const mobileHeaderSearchSuggestions = document.getElementById('mobileHeaderSearchSuggestions');
    
    if (mobileHeaderSearchInput && mobileHeaderSearchSuggestions) {
        let currentSuggestions = [];
        let selectedIndex = -1;
        
        // Sample suggestions data
        const suggestionsData = [
            { text: 'iPhone 15 Pro', category: 'Electronics', icon: '📱' },
            { text: 'Samsung Galaxy S24', category: 'Electronics', icon: '📱' },
            { text: 'MacBook Pro', category: 'Electronics', icon: '💻' },
            { text: 'Nike Air Max', category: 'Fashion', icon: '👟' },
            { text: 'Adidas Ultraboost', category: 'Fashion', icon: '👟' },
            { text: 'KitchenAid Mixer', category: 'Home', icon: '🍳' },
            { text: 'Dyson Vacuum', category: 'Home', icon: '🧹' },
            { text: 'Sony Headphones', category: 'Electronics', icon: '🎧' },
            { text: 'Yoga Mat', category: 'Sports', icon: '🧘' },
            { text: 'The Great Gatsby', category: 'Books', icon: '📚' },
            { text: 'L\'Oreal Foundation', category: 'Beauty', icon: '💄' },
            { text: 'Car Phone Mount', category: 'Automotive', icon: '📱' }
        ];
        
        // Input event listener
        mobileHeaderSearchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();
            
            if (query.length >= 2) {
                showMobileHeaderSuggestions(query, suggestionsData);
            } else {
                hideMobileHeaderSuggestions();
            }
        });
        
        // Focus event listener
        mobileHeaderSearchInput.addEventListener('focus', function(e) {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                showMobileHeaderSuggestions(query, suggestionsData);
            }
        });
        
        // Blur event listener (with delay to allow clicking on suggestions)
        mobileHeaderSearchInput.addEventListener('blur', function() {
            setTimeout(() => {
                hideMobileHeaderSuggestions();
            }, 200);
        });
        
        // Keyboard navigation
        mobileHeaderSearchInput.addEventListener('keydown', function(e) {
            if (!mobileHeaderSearchSuggestions.classList.contains('show')) return;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, currentSuggestions.length - 1);
                    updateMobileHeaderSelection();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, -1);
                    updateMobileHeaderSelection();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && currentSuggestions[selectedIndex]) {
                        selectMobileHeaderSuggestion(currentSuggestions[selectedIndex]);
                    } else {
                        performMobileHeaderSearch();
                    }
                    break;
                case 'Escape':
                    hideMobileHeaderSuggestions();
                    break;
            }
        });
        
        function showMobileHeaderSuggestions(query, data) {
            // Filter suggestions based on query
            currentSuggestions = data.filter(item => 
                item.text.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 8); // Limit to 8 suggestions
            
            if (currentSuggestions.length > 0) {
                renderMobileHeaderSuggestions(currentSuggestions, query);
                mobileHeaderSearchSuggestions.classList.add('show');
                selectedIndex = -1;
            } else {
                showMobileHeaderNoSuggestions();
                mobileHeaderSearchSuggestions.classList.add('show');
            }
        }
        
        function renderMobileHeaderSuggestions(suggestions, query) {
            const content = mobileHeaderSearchSuggestions.querySelector('.suggestions-content');
            content.innerHTML = suggestions.map((suggestion, index) => `
                <div class="suggestion-item" data-index="${index}" onclick="selectMobileHeaderSuggestion(${JSON.stringify(suggestion).replace(/"/g, '&quot;')})">
                    <div class="suggestion-icon">${suggestion.icon}</div>
                    <div class="suggestion-text">${highlightText(suggestion.text, query)}</div>
                    <div class="suggestion-category">${suggestion.category}</div>
                </div>
            `).join('');
        }
        
        function showMobileHeaderNoSuggestions() {
            const content = mobileHeaderSearchSuggestions.querySelector('.suggestions-content');
            content.innerHTML = '<div class="no-suggestions">No suggestions found</div>';
        }
        
        function updateMobileHeaderSelection() {
            const items = mobileHeaderSearchSuggestions.querySelectorAll('.suggestion-item');
            items.forEach((item, index) => {
                item.classList.toggle('active', index === selectedIndex);
            });
        }
        
        function selectMobileHeaderSuggestion(suggestion) {
            mobileHeaderSearchInput.value = suggestion.text;
            hideMobileHeaderSuggestions();
            performMobileHeaderSearch();
        }
        
        function hideMobileHeaderSuggestions() {
            mobileHeaderSearchSuggestions.classList.remove('show');
            selectedIndex = -1;
        }
        
        // Make functions globally accessible
        window.selectMobileHeaderSuggestion = selectMobileHeaderSuggestion;
    }
}

function initializeDesktopSearchSuggestions() {
    const headerSearchInput = document.getElementById('headerSearchInput');
    const headerSearchSuggestions = document.getElementById('headerSearchSuggestions');
    
    if (headerSearchInput && headerSearchSuggestions) {
        let currentSuggestions = [];
        let selectedIndex = -1;
        
        // Sample suggestions data (same as mobile)
        const suggestionsData = [
            { text: 'iPhone 15 Pro', category: 'Electronics', icon: '📱' },
            { text: 'Samsung Galaxy S24', category: 'Electronics', icon: '📱' },
            { text: 'MacBook Pro', category: 'Electronics', icon: '💻' },
            { text: 'Nike Air Max', category: 'Fashion', icon: '👟' },
            { text: 'Adidas Ultraboost', category: 'Fashion', icon: '👟' },
            { text: 'KitchenAid Mixer', category: 'Home', icon: '🍳' },
            { text: 'Dyson Vacuum', category: 'Home', icon: '🧹' },
            { text: 'Sony Headphones', category: 'Electronics', icon: '🎧' },
            { text: 'Yoga Mat', category: 'Sports', icon: '🧘' },
            { text: 'The Great Gatsby', category: 'Books', icon: '📚' },
            { text: 'L\'Oreal Foundation', category: 'Beauty', icon: '💄' },
            { text: 'Car Phone Mount', category: 'Automotive', icon: '📱' }
        ];
        
        // Input event listener
        headerSearchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();
            
            if (query.length >= 2) {
                showDesktopSuggestions(query, suggestionsData);
            } else {
                hideDesktopSuggestions();
            }
        });
        
        // Focus event listener
        headerSearchInput.addEventListener('focus', function(e) {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                showDesktopSuggestions(query, suggestionsData);
            }
        });
        
        // Blur event listener (with delay to allow clicking on suggestions)
        headerSearchInput.addEventListener('blur', function() {
            setTimeout(() => {
                hideDesktopSuggestions();
            }, 200);
        });
        
        // Keyboard navigation
        headerSearchInput.addEventListener('keydown', function(e) {
            if (!headerSearchSuggestions.classList.contains('show')) return;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, currentSuggestions.length - 1);
                    updateDesktopSelection();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, -1);
                    updateDesktopSelection();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && currentSuggestions[selectedIndex]) {
                        selectDesktopSuggestion(currentSuggestions[selectedIndex]);
                    } else {
                        performHeaderSearch();
                    }
                    break;
                case 'Escape':
                    hideDesktopSuggestions();
                    break;
            }
        });
        
        function showDesktopSuggestions(query, data) {
            // Filter suggestions based on query
            currentSuggestions = data.filter(item => 
                item.text.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 8); // Limit to 8 suggestions
            
            if (currentSuggestions.length > 0) {
                renderDesktopSuggestions(currentSuggestions, query);
                headerSearchSuggestions.classList.add('show');
                selectedIndex = -1;
            } else {
                showDesktopNoSuggestions();
                headerSearchSuggestions.classList.add('show');
            }
        }
        
        function renderDesktopSuggestions(suggestions, query) {
            const content = headerSearchSuggestions.querySelector('.suggestions-content');
            content.innerHTML = suggestions.map((suggestion, index) => `
                <div class="suggestion-item" data-index="${index}" onclick="selectDesktopSuggestion(${JSON.stringify(suggestion).replace(/"/g, '&quot;')})">
                    <div class="suggestion-icon">${suggestion.icon}</div>
                    <div class="suggestion-text">${highlightText(suggestion.text, query)}</div>
                    <div class="suggestion-category">${suggestion.category}</div>
                </div>
            `).join('');
        }
        
        function showDesktopNoSuggestions() {
            const content = headerSearchSuggestions.querySelector('.suggestions-content');
            content.innerHTML = '<div class="no-suggestions">No suggestions found</div>';
        }
        
        function updateDesktopSelection() {
            const items = headerSearchSuggestions.querySelectorAll('.suggestion-item');
            items.forEach((item, index) => {
                item.classList.toggle('active', index === selectedIndex);
            });
        }
        
        function selectDesktopSuggestion(suggestion) {
            headerSearchInput.value = suggestion.text;
            hideDesktopSuggestions();
            performHeaderSearch();
        }
        
        function hideDesktopSuggestions() {
            headerSearchSuggestions.classList.remove('show');
            selectedIndex = -1;
        }
        
        // Make functions globally accessible
        window.selectDesktopSuggestion = selectDesktopSuggestion;
    }
}

// Search utility functions
function clearSearch() {
    currentSearchTerm = '';
    currentCategory = 'all';
    
    // Clear search inputs
    const searchInputs = [
        document.getElementById('searchInput'),
        document.getElementById('headerSearchInput'),
        document.getElementById('mobileSearchInput')
    ];
    
    searchInputs.forEach(input => {
        if (input) {
            input.value = '';
        }
    });
    
    console.log('Search cleared');
}

function getCurrentSearchState() {
    return {
        searchTerm: currentSearchTerm,
        category: currentCategory,
        sort: currentSort
    };
}

function setSearchState(searchTerm, category = 'all', sort = 'relevance') {
    currentSearchTerm = searchTerm;
    currentCategory = category;
    currentSort = sort;
    
    // Update UI elements
    const searchInputs = [
        document.getElementById('headerSearchInput'),
        document.getElementById('mobileSearchInput')
    ];
    
    searchInputs.forEach(input => {
        if (input) {
            input.value = searchTerm;
        }
    });
    
    console.log('Search state set:', { searchTerm, category, sort });
}

// Mobile search scroll effects
function initializeMobileSearchScrollEffects() {
    const mobileSearchContainer = document.querySelector('.mobile-search-container');
    
    if (mobileSearchContainer) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class when user scrolls down
            if (scrollTop > 50) {
                mobileSearchContainer.classList.add('scrolled');
            } else {
                mobileSearchContainer.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    }
}

// Export functions for use in other scripts
window.searchFunctions = {
    performHeaderSearch,
    performMobileSearch,
    performMobileHeaderSearch,
    clearSearch,
    getCurrentSearchState,
    setSearchState
};

// Make mobile header search function globally accessible
window.performMobileHeaderSearch = performMobileHeaderSearch;
