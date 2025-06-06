document.addEventListener('DOMContentLoaded', function() {
    // --- DYNAMIC SLIDESHOW IMAGE GENERATOR ---
    // This part automatically builds the list of images for the slideshow.
    // It's designed to be easily updated.

    const portfolioDataForSlideshow = [
        { prefix: 'tshirt',  count: 8 },
        { prefix: 'hoodie',  count: 8 },
        { prefix: 'hat',     count: 6 }, // Special rule: Hats only have 6 images
        { prefix: 'mug',     count: 8 },
        { prefix: 'tumbler', count: 8 },
        { prefix: 'tote',    count: 8 }
    ];

    const slideshowImages = [];
    const basePath = 'images/portfolio/';

    portfolioDataForSlideshow.forEach(category => {
        for (let i = 1; i <= category.count; i++) {
            // Assumes all portfolio images are .jpg. Change if necessary.
            const filename = `${category.prefix}-${i}.jpg`;
            slideshowImages.push(basePath + filename);
        }
    });

    // --- SLIDESHOW CORE LOGIC (No changes needed below this line) ---

    const FADE_DURATION = 1200; // in milliseconds (matches CSS)
    const SLIDE_INTERVAL = 5000; // Time each slide is shown
    const slideshowContainer = document.getElementById('nrprint-home-slideshow-container');

    if (!slideshowContainer || slideshowImages.length === 0) {
        console.error("Slideshow container not found or no images to display.");
        if (slideshowContainer) {
            // Optional: Set a fallback background if no images are found
            slideshowContainer.style.backgroundColor = "#ECCA9C"; 
        }
        return;
    }

    // Preload images for smoother transitions
    slideshowImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Create image elements and append to the container
    slideshowImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `NRPrint Slideshow Image ${index + 1}`;
        img.className = 'nrprint-home-slide-image';
        if (index === 0) {
            img.classList.add('active'); // Start with the first image visible
        }
        slideshowContainer.appendChild(img);
    });

    const slides = slideshowContainer.querySelectorAll('.nrprint-home-slide-image');
    let currentSlide = 0;

    function nextSlide() {
        // Remove 'active' from the current slide
        slides[currentSlide].classList.remove('active');

        // Increment slide index, looping back to 0 if at the end
        currentSlide = (currentSlide + 1) % slides.length;

        // Add 'active' to the new current slide to fade it in
        slides[currentSlide].classList.add('active');
    }

    // Start the slideshow
    setInterval(nextSlide, SLIDE_INTERVAL);

    // --- DYNAMIC YEAR LOGIC ---
    const currentYearSpan = document.getElementById('currentYear');
    const nextYearSpan = document.getElementById('nextYear');
    if (currentYearSpan) {
        const currentYear = new Date().getFullYear();
        currentYearSpan.textContent = currentYear;
        if(nextYearSpan) {
            nextYearSpan.textContent = currentYear + 1;
        }
    }
});