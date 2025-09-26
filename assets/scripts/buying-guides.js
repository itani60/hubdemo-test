// Buying Guides Data and Functionality
class BuyingGuidesManager {
    constructor() {
        this.guides = this.getRegularGuides();
        this.featuredGuide = this.getFeaturedGuide();
        this.filteredGuides = [...this.guides];
        this.currentFilters = {
            category: 'all',
            sort: 'newest'
        };
        this.currentPage = 1;
        this.guidesPerPage = 6;
        this.init();
    }

    // Featured Guide Data
    getFeaturedGuide() {
        return {
            id: 'featured-laptop-buying-guide-2024',
            title: 'Complete Laptop Buying Guide 2024: Find Your Perfect Laptop',
            excerpt: 'Everything you need to know about processors, RAM, storage, graphics cards, and more. Our comprehensive guide will help you find the perfect laptop for your needs and budget.',
            category: 'Laptops',
            difficulty: 'Intermediate',
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop&crop=center',
            date: '2024-01-20',
            fullContent: `
                <h2>Introduction to Laptop Buying</h2>
                <p>Choosing the right laptop can be overwhelming with so many options available. This comprehensive guide will walk you through all the essential factors to consider when buying a laptop in 2024.</p>
                
                <h3>Key Factors to Consider</h3>
                <ul>
                    <li><strong>Processor (CPU):</strong> Intel vs AMD, core count, and performance requirements</li>
                    <li><strong>Memory (RAM):</strong> How much RAM you need for different use cases</li>
                    <li><strong>Storage:</strong> SSD vs HDD, capacity requirements, and speed considerations</li>
                    <li><strong>Graphics:</strong> Integrated vs dedicated graphics for gaming and creative work</li>
                    <li><strong>Display:</strong> Size, resolution, and panel type considerations</li>
                    <li><strong>Battery Life:</strong> Real-world usage expectations and power management</li>
                </ul>
                
                <h3>Laptop Categories</h3>
                <h4>Budget Laptops ($300-$600)</h4>
                <p>Perfect for basic tasks like web browsing, document editing, and light multimedia. Look for at least 8GB RAM and an SSD for better performance.</p>
                
                <h4>Mid-Range Laptops ($600-$1200)</h4>
                <p>Ideal for students and professionals who need reliable performance for productivity tasks, light gaming, and multimedia consumption.</p>
                
                <h4>High-End Laptops ($1200+)</h4>
                <p>Designed for power users, content creators, and gamers who need maximum performance and premium features.</p>
                
                <h3>Operating System Options</h3>
                <p><strong>Windows:</strong> Best compatibility, wide software selection, gaming support</p>
                <p><strong>macOS:</strong> Seamless integration with Apple ecosystem, excellent for creative professionals</p>
                <p><strong>Chrome OS:</strong> Simple, secure, and affordable for basic computing needs</p>
                
                <h3>Future-Proofing Your Purchase</h3>
                <p>Consider upgradeability, warranty options, and how long you plan to use the laptop. Investing in slightly better specs now can extend the laptop's useful life.</p>
            `
        };
    }

