document.addEventListener('DOMContentLoaded', function () {

    // ==================================================
    // === NAVIGATION TOGGLE LOGIC (MAKES BURGER WORK) ===
    // ==================================================
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            // Toggle classes to show/hide menu and animate the button
            this.classList.toggle('is-active');
            mainNav.classList.toggle('nav-open');
            
            // Prevent body from scrolling when menu is open
            body.classList.toggle('no-scroll');
        });
    }

    // ==================================================
    // === PORTFOLIO FILTERING LOGIC (No changes here) ===
    // ==================================================
    const portfolioFiltersContainer = document.querySelector('.portfolio-filters');
    const portfolioGrid = document.querySelector('.portfolio-grid');

    if (portfolioFiltersContainer && portfolioGrid) {
        const isMobile = window.innerWidth <= 768;
        const limitPerCategoryInAllView = isMobile ? 1 : 2; 

        const portfolioData = [
            { name: 'T-shirts', filter: 'tshirts', count: 8, filePrefix: 'tshirt', altText: 'Portfolio T-shirt example' },
            { name: 'Hoodies', filter: 'hoodies', count: 8, filePrefix: 'hoodie', altText: 'Portfolio Hoodie example' },
            { name: 'Hats', filter: 'hats', count: 6, filePrefix: 'hat', altText: 'Portfolio Hat example' },
            { name: 'Mugs', filter: 'mugs', count: 8, filePrefix: 'mug', altText: 'Portfolio Mug example' },
            { name: 'Tumblers', filter: 'tumblers', count: 8, filePrefix: 'tumbler', altText: 'Portfolio Tumbler example' },
            { name: 'Tote Bags', filter: 'totes', count: 8, filePrefix: 'tote', altText: 'Portfolio Tote Bag example' }
        ];

        let filterButtonsHTML = '<button class="filter-btn active" data-filter="all">All</button>';
        portfolioData.forEach(category => {
            filterButtonsHTML += `<button class="filter-btn" data-filter="${category.filter}">${category.name}</button>`;
        });
        portfolioFiltersContainer.innerHTML = filterButtonsHTML;

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

        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                filterPortfolio(filterValue);
            });
        });
        
        filterPortfolio('all');
    }
});