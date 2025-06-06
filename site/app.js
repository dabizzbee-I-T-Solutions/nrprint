document.addEventListener('DOMContentLoaded', function () {

    // --- CONFIGURATION ---
    const isMobile = window.innerWidth <= 768; // Check if we are on a mobile-sized screen
    const limitPerCategoryInAllView = isMobile ? 1 : 2; // Show 1 item on mobile, 2 on desktop

    // --- DATA ---
    const portfolioData = [
        { name: 'T-shirts', filter: 'tshirts', count: 8, filePrefix: 'tshirt', altText: 'Portfolio T-shirt example' },
        { name: 'Hoodies', filter: 'hoodies', count: 8, filePrefix: 'hoodie', altText: 'Portfolio Hoodie example' },
        { name: 'Hats', filter: 'hats', count: 8, filePrefix: 'hat', altText: 'Portfolio Hat example' },
        { name: 'Mugs', filter: 'mugs', count: 8, filePrefix: 'mug', altText: 'Portfolio Mug example' },
        { name: 'Tumblers', filter: 'tumblers', count: 8, filePrefix: 'tumbler', altText: 'Portfolio Tumbler example' },
        { name: 'Tote Bags', filter: 'totes', count: 8, filePrefix: 'tote', altText: 'Portfolio Tote Bag example' }
    ];

    // --- GET DOM ELEMENTS ---
    const portfolioFiltersContainer = document.querySelector('.portfolio-filters');
    const portfolioGrid = document.querySelector('.portfolio-grid');

    // --- GENERATE HTML ---

    // 1. Generate Filter Buttons
    let filterButtonsHTML = '<button class="filter-btn active" data-filter="all">All</button>';
    portfolioData.forEach(category => {
        filterButtonsHTML += `<button class="filter-btn" data-filter="${category.filter}">${category.name}</button>`;
    });
    portfolioFiltersContainer.innerHTML = filterButtonsHTML;

    // 2. Generate Portfolio Grid Items
    let portfolioGridHTML = '';
    portfolioData.forEach(category => {
        for (let i = 1; i <= category.count; i++) {
            const imagePath = `images/portfolio/${category.filePrefix}-${i}.jpg`;
            portfolioGridHTML += `
                <a href="${imagePath}" class="portfolio-item" data-category="${category.filter}">
                    <img src="${imagePath}" alt="${category.altText} ${i}">
                </a>
            `;
        }
    });
    portfolioGrid.innerHTML = portfolioGridHTML;

    // --- PORTFOLIO FILTERING LOGIC ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    function filterPortfolio(filterValue) {
        if (filterValue === 'all') {
            const categoryCounters = {};
            portfolioItems.forEach(item => {
                const category = item.dataset.category;
                if (categoryCounters[category] === undefined) {
                    categoryCounters[category] = 0;
                }
                if (categoryCounters[category] < limitPerCategoryInAllView) {
                    item.style.display = 'block';
                    categoryCounters[category]++;
                } else {
                    item.style.display = 'none';
                }
            });
        } else {
            portfolioItems.forEach(item => {
                if (item.dataset.category === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    }

    // Add click event listeners to the buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            filterPortfolio(filterValue);
        });
    });

    // --- INITIAL PAGE LOAD ---
    filterPortfolio('all');
});