    // Regular Buying Guides Data
    getRegularGuides() {
        return [
            {
                id: 'smartphone-buying-guide-2024',
                title: 'Smartphone Buying Guide 2024: Choose the Perfect Phone',
                excerpt: 'Complete guide to buying smartphones in 2024. Compare features, performance, cameras, and find the best phone for your budget and needs.',
                category: 'Smartphones',
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&crop=center',
                date: '2024-01-18',
                fullContent: `
                    <h2>Smartphone Buying Guide 2024</h2>
                    <p>With hundreds of smartphone options available, choosing the right one can be challenging. This guide will help you make an informed decision based on your needs and budget.</p>
                    
                    <h3>Key Features to Consider</h3>
                    <ul>
                        <li>Display size and quality</li>
                        <li>Camera system and photo quality</li>
                        <li>Processor performance</li>
                        <li>Battery life and charging speed</li>
                        <li>Storage capacity</li>
                        <li>Operating system and updates</li>
                    </ul>
                    
                    <h3>Budget Categories</h3>
                    <p><strong>Budget Phones ($100-$300):</strong> Basic functionality, decent cameras, good battery life</p>
                    <p><strong>Mid-Range Phones ($300-$700):</strong> Balanced performance, good cameras, modern features</p>
                    <p><strong>Flagship Phones ($700+):</strong> Top performance, best cameras, premium materials</p>
                    
                    <h3>Operating Systems</h3>
                    <p><strong>Android:</strong> More customization, wider price range, Google services integration</p>
                    <p><strong>iOS:</strong> Seamless ecosystem, regular updates, premium build quality</p>
                    
                    <h3>Camera Considerations</h3>
                    <p>Look for multiple lenses, night mode capabilities, and video recording quality. Consider your photography needs when choosing camera specifications.</p>
                `
            },
            {
                id: 'tablet-buying-guide-2024',
                title: 'Tablet Buying Guide 2024: iPad vs Android Tablets',
                excerpt: 'Compare iPad and Android tablets to find the perfect tablet for work, entertainment, and creativity. Expert recommendations for every budget.',
                category: 'Tablets',
                image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&crop=center',
                date: '2024-01-15',
                fullContent: `
                    <h2>Tablet Buying Guide 2024</h2>
                    <p>Tablets offer a perfect balance between smartphones and laptops. This guide will help you choose the right tablet for your needs.</p>
                    
                    <h3>Tablet Types</h3>
                    <p><strong>iPad:</strong> Premium build quality, excellent app ecosystem, long-term support</p>
                    <p><strong>Android Tablets:</strong> More affordable options, Google services integration, customization</p>
                    <p><strong>Windows Tablets:</strong> Full desktop OS, productivity focus, laptop replacement capability</p>
                    
                    <h3>Size Considerations</h3>
                    <ul>
                        <li>7-8 inches: Portable, great for reading and media consumption</li>
                        <li>9-11 inches: Balanced size for most tasks</li>
                        <li>12+ inches: Desktop replacement, professional use</li>
                    </ul>
                    
                    <h3>Use Case Recommendations</h3>
                    <p><strong>Entertainment:</strong> Focus on display quality, speakers, and battery life</p>
                    <p><strong>Productivity:</strong> Consider keyboard support, stylus compatibility, and app selection</p>
                    <p><strong>Gaming:</strong> Look for powerful processors and high-refresh displays</p>
                    
                    <h3>Accessories to Consider</h3>
                    <p>Keyboard cases, styluses, and protective covers can significantly enhance your tablet experience.</p>
                `
            },
            {
                id: 'gaming-laptop-buying-guide',
                title: 'Gaming Laptop Buying Guide 2024: Best Gaming Laptops',
                excerpt: 'Everything you need to know about buying a gaming laptop. Compare GPUs, CPUs, displays, and find the best gaming laptop for your budget.',
                category: 'Gaming',
                difficulty: 'Intermediate',
                image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop&crop=center',
                date: '2024-01-12',
                fullContent: `
                    <h2>Gaming Laptop Buying Guide 2024</h2>
                    <p>Gaming laptops offer desktop-level performance in a portable package. This guide covers everything you need to know about choosing the right gaming laptop.</p>
                    
                    <h3>Graphics Cards (GPU)</h3>
                    <p><strong>Entry-Level:</strong> RTX 4050, RTX 4060 - 1080p gaming at medium settings</p>
                    <p><strong>Mid-Range:</strong> RTX 4070, RTX 4080 - 1440p gaming at high settings</p>
                    <p><strong>High-End:</strong> RTX 4090 - 4K gaming and content creation</p>
                    
                    <h3>Processors (CPU)</h3>
                    <p><strong>Intel:</strong> 13th/14th gen i5/i7 for balanced performance</p>
                    <p><strong>AMD:</strong> Ryzen 5/7 7000 series for excellent value</p>
                    
                    <h3>Display Considerations</h3>
                    <ul>
                        <li>1080p: Good for most games, better performance</li>
                        <li>1440p: Sweet spot for gaming and productivity</li>
                        <li>4K: Best visual quality, requires powerful hardware</li>
                        <li>Refresh Rate: 144Hz+ for competitive gaming</li>
                    </ul>
                    
                    <h3>Cooling and Build Quality</h3>
                    <p>Gaming laptops generate significant heat. Look for robust cooling systems and quality build materials for longevity.</p>
                    
                    <h3>Budget Recommendations</h3>
                    <p><strong>$800-$1200:</strong> Entry-level gaming with RTX 4050/4060</p>
                    <p><strong>$1200-$2000:</strong> Mid-range gaming with RTX 4070/4080</p>
                    <p><strong>$2000+:</strong> High-end gaming with RTX 4090</p>
                `
            },
            {
                id: 'headphones-earbuds-buying-guide',
                title: 'Headphones & Earbuds Buying Guide 2024',
                excerpt: 'Complete guide to choosing the perfect headphones or earbuds. Compare wireless vs wired, noise cancellation, and find the best audio gear.',
                category: 'Audio',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center',
                date: '2024-01-10',
                fullContent: `
                    <h2>Headphones & Earbuds Buying Guide 2024</h2>
                    <p>Whether you're looking for wireless earbuds for commuting or over-ear headphones for gaming, this guide will help you find the perfect audio solution.</p>
                    
                    <h3>Types of Audio Devices</h3>
                    <p><strong>True Wireless Earbuds:</strong> Completely wireless, portable, great for active use</p>
                    <p><strong>Over-Ear Headphones:</strong> Best sound quality, comfort for long sessions</p>
                    <p><strong>On-Ear Headphones:</strong> Compact, good sound quality, less isolation</p>
                    <p><strong>In-Ear Monitors:</strong> Professional audio, excellent isolation</p>
                    
                    <h3>Key Features to Consider</h3>
                    <ul>
                        <li>Active Noise Cancellation (ANC)</li>
                        <li>Battery life and charging</li>
                        <li>Water resistance rating</li>
                        <li>Sound quality and frequency response</li>
                        <li>Comfort and fit</li>
                        <li>Connectivity options</li>
                    </ul>
                    
                    <h3>Use Case Recommendations</h3>
                    <p><strong>Commuting:</strong> True wireless earbuds with ANC</p>
                    <p><strong>Gaming:</strong> Over-ear headphones with good imaging</p>
                    <p><strong>Fitness:</strong> Wireless earbuds with secure fit</p>
                    <p><strong>Professional:</strong> Studio headphones or IEMs</p>
                    
                    <h3>Budget Categories</h3>
                    <p><strong>$50-$150:</strong> Good quality, basic features</p>
                    <p><strong>$150-$300:</strong> Premium features, excellent sound</p>
                    <p><strong>$300+:</strong> Professional grade, audiophile quality</p>
                `
            },
            {
                id: 'smart-tv-buying-guide-2024',
                title: 'Smart TV Buying Guide 2024: Best TVs for Every Budget',
                excerpt: 'Complete guide to buying smart TVs. Compare OLED vs LED, screen sizes, smart features, and find the perfect TV for your home.',
                category: 'TVs',
                image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop&crop=center',
                date: '2024-01-08',
                fullContent: `
                    <h2>Smart TV Buying Guide 2024</h2>
                    <p>Smart TVs have become the centerpiece of modern entertainment. This guide will help you choose the perfect TV for your viewing needs and budget.</p>
                    
                    <h3>Display Technologies</h3>
                    <p><strong>OLED:</strong> Perfect blacks, infinite contrast, excellent viewing angles</p>
                    <p><strong>QLED:</strong> Bright colors, good for bright rooms, more affordable than OLED</p>
                    <p><strong>LED/LCD:</strong> Most affordable, good performance, widely available</p>
                    <p><strong>Mini-LED:</strong> Better contrast than LED, more affordable than OLED</p>
                    
                    <h3>Screen Size Guidelines</h3>
                    <ul>
                        <li>32-43 inches: Small to medium rooms, bedrooms</li>
                        <li>50-55 inches: Living rooms, most popular size</li>
                        <li>65-75 inches: Large living rooms, home theaters</li>
                        <li>80+ inches: Dedicated home theater rooms</li>
                    </ul>
                    
                    <h3>Resolution Options</h3>
                    <p><strong>4K (3840x2160):</strong> Standard for new TVs, excellent detail</p>
                    <p><strong>8K (7680x4320):</strong> Future-proof, limited content available</p>
                    <p><strong>1080p:</strong> Budget option, still good for smaller screens</p>
                    
                    <h3>Smart TV Features</h3>
                    <p>Consider the smart platform (Android TV, Roku, webOS), app selection, voice control, and streaming service compatibility.</p>
                    
                    <h3>Gaming Considerations</h3>
                    <p>Look for low input lag, high refresh rates (120Hz+), and HDMI 2.1 support for next-gen gaming consoles.</p>
                `
            },
            {
                id: 'gaming-console-buying-guide',
                title: 'Gaming Console Buying Guide 2024: PS5 vs Xbox vs Nintendo',
                excerpt: 'Compare PlayStation 5, Xbox Series X/S, and Nintendo Switch to find the best gaming console for your needs and budget.',
                category: 'Gaming',
                image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop&crop=center',
                date: '2024-01-05',
                fullContent: `
                    <h2>Gaming Console Buying Guide 2024</h2>
                    <p>With three major console options available, choosing the right gaming console depends on your gaming preferences, budget, and ecosystem preferences.</p>
                    
                    <h3>Console Comparison</h3>
                    <p><strong>PlayStation 5:</strong> Exclusive games, 4K gaming, DualSense controller features</p>
                    <p><strong>Xbox Series X/S:</strong> Game Pass subscription, backward compatibility, cross-platform gaming</p>
                    <p><strong>Nintendo Switch:</strong> Portable gaming, family-friendly, unique first-party games</p>
                    
                    <h3>Performance Considerations</h3>
                    <ul>
                        <li>PlayStation 5: 4K gaming, ray tracing, fast SSD</li>
                        <li>Xbox Series X: 4K gaming, 120fps support, quick resume</li>
                        <li>Xbox Series S: 1440p gaming, compact design, budget-friendly</li>
                        <li>Nintendo Switch: 1080p docked, 720p portable, unique hybrid design</li>
                    </ul>
                    
                    <h3>Game Libraries</h3>
                    <p><strong>PlayStation:</strong> Spider-Man, God of War, The Last of Us, Horizon</p>
                    <p><strong>Xbox:</strong> Halo, Forza, Gears of War, plus Game Pass library</p>
                    <p><strong>Nintendo:</strong> Mario, Zelda, Pokémon, Animal Crossing</p>
                    
                    <h3>Budget Considerations</h3>
                    <p>Factor in console price, game costs, online subscriptions, and accessories when budgeting for your gaming setup.</p>
                    
                    <h3>Future-Proofing</h3>
                    <p>Consider upcoming game releases, console lifecycle, and upgrade paths when making your decision.</p>
                `
            },
            {
                id: 'smartwatch-buying-guide-2024',
                title: 'Smartwatch Buying Guide 2024: Apple Watch vs Android Watches',
                excerpt: 'Compare smartwatches from Apple, Samsung, and other brands. Find the perfect smartwatch for fitness, productivity, and style.',
                category: 'Wearables',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&crop=center',
                date: '2024-01-03',
                fullContent: `
                    <h2>Smartwatch Buying Guide 2024</h2>
                    <p>Smartwatches have evolved from simple notification devices to comprehensive health and fitness companions. This guide will help you choose the right smartwatch.</p>
                    
                    <h3>Smartwatch Categories</h3>
                    <p><strong>Apple Watch:</strong> Best iPhone integration, comprehensive health features, premium build</p>
                    <p><strong>Android Watches:</strong> Google Wear OS, diverse options, Android phone integration</p>
                    <p><strong>Fitness Watches:</strong> Garmin, Fitbit - specialized for health and fitness tracking</p>
                    <p><strong>Hybrid Watches:</strong> Traditional watch design with smart features</p>
                    
                    <h3>Key Features to Consider</h3>
                    <ul>
                        <li>Health and fitness tracking</li>
                        <li>Battery life and charging</li>
                        <li>Water resistance</li>
                        <li>App ecosystem</li>
                        <li>Display type and size</li>
                        <li>Phone compatibility</li>
                    </ul>
                    
                    <h3>Use Case Recommendations</h3>
                    <p><strong>Fitness Focus:</strong> Garmin, Fitbit, or Apple Watch with comprehensive health tracking</p>
                    <p><strong>Productivity:</strong> Apple Watch or premium Android watches with good app support</p>
                    <p><strong>Style:</strong> Hybrid watches or premium smartwatches with customizable bands</p>
                    
                    <h3>Budget Considerations</h3>
                    <p><strong>$100-$300:</strong> Basic smartwatches with essential features</p>
                    <p><strong>$300-$600:</strong> Premium features, better build quality</p>
                    <p><strong>$600+:</strong> Luxury smartwatches with premium materials</p>
                `
            },
            {
                id: 'router-wifi-buying-guide',
                title: 'WiFi Router Buying Guide 2024: Best Routers for Home Internet',
                excerpt: 'Complete guide to buying WiFi routers. Compare speeds, coverage, mesh systems, and find the best router for your home network.',
                category: 'Networking',
                difficulty: 'Intermediate',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&crop=center',
                date: '2024-01-01',
                fullContent: `
                    <h2>WiFi Router Buying Guide 2024</h2>
                    <p>A good WiFi router is essential for reliable internet connectivity. This guide covers everything you need to know about choosing the right router for your home.</p>
                    
                    <h3>Router Types</h3>
                    <p><strong>Single Router:</strong> Traditional router, good for small to medium homes</p>
                    <p><strong>Mesh Systems:</strong> Multiple nodes for whole-home coverage</p>
                    <p><strong>Gaming Routers:</strong> Optimized for low latency and gaming performance</p>
                    <p><strong>Business Routers:</strong> Advanced features for power users</p>
                    
                    <h3>WiFi Standards</h3>
                    <ul>
                        <li>WiFi 6E: Latest standard, 6GHz band, best performance</li>
                        <li>WiFi 6: Current standard, improved efficiency and speed</li>
                        <li>WiFi 5: Still widely used, good for basic needs</li>
                    </ul>
                    
                    <h3>Key Features to Consider</h3>
                    <p><strong>Speed:</strong> Look for routers that match or exceed your internet plan</p>
                    <p><strong>Coverage:</strong> Consider your home size and layout</p>
                    <p><strong>Security:</strong> WPA3 encryption, automatic updates</p>
                    <p><strong>Parental Controls:</strong> Content filtering and time management</p>
                    
                    <h3>Home Size Recommendations</h3>
                    <p><strong>Small (1-2 bedrooms):</strong> Single router with good range</p>
                    <p><strong>Medium (3-4 bedrooms):</strong> High-power router or basic mesh system</p>
                    <p><strong>Large (5+ bedrooms):</strong> Mesh system or multiple access points</p>
                    
                    <h3>Budget Guidelines</h3>
                    <p><strong>$50-$150:</strong> Basic routers for small homes</p>
                    <p><strong>$150-$300:</strong> Mid-range routers with good features</p>
                    <p><strong>$300+:</strong> High-end routers and mesh systems</p>
                `
            },
            {
                id: 'monitor-buying-guide-2024',
                title: 'Monitor Buying Guide 2024: Best Monitors for Work and Gaming',
                excerpt: 'Complete guide to buying computer monitors. Compare resolutions, refresh rates, panel types, and find the perfect monitor for your needs.',
                category: 'Computers',
                difficulty: 'Intermediate',
                image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop&crop=center',
                date: '2023-12-28',
                fullContent: `
                    <h2>Monitor Buying Guide 2024</h2>
                    <p>Your monitor is your window to the digital world. This guide will help you choose the perfect monitor for work, gaming, or creative tasks.</p>
                    
                    <h3>Panel Types</h3>
                    <p><strong>IPS:</strong> Best color accuracy, good viewing angles, popular for professional use</p>
                    <p><strong>VA:</strong> Good contrast ratios, better than IPS for dark content</p>
                    <p><strong>TN:</strong> Fast response times, good for competitive gaming</p>
                    <p><strong>OLED:</strong> Perfect blacks, excellent contrast, premium option</p>
                    
                    <h3>Resolution Options</h3>
                    <ul>
                        <li>1080p (1920x1080): Standard resolution, good for most uses</li>
                        <li>1440p (2560x1440): Sweet spot for gaming and productivity</li>
                        <li>4K (3840x2160): High detail, great for content creation</li>
                        <li>Ultrawide: 21:9 aspect ratio, immersive experience</li>
                    </ul>
                    
                    <h3>Use Case Recommendations</h3>
                    <p><strong>Gaming:</strong> High refresh rate (144Hz+), low response time, adaptive sync</p>
                    <p><strong>Content Creation:</strong> High resolution, accurate colors, wide color gamut</p>
                    <p><strong>Office Work:</strong> Good ergonomics, multiple inputs, built-in USB hub</p>
                    <p><strong>General Use:</strong> Balanced features, good value, reliable performance</p>
                    
                    <h3>Size Considerations</h3>
                    <p>Consider your desk space, viewing distance, and resolution when choosing monitor size. 24-27 inches is popular for most uses.</p>
                    
                    <h3>Connectivity Options</h3>
                    <p>Look for HDMI, DisplayPort, USB-C, and USB hub functionality based on your needs.</p>
                `
            },
            {
                id: 'laptop-accessories-buying-guide',
                title: 'Laptop Accessories Buying Guide 2024: Essential Add-ons',
                excerpt: 'Complete guide to laptop accessories. Find the best laptop bags, mice, keyboards, docking stations, and other essential accessories.',
                category: 'Computers',
                image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center',
                date: '2023-12-25',
                fullContent: `
                    <h2>Laptop Accessories Buying Guide 2024</h2>
                    <p>Enhance your laptop experience with the right accessories. This guide covers essential add-ons that can improve productivity, comfort, and functionality.</p>
                    
                    <h3>Essential Accessories</h3>
                    <p><strong>Laptop Bag:</strong> Protection and portability for your laptop</p>
                    <p><strong>External Mouse:</strong> Better ergonomics and precision than trackpad</p>
                    <p><strong>Keyboard:</strong> Mechanical or membrane options for better typing</p>
                    <p><strong>Monitor:</strong> External display for increased productivity</p>
                    
                    <h3>Productivity Accessories</h3>
                    <ul>
                        <li>Docking Station: Multiple ports and external display support</li>
                        <li>USB Hub: Expand connectivity options</li>
                        <li>Laptop Stand: Better ergonomics and cooling</li>
                        <li>Webcam: Better video quality for meetings</li>
                    </ul>
                    
                    <h3>Comfort and Ergonomics</h3>
                    <p><strong>Laptop Stand:</strong> Adjustable height for better posture</p>
                    <p><strong>Ergonomic Mouse:</strong> Reduce wrist strain during long use</p>
                    <p><strong>Wrist Rest:</strong> Comfort for extended typing sessions</p>
                    <p><strong>Blue Light Glasses:</strong> Reduce eye strain from screen time</p>
                    
                    <h3>Storage and Backup</h3>
                    <p>External hard drives, SSDs, and cloud storage solutions for data backup and expansion.</p>
                    
                    <h3>Budget Considerations</h3>
                    <p>Prioritize accessories based on your primary use case. Start with essentials like a good bag and mouse, then add productivity accessories as needed.</p>
                `
            }
        ];
    }

