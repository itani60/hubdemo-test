// Local Business Data for local-business.html
// This file contains all the local business data

// Function to get randomized business cards for index.html
function getRandomizedBusinessCards(count = 3) {
    const allBusinesses = getRegularBusinesses();
    
    // Remove duplicates by filtering unique IDs
    const uniqueBusinesses = [];
    const seenIds = new Set();
    
    allBusinesses.forEach(business => {
        if (!seenIds.has(business.id)) {
            seenIds.add(business.id);
            uniqueBusinesses.push(business);
        }
    });
    
    // Shuffle the array using Fisher-Yates algorithm
    const shuffled = [...uniqueBusinesses];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Return the requested number of businesses
    return shuffled.slice(0, count);
}

// Function to render business cards for index.html
function renderBusinessCards(containerId, count = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const businesses = getRandomizedBusinessCards(count);
    
    container.innerHTML = businesses.map(business => `
        <div class="col-12 col-md-4">
            <a href="local-business.html?business=${business.id}&openModal=true" class="text-decoration-none">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-img-top" style="height: 200px; overflow: hidden;">
                        <img src="${business.image}" 
                             alt="${business.name}" 
                             class="img-fluid w-100 h-100" 
                             style="object-fit: cover;"
                             loading="lazy">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${business.name}</h5>
                        <p class="card-text text-muted small">${business.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-primary">${business.category}</span>
                            <small class="text-muted">${business.location.split(',')[0]}</small>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

// Regular Businesses Data
function getRegularBusinesses() {
    return [
        {
            id: 'blossom-prints',
            name: 'Blossom Prints',
            description: 'Programs,Personalised Chocolates,Personalized Water & Wine Stickers,Kiddies Party Packs,Personalized Photo Frames,Virtual Invitations & stationery specializing in birthday cards, invitations, and custom designs.',
            category: 'Services',
            location: 'Johannesburg, Doornfontein, Gauteng',
            phone: '0647392676',
            hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
            whatsapp: '27764476275',
            tiktok: '@blossomprints0',
            instagram: '@blossom_prints1',
            image: 'https://comparehub-smartphone-images.s3.af-south-1.amazonaws.com/logos/IMG-20250827-WA0007.jpg',
            rating: 4.8,
            distance: 0.5,
            serviceGalleries: {
                'Personalized Photo Frames': [
                    { image: 'https://comparehub-smartphone-images.s3.af-south-1.amazonaws.com/local+business+images/blossom-prints/IMG-20250827-WA0023.jpg', title: 'Custom Birthday Card Design' },
                    { image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center', title: 'Personalized Photo Cards' },
                    { image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center', title: 'Elegant Birthday Invitations' },
                    { image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop&crop=center', title: 'Kids Birthday Cards' },
                    { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center', title: 'Adult Birthday Cards' },
                    { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center', title: 'Themed Birthday Cards' }
                ],
                'Virtual Invitations': [
                    { image: 'https://comparehub-smartphone-images.s3.af-south-1.amazonaws.com/local+business+images/blossom-prints/IMG-20250827-WA0020.jpg', title: 'Classic Wedding Invitations' },
                    { image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center', title: 'Modern Wedding Invitations' },
                    { image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop&crop=center', title: 'Rustic Wedding Invitations' },
                    { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center', title: 'Elegant Wedding Invitations' },
                    { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center', title: 'Custom Wedding Invitations' }
                ],
                'Programs': [
                    { image: 'https://local-business-images.s3.af-south-1.amazonaws.com/blossom-prints/programs/programs5.jpg', title: '' },
                    { image: 'https://local-business-images.s3.af-south-1.amazonaws.com/blossom-prints/programs/programs4.jpg', title: '' },
                    { image: 'https://local-business-images.s3.af-south-1.amazonaws.com/blossom-prints/programs/programs3.jpg', title: '' },
                    { image: 'https://local-business-images.s3.af-south-1.amazonaws.com/blossom-prints/programs/programs2.jpg', title: '' }
                ],
                'Personalized Water & Wine Stickers': [
                    { image: 'https://local-business-images.s3.af-south-1.amazonaws.com/blossom-prints/Personalized+Water+%26+Wine+Stickers+/personalized+water+1.jpeg', title: 'Custom Stickers' },
                    { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center', title: 'Product Labels' },
                    { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center', title: 'Water Bottle Stickers' },
                    { image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop&crop=center', title: 'Wine Bottle Labels' },
                    { image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center', title: 'Event Stickers' }
                ],
                'Kids Party Packs': [
                    { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center', title: 'Kids Party Invitations' },
                    { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center', title: 'Party Decorations' },
                    { image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop&crop=center', title: 'Party Favors' },
                    { image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center', title: 'Themed Party Sets' },
                    { image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center', title: 'Party Games & Activities' }
                ],
                'Personalized Chocolates': [
                    { image: 'https://local-business-images.s3.af-south-1.amazonaws.com/blossom-prints/Personalized+Chocolates/p+chocolates.jpg', title: '' },
                    { image: 'https://local-business-images.s3.af-south-1.amazonaws.com/blossom-prints/Personalized+Chocolates/p+chocolates3.jpg', title: '' },
                    { image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center', title: '' },
                    { image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center', title: '' }
                ]
            },
            fullContent: `
                <h2>About Blossom Prints</h2>
                <p>Blossom Prints is your go-to destination for personalized gifts and stationery. We specialize in creating beautiful, custom designs that make every occasion special.</p>
                
                <h3>Our Services</h3>
                <ul>
                    <li><strong>Programs:</strong> Custom ceremony and event programs</li>
                    <li><strong>Personalised Chocolates:</strong> Custom chocolate bars and gift boxes</li>
                    <li><strong>Personalized Water & Wine Stickers:</strong> Custom branded stickers</li>
                    <li><strong>Kiddies Party Packs:</strong> Complete party packages for children</li>
                    <li><strong>Personalized Photo Frames:</strong> with your own photos</li>
                    <li><strong>Invitations:</strong> Custom invitations for all special events</li>
                </ul>
                
                <h3>Why Choose Us</h3>
                <ul>
                    <li>High quality prints with attention to detail</li>
                    <li>Fast turnaround times to meet your deadlines</li>
                    <li>Affordable pricing without compromising quality</li>
                    <li>Custom solutions tailored to your specific needs</li>
                    <li>Excellent customer service and support</li>
                </ul>
                
                <h3>Our Work Gallery</h3>
                <div class="gallery-grid">
                    <div class="gallery-item" onclick="openGalleryModal('Personalized Photo Frames')">
                        <img src="https://local-business-images.s3.af-south-1.amazonaws.com/blossom-prints/Personalized+Photo+Frames/personalised+photoframes.jpeg" alt="Custom Birthday Cards" />
                        <p>Personalized Photo Frames</p>
                    </div>
                    <div class="gallery-item" onclick="openGalleryModal('Programs')">
                        <img src="https://local-business-images.s3.af-south-1.amazonaws.com/blossom-prints/programs/programs+1.jpg" />
                        <p>Programs</p>
                    </div>
                    <div class="gallery-item" onclick="openGalleryModal('Virtual Invitations')">
                        <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center" alt="Invitations" />
                        <p>Invitations</p>
                    </div>
                    <div class="gallery-item" onclick="openGalleryModal('Personalized Water & Wine Stickers')">
                        <img src="https://local-business-images.s3.af-south-1.amazonaws.com/blossom-prints/Personalized+Water+%26+Wine+Stickers+/personalized+water+1.jpeg" />
                        <p>Personalized Water & Wine Stickers</p>
                    </div>
                    <div class="gallery-item" onclick="openGalleryModal('Kids Party Packs')">
                        <img src="https://local-business-images.s3.af-south-1.amazonaws.com/blossom-prints/Kids+Party+Packs/kids+party+packs+3.jpeg" alt="Party Packages" />
                        <p>Kids Party Packs</p>
                    </div>
                    <div class="gallery-item" onclick="openGalleryModal('Personalized Chocolates')">
                        <img src="https://local-business-images.s3.af-south-1.amazonaws.com/blossom-prints/Personalized+Chocolates/p+chocolates+front.jpg" alt="Custom Chocolates" />
                        <p>Personalized Chocolates</p>
                    </div>
                </div>
                
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM<br>
                Saturday: 10:00 AM - 4:00 PM<br>
                Sunday: Closed</p>
            `
        },
       
        {
            id: 'tech-repair-pro',
            name: 'Tech Repair Pro',
            description: 'Professional computer and smartphone repair services with quick turnaround times.',
            category: 'Services',
            location: 'Suburbs',
            phone: '+1 (555) 345-6789',
            hours: 'Mon-Sat: 9AM-7PM',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center',
            rating: 4.9,
            distance: 1.2,
            fullContent: `
                <h2>Tech Repair Pro - Your Technology Experts</h2>
                <p>We provide fast, reliable, and affordable repair services for all your electronic devices. Our certified technicians have years of experience fixing everything from smartphones to laptops.</p>
                
                <h3>Services We Offer</h3>
                <h4>Smartphone Repairs</h4>
                <ul>
                    <li>Screen replacement (iPhone, Samsung, Google Pixel)</li>
                    <li>Battery replacement</li>
                    <li>Water damage repair</li>
                    <li>Camera and speaker repairs</li>
                    <li>Software troubleshooting</li>
                </ul>
                
                <h4>Computer Repairs</h4>
                <ul>
                    <li>Laptop screen replacement</li>
                    <li>Hard drive and SSD upgrades</li>
                    <li>Virus removal and system optimization</li>
                    <li>Keyboard and trackpad repairs</li>
                    <li>Data recovery services</li>
                </ul>
                
                <h4>Tablet Repairs</h4>
                <ul>
                    <li>iPad screen replacement</li>
                    <li>Android tablet repairs</li>
                    <li>Battery replacement</li>
                    <li>Charging port repairs</li>
                </ul>
                
                <h3>Why Choose Us</h3>
                <ul>
                    <li>Same-day service available</li>
                    <li>1-year warranty on all repairs</li>
                    <li>Free diagnostic service</li>
                    <li>Competitive pricing</li>
                    <li>Certified technicians</li>
                </ul>
                
                <h3>Contact Information</h3>
                <p><strong>Address:</strong> 789 Tech Plaza, Suburbs<br>
                <strong>Phone:</strong> +1 (555) 345-6789<br>
                <strong>Email:</strong> info@techrepairpro.com<br>
                <strong>Website:</strong> www.techrepairpro.com</p>
            `
        },
        {
            id: 'blossom-prints',
            name: 'Blossom Prints',
            description: 'Personalized gifts & stationery specializing in birthday cards, invitations, and custom designs.',
            category: 'Services',
            location: 'Johannesburg, Doornfontein',
            phone: '0647392676',
            hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
            whatsapp: '0647392676',
            tiktok: '@blossomprints',
            instagram: '@blossom_prints1',
            image: 'https://comparehub-smartphone-images.s3.af-south-1.amazonaws.com/logos/IMG-20250827-WA0007.jpg',
            rating: 4.8,
            distance: 0.5,
            serviceGalleries: {
                'Personalized Birthday Cards': [
                    { image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop&crop=center', title: 'Custom Birthday Card Design' },
                    { image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center', title: 'Personalized Photo Cards' },
                    { image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center', title: 'Elegant Birthday Invitations' },
                    { image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop&crop=center', title: 'Kids Birthday Cards' },
                    { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center', title: 'Adult Birthday Cards' },
                    { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center', title: 'Themed Birthday Cards' }
                ],
                'Wedding Invitations': [
                    { image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center', title: 'Classic Wedding Invitations' },
                    { image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center', title: 'Modern Wedding Invitations' },
                    { image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop&crop=center', title: 'Rustic Wedding Invitations' },
                    { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center', title: 'Elegant Wedding Invitations' },
                    { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center', title: 'Custom Wedding Invitations' }
                ],
                'Table Name Cards': [
                    { image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center', title: 'Elegant Table Name Cards' },
                    { image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop&crop=center', title: 'Wedding Table Cards' },
                    { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center', title: 'Event Table Cards' },
                    { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center', title: 'Custom Table Name Cards' }
                ],
                'Custom Stickers & Labels': [
                    { image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop&crop=center', title: 'Custom Stickers' },
                    { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center', title: 'Product Labels' },
                    { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center', title: 'Water Bottle Stickers' },
                    { image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop&crop=center', title: 'Wine Bottle Labels' },
                    { image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center', title: 'Event Stickers' }
                ],
                'Kids Party Packages': [
                    { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center', title: 'Kids Party Invitations' },
                    { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center', title: 'Party Decorations' },
                    { image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop&crop=center', title: 'Party Favors' },
                    { image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center', title: 'Themed Party Sets' },
                    { image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center', title: 'Party Games & Activities' }
                ],
                'Personalized Chocolates': [
                    { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center', title: 'Custom Chocolate Boxes' },
                    { image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop&crop=center', title: 'Personalized Chocolate Bars' },
                    { image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center', title: 'Wedding Chocolate Favors' },
                    { image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center', title: 'Corporate Chocolate Gifts' }
                ]
            },
            fullContent: `
                <h2>About Blossom Prints</h2>
                <p>Blossom Prints is your go-to destination for personalized gifts and stationery. We specialize in creating beautiful, custom designs that make every occasion special.</p>
                
                <h3>Our Services</h3>
                <ul>
                    <li><strong>Programs:</strong> Custom ceremony and event programs</li>
                    <li><strong>Personalised Chocolates:</strong> Custom chocolate bars and gift boxes</li>
                    <li><strong>Personalized Water & Wine Stickers:</strong> Custom branded stickers</li>
                    <li><strong>Kiddies Party Packs:</strong> Complete party packages for children</li>
                    <li><strong>Table Name Cards:</strong> Elegant table cards for events</li>
                    <li><strong>Invitations:</strong> Custom invitations for all special events</li>
                </ul>
                
                <h3>Why Choose Us</h3>
                <ul>
                    <li>High quality prints with attention to detail</li>
                    <li>Fast turnaround times to meet your deadlines</li>
                    <li>Affordable pricing without compromising quality</li>
                    <li>Custom solutions tailored to your specific needs</li>
                    <li>Excellent customer service and support</li>
                </ul>
                
                <h3>Our Work Gallery</h3>
                <div class="gallery-grid">
                    <div class="gallery-item" onclick="openGalleryModal('Personalized Birthday Cards')">
                        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop&crop=center" alt="Custom Birthday Cards" />
                        <p>Personalized Birthday Cards</p>
                    </div>
                    <div class="gallery-item" onclick="openGalleryModal('Wedding Invitations')">
                        <img src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop&crop=center" alt="Wedding Invitations" />
                        <p>Wedding Invitations</p>
                    </div>
                    <div class="gallery-item" onclick="openGalleryModal('Table Name Cards')">
                        <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center" alt="Table Name Cards" />
                        <p>Table Name Cards</p>
                    </div>
                    <div class="gallery-item" onclick="openGalleryModal('Custom Stickers & Labels')">
                        <img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=300&h=300&fit=crop&crop=center" alt="Custom Stickers" />
                        <p>Custom Stickers & Labels</p>
                    </div>
                    <div class="gallery-item" onclick="openGalleryModal('Kids Party Packages')">
                        <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&crop=center" alt="Party Packages" />
                        <p>Kids Party Packages</p>
                    </div>
                    <div class="gallery-item" onclick="openGalleryModal('Personalized Chocolates')">
                        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop&crop=center" alt="Custom Chocolates" />
                        <p>Personalized Chocolates</p>
                    </div>
                </div>
                
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM<br>
                Saturday: 10:00 AM - 4:00 PM<br>
                Sunday: Closed</p>
            `
        },
        {
            id: 'tech-repair-pro',
            name: 'Tech Repair Pro',
            description: 'Professional computer and smartphone repair services with quick turnaround times.',
            category: 'Services',
            location: 'Suburbs',
            phone: '+1 (555) 345-6789',
            hours: 'Mon-Sat: 9AM-7PM',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center',
            rating: 4.9,
            distance: 1.2,
            fullContent: `
                <h2>Tech Repair Pro - Your Technology Experts</h2>
                <p>We provide fast, reliable, and affordable repair services for all your electronic devices. Our certified technicians have years of experience fixing everything from smartphones to laptops.</p>
                
                <h3>Services We Offer</h3>
                <h4>Smartphone Repairs</h4>
                <ul>
                    <li>Screen replacement (iPhone, Samsung, Google Pixel)</li>
                    <li>Battery replacement</li>
                    <li>Water damage repair</li>
                    <li>Camera and speaker repairs</li>
                    <li>Software troubleshooting</li>
                </ul>
                
                <h4>Computer Repairs</h4>
                <ul>
                    <li>Laptop screen replacement</li>
                    <li>Hard drive and SSD upgrades</li>
                    <li>Virus removal and system optimization</li>
                    <li>Keyboard and trackpad repairs</li>
                    <li>Data recovery services</li>
                </ul>
                
                <h4>Tablet Repairs</h4>
                <ul>
                    <li>iPad screen replacement</li>
                    <li>Android tablet repairs</li>
                    <li>Battery replacement</li>
                    <li>Charging port repairs</li>
                </ul>
                
                <h3>Why Choose Us</h3>
                <ul>
                    <li>Same-day service available</li>
                    <li>1-year warranty on all repairs</li>
                    <li>Free diagnostic service</li>
                    <li>Competitive pricing</li>
                    <li>Certified technicians</li>
                </ul>
                
                <h3>Contact Information</h3>
                <p><strong>Address:</strong> 789 Tech Plaza, Suburbs<br>
                <strong>Phone:</strong> +1 (555) 345-6789<br>
                <strong>Email:</strong> info@techrepairpro.com<br>
                <strong>Website:</strong> www.techrepairpro.com</p>
            `
        },
        {
            id: 'boutique-fashion',
            name: 'Boutique Fashion',
            description: 'Trendy women\'s clothing boutique featuring local designers and unique fashion pieces.',
            category: 'Retail',
            location: 'Shopping Areas',
            phone: '+1 (555) 678-9012',
            hours: 'Mon-Sat: 10AM-8PM, Sun: 12PM-6PM',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center',
            rating: 4.5,
            distance: 1.5,
            fullContent: `
                <h2>Boutique Fashion - Where Style Meets Individuality</h2>
                <p>Discover unique fashion pieces that express your personal style. We curate collections from both established and emerging local designers.</p>
                
                <h3>Our Collections</h3>
                <h4>Women's Clothing</h4>
                <ul>
                    <li>Casual and business casual wear</li>
                    <li>Evening and special occasion dresses</li>
                    <li>Trendy tops and blouses</li>
                    <li>Denim and casual pants</li>
                    <li>Outerwear and jackets</li>
                </ul>
                
                <h4>Accessories</h4>
                <ul>
                    <li>Handbags and purses</li>
                    <li>Jewelry and statement pieces</li>
                    <li>Scarves and belts</li>
                    <li>Sunglasses and eyewear</li>
                    <li>Hats and hair accessories</li>
                </ul>
                
                <h3>Special Services</h3>
                <ul>
                    <li>Personal styling consultations</li>
                    <li>Alteration services</li>
                    <li>Special order requests</li>
                    <li>Gift wrapping and personal shopping</li>
                    <li>Loyalty rewards program</li>
                </ul>
                
                <h3>Local Designers</h3>
                <p>We proudly support local designers and artisans, featuring exclusive pieces you won't find anywhere else. New arrivals every week!</p>
                
                <h3>Contact Information</h3>
                <p><strong>Address:</strong> 987 Fashion Avenue, Shopping Areas<br>
                <strong>Phone:</strong> +1 (555) 678-9012<br>
                <strong>Email:</strong> shop@boutiquefashion.com<br>
                <strong>Website:</strong> www.boutiquefashion.com</p>
            `
        },
        {
            id: 'family-dentistry',
            name: 'Family Dentistry',
            description: 'Comprehensive dental care for the whole family with modern equipment and gentle care.',
            category: 'Healthcare',
            location: 'Suburbs',
            phone: '+1 (555) 789-0123',
            hours: 'Mon-Thu: 8AM-6PM, Fri: 8AM-4PM',
            image: 'https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=400&h=300&fit=crop&crop=center',
            rating: 4.9,
            distance: 1.8,
            fullContent: `
                <h2>Family Dentistry - Caring for Your Smile</h2>
                <p>Our family-friendly dental practice provides comprehensive oral healthcare for patients of all ages in a comfortable, modern environment.</p>
                
                <h3>Our Services</h3>
                <h4>General Dentistry</h4>
                <ul>
                    <li>Regular cleanings and checkups</li>
                    <li>Dental fillings and restorations</li>
                    <li>Root canal therapy</li>
                    <li>Tooth extractions</li>
                    <li>Gum disease treatment</li>
                </ul>
                
                <h4>Cosmetic Dentistry</h4>
                <ul>
                    <li>Teeth whitening</li>
                    <li>Porcelain veneers</li>
                    <li>Dental bonding</li>
                    <li>Invisalign clear aligners</li>
                    <li>Smile makeovers</li>
                </ul>
                
                <h4>Pediatric Care</h4>
                <ul>
                    <li>Children's dental exams</li>
                    <li>Fluoride treatments</li>
                    <li>Dental sealants</li>
                    <li>Orthodontic consultations</li>
                    <li>Emergency dental care</li>
                </ul>
                
                <h3>Our Technology</h3>
                <p>We use the latest dental technology including digital X-rays, intraoral cameras, and laser dentistry for more comfortable and efficient treatments.</p>
                
                <h3>Insurance & Payment</h3>
                <p>We accept most dental insurance plans and offer flexible payment options including CareCredit financing.</p>
                
                <h3>Contact Information</h3>
                <p><strong>Address:</strong> 147 Dental Plaza, Suburbs<br>
                <strong>Phone:</strong> +1 (555) 789-0123<br>
                <strong>Email:</strong> appointments@familydentistry.com<br>
                <strong>Website:</strong> www.familydentistry.com</p>
            `
        },
        {
            id: 'beauty-salon',
            name: 'Beauty Salon',
            description: 'Full-service beauty salon offering haircuts, coloring, styling, and spa treatments.',
            category: 'Beauty & Wellness',
            location: 'Shopping Areas',
            phone: '+1 (555) 890-1234',
            hours: 'Tue-Sat: 9AM-7PM, Sun: 10AM-5PM',
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&crop=center',
            rating: 4.6,
            distance: 1.3,
            fullContent: `
                <h2>Beauty Salon - Your Beauty Destination</h2>
                <p>Transform your look with our expert stylists and beauty professionals. We offer a full range of services to help you look and feel your best.</p>
                
                <h3>Hair Services</h3>
                <h4>Cutting & Styling</h4>
                <ul>
                    <li>Precision haircuts for all hair types</li>
                    <li>Blowouts and styling</li>
                    <li>Updos and special occasion styling</li>
                    <li>Bridal hair and makeup packages</li>
                </ul>
                
                <h4>Color Services</h4>
                <ul>
                    <li>Full color and highlights</li>
                    <li>Balayage and ombre techniques</li>
                    <li>Color correction</li>
                    <li>Gray coverage and root touch-ups</li>
                </ul>
                
                <h3>Spa Services</h3>
                <ul>
                    <li>Facial treatments and skincare</li>
                    <li>Eyebrow shaping and tinting</li>
                    <li>Eyelash extensions</li>
                    <li>Manicures and pedicures</li>
                    <li>Waxing services</li>
                </ul>
                
                <h3>Our Products</h3>
                <p>We carry premium hair care and beauty products from top brands. Our stylists can recommend the perfect products for your hair type and lifestyle.</p>
                
                <h3>Appointments</h3>
                <p>We recommend booking appointments in advance, especially for color services and special occasions. Walk-ins welcome for basic services.</p>
                
                <h3>Contact Information</h3>
                <p><strong>Address:</strong> 258 Beauty Lane, Shopping Areas<br>
                <strong>Phone:</strong> +1 (555) 890-1234<br>
                <strong>Email:</strong> book@beautysalon.com<br>
                <strong>Website:</strong> www.beautysalon.com</p>
            `
        },
       
       
    ];
}

// Function to get businesses by category
function getBusinessesByCategory(category) {
    const allBusinesses = getRegularBusinesses();
    return allBusinesses.filter(business => business.category === category);
}

// Function to get businesses by location
function getBusinessesByLocation(location) {
    const allBusinesses = getRegularBusinesses();
    return allBusinesses.filter(business => business.location === location);
}

// Function to search businesses
function searchBusinesses(searchTerm) {
    const allBusinesses = getRegularBusinesses();
    const term = searchTerm.toLowerCase();
    
    return allBusinesses.filter(business => 
        business.name.toLowerCase().includes(term) ||
        business.description.toLowerCase().includes(term) ||
        business.category.toLowerCase().includes(term) ||
        business.location.toLowerCase().includes(term)
    );
}

// Rating System Functions
let userRatings = JSON.parse(localStorage.getItem('businessRatings')) || {};

// Dynamic reviews system - no hardcoded data
// This will be populated from user ratings and can be extended with API calls
let businessReviews = JSON.parse(localStorage.getItem('businessReviews')) || {};

// Function to save ratings to localStorage
function saveRatings() {
    localStorage.setItem('businessRatings', JSON.stringify(userRatings));
}

// Function to save reviews to localStorage
function saveReviews() {
    localStorage.setItem('businessReviews', JSON.stringify(businessReviews));
}

// Function to get user rating for a business
function getUserRating(businessId) {
    return userRatings[businessId] || null;
}

// Function to submit a user rating
function submitRating(businessId, rating, review = '') {
    if (rating < 1 || rating > 5) {
        alert('Please select a rating between 1 and 5 stars.');
        return false;
    }
    
    const userId = generateUserId();
    const ratingData = {
        rating: rating,
        review: review,
        date: new Date().toISOString(),
        userId: userId
    };
    
    userRatings[businessId] = ratingData;
    saveRatings();
    
    // If there's a review text, also save it to the reviews system
    if (review && review.trim()) {
        addReviewToBusiness(businessId, {
            id: `user_review_${businessId}_${Date.now()}`,
            userId: userId,
            userName: 'You',
            rating: rating,
            review: review.trim(),
            date: ratingData.date,
            helpful: 0,
            isUserReview: true
        });
    }
    
    return true;
}

// Function to add a review to a business
function addReviewToBusiness(businessId, reviewData) {
    if (!businessReviews[businessId]) {
        businessReviews[businessId] = [];
    }
    
    // Check if user already has a review for this business
    const existingReviewIndex = businessReviews[businessId].findIndex(
        review => review.isUserReview && review.userId === reviewData.userId
    );
    
    if (existingReviewIndex >= 0) {
        // Update existing review
        businessReviews[businessId][existingReviewIndex] = reviewData;
    } else {
        // Add new review
        businessReviews[businessId].push(reviewData);
    }
    
    saveReviews();
}

// Function to generate a simple user ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Function to get average rating for a business (including user ratings)
function getAverageRating(businessId) {
    const business = getRegularBusinesses().find(b => b.id === businessId);
    if (!business) return 0;
    
    const reviews = getReviewsForBusiness(businessId);
    const baseRating = business.rating || 0;
    
    if (reviews.length === 0) {
        return baseRating;
    }
    
    // Calculate average from reviews
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const reviewAverage = totalRating / reviews.length;
    
    // If there are reviews, use review average; otherwise use base rating
    return reviews.length > 0 ? reviewAverage : baseRating;
}

// Function to get total number of ratings for a business
function getTotalRatings(businessId) {
    const reviews = getReviewsForBusiness(businessId);
    return reviews.length;
}

// Function to render star rating display
function renderStarRating(rating, containerId, interactive = false, businessId = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += `<i class="fas fa-star star-rating ${interactive ? 'interactive' : ''}" 
                        data-rating="${i + 1}" 
                        ${interactive && businessId ? `onclick="setRating(${businessId}, ${i + 1})"` : ''}></i>`;
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += `<i class="fas fa-star-half-alt star-rating ${interactive ? 'interactive' : ''}" 
                        data-rating="${fullStars + 1}" 
                        ${interactive && businessId ? `onclick="setRating(${businessId}, ${fullStars + 1})"` : ''}></i>`;
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += `<i class="far fa-star star-rating ${interactive ? 'interactive' : ''}" 
                        data-rating="${fullStars + (hasHalfStar ? 1 : 0) + i + 1}" 
                        ${interactive && businessId ? `onclick="setRating(${businessId}, ${fullStars + (hasHalfStar ? 1 : 0) + i + 1})"` : ''}></i>`;
    }
    
    container.innerHTML = starsHTML;
}

// Function to set rating (for interactive stars)
function setRating(businessId, rating) {
    const currentUserRating = getUserRating(businessId);
    if (currentUserRating) {
        if (confirm('You have already rated this business. Do you want to update your rating?')) {
            submitRating(businessId, rating);
            updateRatingDisplay(businessId);
            showRatingSuccess();
        }
    } else {
        submitRating(businessId, rating);
        updateRatingDisplay(businessId);
        showRatingSuccess();
    }
}

// Function to update rating display after rating submission
function updateRatingDisplay(businessId) {
    const averageRating = getAverageRating(businessId);
    const totalRatings = getTotalRatings(businessId);
    
    // Update rating in business cards
    const businessCards = document.querySelectorAll(`[data-business-id="${businessId}"]`);
    businessCards.forEach(card => {
        const ratingElement = card.querySelector('.business-rating');
        if (ratingElement) {
            ratingElement.innerHTML = `
                <div class="rating-stars">
                    ${renderStarsHTML(averageRating)}
                </div>
                <span class="rating-text">${averageRating.toFixed(1)} (${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'})</span>
            `;
        }
    });
    
    // Update rating in modal
    const modalRatingElement = document.getElementById('modalRating');
    if (modalRatingElement) {
        modalRatingElement.innerHTML = `
            <div class="rating-stars">
                ${renderStarsHTML(averageRating)}
            </div>
            <span class="rating-text">${averageRating.toFixed(1)} (${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'})</span>
        `;
    }
}

// Function to render stars HTML
function renderStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Function to show rating success message
function showRatingSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'rating-success-message';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Thank you for your rating!</span>
    `;
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 300);
    }, 3000);
}

// Function to open rating modal
function openRatingModal(businessId) {
    const business = getRegularBusinesses().find(b => b.id === businessId);
    if (!business) return;
    
    const currentUserRating = getUserRating(businessId);
    const averageRating = getAverageRating(businessId);
    const totalRatings = getTotalRatings(businessId);
    
    const modal = document.getElementById('ratingModal');
    const modalContent = document.getElementById('ratingModalContent');
    
    modalContent.innerHTML = `
        <div class="rating-modal-header">
            <h3>Rate ${business.name}</h3>
            <button class="rating-modal-close" onclick="closeRatingModal()">&times;</button>
        </div>
        <div class="rating-modal-body">
            <div class="current-rating">
                <div class="rating-stars large">
                    ${renderStarsHTML(averageRating)}
                </div>
                <div class="rating-info">
                    <span class="rating-score">${averageRating.toFixed(1)}</span>
                    <span class="rating-count">${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'}</span>
                </div>
            </div>
            
            <div class="user-rating-section">
                <h4>${currentUserRating ? 'Update Your Rating' : 'Rate This Business'}</h4>
                <div class="interactive-rating" id="interactiveRating">
                    ${renderInteractiveStars(businessId, currentUserRating?.rating || 0)}
                </div>
                <div class="rating-labels">
                    <span class="rating-label" data-rating="1">Poor</span>
                    <span class="rating-label" data-rating="2">Fair</span>
                    <span class="rating-label" data-rating="3">Good</span>
                    <span class="rating-label" data-rating="4">Very Good</span>
                    <span class="rating-label" data-rating="5">Excellent</span>
                </div>
            </div>
            
            <div class="review-section">
                <label for="ratingReview">Write a review (optional):</label>
                <textarea id="ratingReview" placeholder="Share your experience with this business..." rows="4">${currentUserRating?.review || ''}</textarea>
            </div>
            
            <div class="rating-actions">
                <button class="btn-secondary" onclick="closeRatingModal()">Cancel</button>
                <button class="btn-primary" onclick="submitRatingWithReview('${businessId}')">
                    ${currentUserRating ? 'Update Rating' : 'Submit Rating'}
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add hover effects to rating labels
    addRatingLabelHoverEffects();
}

// Function to render interactive stars
function renderInteractiveStars(businessId, currentRating = 0) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        const starClass = i <= currentRating ? 'fas fa-star' : 'far fa-star';
        starsHTML += `<i class="${starClass} interactive-star" data-rating="${i}" onclick="selectRating('${businessId}', ${i})"></i>`;
    }
    return starsHTML;
}

// Function to select rating
function selectRating(businessId, rating) {
    const stars = document.querySelectorAll('.interactive-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star interactive-star';
        } else {
            star.className = 'far fa-star interactive-star';
        }
    });
    
    // Update rating labels
    const labels = document.querySelectorAll('.rating-label');
    labels.forEach(label => {
        label.classList.remove('active');
        if (parseInt(label.dataset.rating) === rating) {
            label.classList.add('active');
        }
    });
    
    // Store selected rating
    window.selectedRating = rating;
}

// Function to add hover effects to rating labels
function addRatingLabelHoverEffects() {
    const stars = document.querySelectorAll('.interactive-star');
    const labels = document.querySelectorAll('.rating-label');
    
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            labels.forEach((label, labelIndex) => {
                if (labelIndex <= index) {
                    label.classList.add('hover');
                } else {
                    label.classList.remove('hover');
                }
            });
        });
    });
    
    document.querySelector('.interactive-rating').addEventListener('mouseleave', () => {
        labels.forEach(label => label.classList.remove('hover'));
    });
}

// Function to submit rating with review
function submitRatingWithReview(businessId) {
    const rating = window.selectedRating || 0;
    const review = document.getElementById('ratingReview').value.trim();
    
    if (rating === 0) {
        alert('Please select a rating before submitting.');
        return;
    }
    
    if (submitRating(businessId, rating, review)) {
        closeRatingModal();
        updateRatingDisplay(businessId);
        showRatingSuccess();
        
        // Refresh reviews in business modal if it's open
        if (window.localBusinessManager) {
            window.localBusinessManager.loadBusinessReviews(businessId);
        }
    }
}

// Function to close rating modal
function closeRatingModal() {
    const modal = document.getElementById('ratingModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    window.selectedRating = 0;
}

// Function to mark a review as helpful
function markReviewHelpful(reviewId) {
    // Get current business ID
    const businessId = window.localBusinessManager?.getCurrentBusinessId();
    if (!businessId) return;
    
    // Get reviews for this business
    const allReviews = JSON.parse(localStorage.getItem('businessReviews') || '{}');
    const businessReviews = allReviews[businessId] || [];
    
    // Find and update the review
    const reviewIndex = businessReviews.findIndex(review => review.id === reviewId);
    if (reviewIndex !== -1) {
        businessReviews[reviewIndex].helpfulCount = (businessReviews[reviewIndex].helpfulCount || 0) + 1;
        
        // Save back to localStorage
        allReviews[businessId] = businessReviews;
        localStorage.setItem('businessReviews', JSON.stringify(allReviews));
        
        // Refresh the reviews display
        window.localBusinessManager?.loadBusinessReviews(businessId);
    }
}

// Function to report a review
function reportReview(reviewId) {
    if (confirm('Are you sure you want to report this review? This action cannot be undone.')) {
        // In a real application, this would send a report to the server
        alert('Review reported. Thank you for helping us maintain quality content.');
    }
}

// Reviews System Functions
function getReviewsForBusiness(businessId) {
    // Get reviews from the dynamic reviews system
    const reviews = businessReviews[businessId] || [];
    
    // Sort reviews by date (newest first) by default
    return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Function to format date for display
function formatReviewDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// Function to render reviews section
function renderReviewsSection(businessId) {
    const reviews = getReviewsForBusiness(businessId);
    const stats = getReviewStatistics(businessId);
    const averageRating = getAverageRating(businessId);
    const totalRatings = stats.totalReviews;
    
    if (reviews.length === 0) {
        return `
            <div class="reviews-section">
                <div class="reviews-header">
                    <h3>Customer Reviews</h3>
                    <div class="reviews-summary">
                        <div class="rating-stars large">
                            ${renderStarsHTML(averageRating)}
                        </div>
                        <div class="rating-info">
                            <span class="rating-score">${averageRating.toFixed(1)}</span>
                            <span class="rating-count">${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'}</span>
                        </div>
                    </div>
                </div>
                <div class="no-reviews">
                    <i class="fas fa-comment-slash"></i>
                    <p>No reviews yet. Be the first to share your experience!</p>
                </div>
            </div>
        `;
    }
    
    // Use rating distribution from statistics
    const ratingDistribution = stats.ratingDistribution;
    
    const reviewsHTML = reviews.map(review => `
        <div class="review-card ${review.isUserReview ? 'user-review' : ''}">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="reviewer-details">
                        <h4 class="reviewer-name">${review.userName}</h4>
                        <div class="review-rating">
                            <div class="rating-stars">
                                ${renderStarsHTML(review.rating)}
                            </div>
                            <span class="review-date">${formatReviewDate(review.date)}</span>
                        </div>
                    </div>
                </div>
                ${review.isUserReview ? '<span class="your-review-badge">Your Review</span>' : ''}
            </div>
            <div class="review-content">
                <p>${review.review}</p>
            </div>
            <div class="review-actions">
                <button class="helpful-btn" onclick="markReviewHelpful('${review.id}')">
                    <i class="fas fa-thumbs-up"></i>
                    <span>Helpful (${review.helpful})</span>
                </button>
                ${!review.isUserReview ? `
                    <button class="report-btn" onclick="reportReview('${review.id}')">
                        <i class="fas fa-flag"></i>
                        <span>Report</span>
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    return `
        <div class="reviews-section">
            <div class="reviews-header">
                <h3>Customer Reviews</h3>
                <div class="reviews-summary">
                    <div class="rating-stats">
                        <div class="rating-score-large">${averageRating.toFixed(1)}</div>
                        <div class="rating-stars large">
                            ${renderStarsHTML(averageRating)}
                        </div>
                        <div class="rating-count">${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'}</div>
                    </div>
                    <div class="rating-breakdown">
                        ${ratingDistribution.map((count, index) => {
                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                            const stars = 5 - index;
                            return `
                                <div class="rating-bar">
                                    <span class="star-label">${stars} star${stars > 1 ? 's' : ''}</span>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${percentage}%"></div>
                                    </div>
                                    <span class="count">${count}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
            
            <div class="reviews-filters">
                <div class="filter-group">
                    <label>Sort by:</label>
                    <select id="reviewSort" onchange="sortReviews('${businessId}')">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                        <option value="most_helpful">Most Helpful</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>Filter by rating:</label>
                    <select id="reviewFilter" onchange="filterReviews('${businessId}')">
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>
            
            <div class="reviews-list" id="reviewsList">
                ${reviewsHTML}
            </div>
        </div>
    `;
}

// Function to sort reviews
function sortReviews(businessId) {
    const sortBy = document.getElementById('reviewSort').value;
    const reviews = getReviewsForBusiness(businessId);
    
    let sortedReviews = [...reviews];
    
    switch(sortBy) {
        case 'newest':
            sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            sortedReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'highest':
            sortedReviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'lowest':
            sortedReviews.sort((a, b) => a.rating - b.rating);
            break;
        case 'most_helpful':
            sortedReviews.sort((a, b) => b.helpful - a.helpful);
            break;
    }
    
    renderReviewsList(sortedReviews);
}

// Function to filter reviews
function filterReviews(businessId) {
    const filterBy = document.getElementById('reviewFilter').value;
    const reviews = getReviewsForBusiness(businessId);
    
    let filteredReviews = reviews;
    if (filterBy !== 'all') {
        filteredReviews = reviews.filter(review => review.rating === parseInt(filterBy));
    }
    
    renderReviewsList(filteredReviews);
}

// Function to render reviews list
function renderReviewsList(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="no-reviews-filtered">
                <i class="fas fa-search"></i>
                <p>No reviews match your current filter.</p>
            </div>
        `;
        return;
    }
    
    const reviewsHTML = reviews.map(review => `
        <div class="review-card ${review.isUserReview ? 'user-review' : ''}">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="reviewer-details">
                        <h4 class="reviewer-name">${review.userName}</h4>
                        <div class="review-rating">
                            <div class="rating-stars">
                                ${renderStarsHTML(review.rating)}
                            </div>
                            <span class="review-date">${formatReviewDate(review.date)}</span>
                        </div>
                    </div>
                </div>
                ${review.isUserReview ? '<span class="your-review-badge">Your Review</span>' : ''}
            </div>
            <div class="review-content">
                <p>${review.review}</p>
            </div>
            <div class="review-actions">
                <button class="helpful-btn" onclick="markReviewHelpful('${review.id}')">
                    <i class="fas fa-thumbs-up"></i>
                    <span>Helpful (${review.helpful})</span>
                </button>
                ${!review.isUserReview ? `
                    <button class="report-btn" onclick="reportReview('${review.id}')">
                        <i class="fas fa-flag"></i>
                        <span>Report</span>
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    reviewsList.innerHTML = reviewsHTML;
}

// Function to mark review as helpful
function markReviewHelpful(reviewId) {
    // Find the review and increment helpful count
    for (const businessId in businessReviews) {
        const reviewIndex = businessReviews[businessId].findIndex(review => review.id === reviewId);
        if (reviewIndex >= 0) {
            businessReviews[businessId][reviewIndex].helpful = (businessReviews[businessId][reviewIndex].helpful || 0) + 1;
            saveReviews();
            showRatingSuccess();
            return;
        }
    }
    
    // If not found, show success message anyway
    showRatingSuccess();
}

// Function to report a review
function reportReview(reviewId) {
    if (confirm('Are you sure you want to report this review? It will be reviewed by our moderation team.')) {
        // In a real application, this would send a request to the server
        // For now, we'll just show a confirmation message
        alert('Thank you for reporting this review. Our team will review it shortly.');
    }
}

// Function to add a public review (for future API integration)
function addPublicReview(businessId, reviewData) {
    if (!businessReviews[businessId]) {
        businessReviews[businessId] = [];
    }
    
    const review = {
        id: `review_${businessId}_${Date.now()}`,
        userId: reviewData.userId || generateUserId(),
        userName: reviewData.userName || 'Anonymous',
        rating: reviewData.rating,
        review: reviewData.review,
        date: new Date().toISOString(),
        helpful: 0,
        isUserReview: false
    };
    
    businessReviews[businessId].push(review);
    saveReviews();
    
    return review;
}

// Function to get review statistics for a business
function getReviewStatistics(businessId) {
    const reviews = getReviewsForBusiness(businessId);
    const totalReviews = reviews.length;
    
    if (totalReviews === 0) {
        return {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: [0, 0, 0, 0, 0]
        };
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;
    
    const ratingDistribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
        ratingDistribution[review.rating - 1]++;
    });
    
    return {
        totalReviews,
        averageRating,
        ratingDistribution
    };
}

// Main Local Business Page Functionality
class LocalBusinessManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        this.currentSort = 'name';
        this.currentSearch = '';
        this.businesses = [];
        this.filteredBusinesses = [];
        
        this.init();
    }
    
    init() {
        this.loadBusinesses();
        this.setupEventListeners();
        this.renderBusinesses();
        this.updatePagination();
        this.checkUrlParams();
    }
    
    loadBusinesses() {
        this.businesses = getRegularBusinesses();
        this.applyFilters();
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('businessSearchInput');
        const searchBtn = document.getElementById('businessSearchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
                this.renderBusinesses();
                this.updatePagination();
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.currentPage = 1;
                this.applyFilters();
                this.renderBusinesses();
                this.updatePagination();
            });
        }
        
        // Filter functionality
        const categoryFilter = document.getElementById('categoryFilter');
        const locationFilter = document.getElementById('locationFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
                this.renderBusinesses();
                this.updatePagination();
            });
        }
        
        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
                this.renderBusinesses();
                this.updatePagination();
            });
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
                this.renderBusinesses();
                this.updatePagination();
            });
        }
        
        
        // Pagination
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderBusinesses();
                    this.updatePagination();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredBusinesses.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderBusinesses();
                    this.updatePagination();
                }
            });
        }
        
        // Modal functionality
        this.setupModalEventListeners();
    }
    
    setupModalEventListeners() {
        // Business modal
        const businessModal = document.getElementById('businessModal');
        const businessModalClose = document.getElementById('businessModalClose');
        
        if (businessModalClose) {
            businessModalClose.addEventListener('click', () => {
                this.closeBusinessModal();
            });
        }
        
        if (businessModal) {
            businessModal.addEventListener('click', (e) => {
                if (e.target === businessModal) {
                    this.closeBusinessModal();
                }
            });
        }
        
        // Gallery modal
        const galleryModal = document.getElementById('galleryModal');
        const galleryModalClose = document.getElementById('galleryModalClose');
        
        if (galleryModalClose) {
            galleryModalClose.addEventListener('click', () => {
                this.closeGalleryModal();
            });
        }
        
        if (galleryModal) {
            galleryModal.addEventListener('click', (e) => {
                if (e.target === galleryModal) {
                    this.closeGalleryModal();
                }
            });
        }
        
        // Rating modal
        const ratingModal = document.getElementById('ratingModal');
        
        if (ratingModal) {
            ratingModal.addEventListener('click', (e) => {
                if (e.target === ratingModal) {
                    this.closeRatingModal();
                }
            });
        }
    }
    
    applyFilters() {
        let filtered = [...this.businesses];
        
        // Search filter
        if (this.currentSearch) {
            const searchTerm = this.currentSearch.toLowerCase();
            filtered = filtered.filter(business => 
                business.name.toLowerCase().includes(searchTerm) ||
                business.description.toLowerCase().includes(searchTerm) ||
                business.category.toLowerCase().includes(searchTerm) ||
                business.location.toLowerCase().includes(searchTerm)
            );
        }
        
        // Category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(business => 
                business.category.toLowerCase() === this.currentCategory
            );
        }
        
        // Location filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(business => 
                business.location.toLowerCase().includes(this.currentFilter.toLowerCase())
            );
        }
        
        // Sort
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'rating':
                    return b.rating - a.rating;
                case 'distance':
                    return a.distance - b.distance;
                default:
                    return 0;
            }
        });
        
        this.filteredBusinesses = filtered;
    }
    
    renderBusinesses() {
        const businessGrid = document.getElementById('businessGrid');
        if (!businessGrid) return;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const businessesToShow = this.filteredBusinesses.slice(startIndex, endIndex);
        
        if (businessesToShow.length === 0) {
            businessGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No businesses found</h3>
                    <p>Try adjusting your search criteria or filters.</p>
                </div>
            `;
            return;
        }
        
        businessGrid.innerHTML = businessesToShow.map(business => `
            <div class="business-card" data-business-id="${business.id}" onclick="localBusinessManager.openBusinessModal('${business.id}')">
                <img src="${business.image}" alt="${business.name}" class="business-card-image" loading="lazy">
                <div class="business-card-content">
                    <div class="business-card-category">${business.category}</div>
                    <h3 class="business-card-title">${business.name}</h3>
                    <p class="business-card-description">${business.description}</p>
                    <div class="business-card-meta">
                        <div class="business-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${business.location}</span>
                        </div>
                        <div class="business-meta-item">
                            <i class="fas fa-phone"></i>
                            <span>${business.phone}</span>
                        </div>
                        <div class="business-meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${business.hours}</span>
                        </div>
                    </div>
                    <div class="business-card-footer">
                        <div class="business-rating">
                            <div class="business-stars">
                                ${this.renderStarsHTML(business.rating)}
                            </div>
                            <span class="business-rating-text">${business.rating}</span>
                        </div>
                        <button class="business-view-btn" onclick="event.stopPropagation(); localBusinessManager.openBusinessModal('${business.id}')">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.filteredBusinesses.length / this.itemsPerPage);
        const pagesContainer = document.getElementById('pages');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const paginationInfo = document.getElementById('paginationInfo');
        
        if (pagesContainer) {
            let pagesHTML = '';
            const maxVisiblePages = 5;
            let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pagesHTML += `
                    <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                            onclick="localBusinessManager.goToPage(${i})">
                        ${i}
                    </button>
                `;
            }
            
            pagesContainer.innerHTML = pagesHTML;
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }
        
        if (paginationInfo) {
            const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredBusinesses.length);
            paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${this.filteredBusinesses.length} businesses`;
        }
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.renderBusinesses();
        this.updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    openBusinessModal(businessId) {
        const business = this.businesses.find(b => b.id === businessId);
        if (!business) return;
        
        const modal = document.getElementById('businessModal');
        const modalCategory = document.getElementById('modalCategory');
        const modalTitle = document.getElementById('modalTitle');
        const modalLocation = document.getElementById('modalLocationText');
        const modalPhone = document.getElementById('modalPhoneText');
        const modalHours = document.getElementById('modalHoursText');
        const modalContent = document.getElementById('modalContent');
        const socialButtons = document.getElementById('socialButtons');
        
        if (modalCategory) modalCategory.textContent = business.category;
        if (modalTitle) modalTitle.textContent = business.name;
        if (modalLocation) modalLocation.textContent = business.location;
        if (modalPhone) modalPhone.textContent = business.phone;
        if (modalHours) modalHours.textContent = business.hours;
        if (modalContent) modalContent.innerHTML = business.fullContent || business.description;
        
        // Social buttons
        if (socialButtons) {
            let socialHTML = '';
            if (business.whatsapp) {
                socialHTML += `
                    <a href="https://wa.me/${business.whatsapp}" class="social-btn" target="_blank">
                        <i class="fab fa-whatsapp"></i>
                        WhatsApp
                    </a>
                `;
            }
            if (business.instagram) {
                socialHTML += `
                    <a href="https://instagram.com/${business.instagram.replace('@', '')}" class="social-btn" target="_blank">
                        <i class="fab fa-instagram"></i>
                        Instagram
                    </a>
                `;
            }
            if (business.tiktok) {
                socialHTML += `
                    <a href="https://tiktok.com/@${business.tiktok.replace('@', '')}" class="social-btn" target="_blank">
                        <i class="fab fa-tiktok"></i>
                        TikTok
                    </a>
                `;
            }
            // Add rating button
            socialHTML += `
                <button class="social-btn" onclick="openRatingModal('${business.id}')">
                    <i class="fas fa-star"></i>
                    Rate Business
                </button>
            `;
            socialButtons.innerHTML = socialHTML;
        }
        
        // Load and display reviews
        this.loadBusinessReviews(business.id);
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    closeBusinessModal() {
        const modal = document.getElementById('businessModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    openGalleryModal(galleryName) {
        const business = this.businesses.find(b => b.serviceGalleries && b.serviceGalleries[galleryName]);
        if (!business || !business.serviceGalleries[galleryName]) return;
        
        const modal = document.getElementById('galleryModal');
        const modalTitle = document.getElementById('galleryModalTitle');
        const modalImage = document.getElementById('galleryModalImage');
        const modalCounter = document.getElementById('galleryCounter');
        
        if (modalTitle) modalTitle.textContent = galleryName;
        
        const gallery = business.serviceGalleries[galleryName];
        this.currentGallery = gallery;
        this.currentGalleryIndex = 0;
        
        this.updateGalleryImage();
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    updateGalleryImage() {
        if (!this.currentGallery || this.currentGalleryIndex === undefined) return;
        
        const modalImage = document.getElementById('galleryModalImage');
        const modalCounter = document.getElementById('galleryCounter');
        const prevBtn = document.getElementById('galleryPrevBtn');
        const nextBtn = document.getElementById('galleryNextBtn');
        
        const currentImage = this.currentGallery[this.currentGalleryIndex];
        
        if (modalImage) {
            modalImage.src = currentImage.image;
            modalImage.alt = currentImage.title || '';
        }
        
        if (modalCounter) {
            modalCounter.textContent = `${this.currentGalleryIndex + 1} / ${this.currentGallery.length}`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.currentGalleryIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentGalleryIndex === this.currentGallery.length - 1;
        }
    }
    
    previousGalleryImage() {
        if (this.currentGalleryIndex > 0) {
            this.currentGalleryIndex--;
            this.updateGalleryImage();
        }
    }
    
    nextGalleryImage() {
        if (this.currentGalleryIndex < this.currentGallery.length - 1) {
            this.currentGalleryIndex++;
            this.updateGalleryImage();
        }
    }
    
    closeGalleryModal() {
        const modal = document.getElementById('galleryModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    closeRatingModal() {
        const modal = document.getElementById('ratingModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    loadBusinessReviews(businessId) {
        const reviews = this.getBusinessReviews(businessId);
        const reviewsSection = document.getElementById('businessReviewsSection');
        const reviewsCount = document.getElementById('reviewsCount');
        const overallRating = document.getElementById('overallRating');
        const overallStars = document.getElementById('overallStars');
        const ratingBreakdown = document.getElementById('ratingBreakdown');
        const reviewsList = document.getElementById('reviewsList');
        
        if (!reviewsSection) return;
        
        // Update reviews count
        reviewsCount.textContent = `${reviews.length} review${reviews.length !== 1 ? 's' : ''}`;
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-comment-slash"></i>
                    <p>No reviews yet. Be the first to review this business!</p>
                </div>
            `;
            overallRating.textContent = '0.0';
            overallStars.innerHTML = '<i class="far fa-star"></i>'.repeat(5);
            ratingBreakdown.innerHTML = '';
            return;
        }
        
        // Calculate overall rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / reviews.length).toFixed(1);
        
        // Update overall rating display
        overallRating.textContent = averageRating;
        overallStars.innerHTML = renderStarsHTML(parseFloat(averageRating));
        
        // Generate rating breakdown
        const ratingCounts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
        reviews.forEach(review => ratingCounts[review.rating]++);
        
        ratingBreakdown.innerHTML = Object.keys(ratingCounts).reverse().map(rating => {
            const count = ratingCounts[rating];
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return `
                <div class="rating-bar">
                    <span class="star-label">${rating} star${rating !== '1' ? 's' : ''}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="count">${count}</span>
                </div>
            `;
        }).join('');
        
        // Render reviews
        this.renderReviewsList(reviews);
    }
    
    getBusinessReviews(businessId) {
        const allReviews = JSON.parse(localStorage.getItem('businessReviews') || '{}');
        return allReviews[businessId] || [];
    }
    
    renderReviewsList(reviews) {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-comment-slash"></i>
                    <p>No reviews match your current filter.</p>
                </div>
            `;
            return;
        }
        
        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-card ${review.isCurrentUser ? 'user-review' : ''}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${review.userName.charAt(0).toUpperCase()}</div>
                        <div class="reviewer-details">
                            <h4>${review.userName}</h4>
                            <div class="review-rating">
                                <div class="rating-stars">${renderStarsHTML(review.rating)}</div>
                            </div>
                        </div>
                    </div>
                    <div class="review-meta">
                        <div class="review-date">${formatReviewDate(review.date)}</div>
                        ${review.isCurrentUser ? '<div class="your-review-badge">Your Review</div>' : ''}
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.review || 'No review text provided.'}</p>
                </div>
                <div class="review-actions">
                    <button class="helpful-btn" onclick="markReviewHelpful('${review.id}')">
                        <i class="fas fa-thumbs-up"></i>
                        Helpful (${review.helpfulCount || 0})
                    </button>
                    ${!review.isCurrentUser ? `
                        <button class="report-btn" onclick="reportReview('${review.id}')">
                            <i class="fas fa-flag"></i>
                            Report
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
    
    filterReviews() {
        const businessId = this.getCurrentBusinessId();
        if (!businessId) return;
        
        const reviews = this.getBusinessReviews(businessId);
        const sortBy = document.getElementById('reviewSort')?.value || 'newest';
        const filterBy = document.getElementById('reviewFilter')?.value || 'all';
        
        // Filter by rating
        let filteredReviews = reviews;
        if (filterBy !== 'all') {
            filteredReviews = reviews.filter(review => review.rating === parseInt(filterBy));
        }
        
        // Sort reviews
        filteredReviews.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'highest':
                    return b.rating - a.rating;
                case 'lowest':
                    return a.rating - b.rating;
                case 'helpful':
                    return (b.helpfulCount || 0) - (a.helpfulCount || 0);
                default:
                    return 0;
            }
        });
        
        this.renderReviewsList(filteredReviews);
    }
    
    getCurrentBusinessId() {
        // Get the current business ID from the modal
        const modal = document.getElementById('businessModal');
        if (modal && modal.style.display === 'block') {
            const businessName = document.getElementById('modalTitle')?.textContent;
            if (businessName) {
                const business = this.businesses.find(b => b.name === businessName);
                return business?.id;
            }
        }
        return null;
    }
    
    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const businessId = urlParams.get('business');
        const openModal = urlParams.get('openModal');
        
        if (businessId && openModal === 'true') {
            setTimeout(() => {
                this.openBusinessModal(businessId);
            }, 500);
        }
    }
}

// Global functions for HTML onclick events
function openGalleryModal(galleryName) {
    if (window.localBusinessManager) {
        window.localBusinessManager.openGalleryModal(galleryName);
    }
}

function previousGalleryImage() {
    if (window.localBusinessManager) {
        window.localBusinessManager.previousGalleryImage();
    }
}

function nextGalleryImage() {
    if (window.localBusinessManager) {
        window.localBusinessManager.nextGalleryImage();
    }
}

// Initialize the local business manager when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.localBusinessManager = new LocalBusinessManager();
});

// Functions are available globally for use in local-business.html