    init() {
        this.setupEventListeners();
        this.renderFeaturedGuide();
        this.renderGuides();
        this.updateStats();
        this.updatePagination();
    }

    setupEventListeners() {
        // Filter event listeners
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }

        // Pagination event listeners
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');

        if (prevPage) {
            prevPage.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderGuides();
                    this.updatePagination();
                }
            });
        }

        if (nextPage) {
            nextPage.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredGuides.length / this.guidesPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderGuides();
                    this.updatePagination();
                }
            });
        }

        // Guide modal close event
        const modalClose = document.getElementById('guideModalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeGuideModal();
            });
        }

        // Close modal when clicking outside
        const modal = document.getElementById('guideModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeGuideModal();
                }
            });
        }
    }

    applyFilters() {
        this.filteredGuides = [...this.guides];

        // Apply category filter
        if (this.currentFilters.category !== 'all') {
            this.filteredGuides = this.filteredGuides.filter(guide => 
                guide.category === this.currentFilters.category
            );
        }

        // Apply sorting
        this.sortGuides();

        this.renderGuides();
        this.updatePagination();
    }

    sortGuides() {
        switch (this.currentFilters.sort) {
            case 'newest':
                this.filteredGuides.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'popular':
                // For now, sort by date (could be enhanced with view counts)
                this.filteredGuides.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }
    }

    renderFeaturedGuide() {
        const featuredGuide = this.featuredGuide;
        const featuredGuideElement = document.querySelector('.featured-guide');
        
        if (featuredGuideElement && featuredGuide) {
            featuredGuideElement.innerHTML = `
                <div class="featured-guide-image">
                    <img src="${featuredGuide.image}" alt="${featuredGuide.title}">
                </div>
                <div class="featured-guide-content">
                    <div class="featured-badge">Featured Guide</div>
                    <h2>${featuredGuide.title}</h2>
                    <p>${featuredGuide.excerpt}</p>
                    <a href="#" class="featured-read-more" onclick="buyingGuidesManager.openGuideModal('${featuredGuide.id}'); return false;">
                        Read Full Guide <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
        }
    }

    renderGuides() {
        const guidesGrid = document.getElementById('guidesGrid');
        if (!guidesGrid) return;

        const startIndex = (this.currentPage - 1) * this.guidesPerPage;
        const endIndex = startIndex + this.guidesPerPage;
        const guidesToShow = this.filteredGuides.slice(startIndex, endIndex);

        if (guidesToShow.length === 0) {
            guidesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No guides found</h3>
                    <p>Try adjusting your filters to see more guides.</p>
                </div>
            `;
            return;
        }

        guidesGrid.innerHTML = guidesToShow.map(guide => `
            <div class="guide-card" onclick="buyingGuidesManager.openGuideModal('${guide.id}')">
                <div class="guide-image">
                    <img src="${guide.image}" alt="${guide.title}" loading="lazy">
                    <div class="guide-badge">${guide.category}</div>
                </div>
                <div class="guide-content">
                    <h3 class="guide-title">${guide.title}</h3>
                    <p class="guide-description">${guide.excerpt}</p>
                    <div class="guide-meta">
                        ${guide.difficulty ? `<span class="guide-difficulty">${guide.difficulty}</span>` : ''}
                    </div>
                    <a href="#" class="guide-read-more" onclick="event.stopPropagation(); buyingGuidesManager.openGuideModal('${guide.id}'); return false;">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `).join('');
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredGuides.length / this.guidesPerPage);
        const pagesContainer = document.getElementById('pages');
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
        const paginationInfo = document.getElementById('paginationInfo');

        if (pagesContainer) {
            pagesContainer.innerHTML = '';
            
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
                pageButton.textContent = i;
                pageButton.addEventListener('click', () => {
                    this.currentPage = i;
                    this.renderGuides();
                    this.updatePagination();
                });
                pagesContainer.appendChild(pageButton);
            }
        }

        if (prevButton) {
            prevButton.disabled = this.currentPage === 1;
        }

        if (nextButton) {
            nextButton.disabled = this.currentPage === totalPages;
        }

        if (paginationInfo) {
            const startItem = (this.currentPage - 1) * this.guidesPerPage + 1;
            const endItem = Math.min(this.currentPage * this.guidesPerPage, this.filteredGuides.length);
            paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${this.filteredGuides.length} guides`;
        }
    }

    openGuideModal(guideId) {
        let guide;
        
        // Check if it's the featured guide
        if (guideId === this.featuredGuide.id) {
            guide = this.featuredGuide;
        } else {
            guide = this.guides.find(g => g.id === guideId);
        }
        
        if (!guide) return;

        const modal = document.getElementById('guideModal');
        const modalCategory = document.getElementById('modalCategory');
        const modalTitle = document.getElementById('modalTitle');
        const modalDate = document.getElementById('modalDateText');
        const modalContent = document.getElementById('modalContent');

        if (modalCategory) modalCategory.textContent = guide.category;
        if (modalTitle) modalTitle.textContent = guide.title;
        if (modalDate) modalDate.textContent = this.formatDate(guide.date);
        if (modalContent) modalContent.innerHTML = guide.fullContent;

        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeGuideModal() {
        const modal = document.getElementById('guideModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    updateStats() {
        // Update stats based on actual guide data
        const totalGuides = this.guides.length + 1; // +1 for featured guide
        const totalProducts = Math.floor(Math.random() * 1000) + 500; // Simulated
        const happyReaders = Math.floor(Math.random() * 100000) + 50000; // Simulated

        // Update stat cards if they exist
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = `${totalGuides}+`;
            statNumbers[1].textContent = `${totalProducts}+`;
            statNumbers[2].textContent = `${happyReaders.toLocaleString()}+`;
        }
    }
}

// Global function for opening guide modal (called from HTML)
function openGuideModal(guideId) {
    if (window.buyingGuidesManager) {
        window.buyingGuidesManager.openGuideModal(guideId);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.buyingGuidesManager = new BuyingGuidesManager();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BuyingGuidesManager;
}

