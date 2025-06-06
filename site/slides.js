document.addEventListener('DOMContentLoaded', () => { // Wait for the DOM to be fully loaded

    // ----- NRPRINT HOME SLIDESHOW SCRIPT -----
    const slideshowContainer = document.getElementById('nrprint-home-slideshow-container');
    // IMPORTANT: Make sure this path is correct relative to your index.html
    const imagesPath = 'images/nrprint-home-slideshow/';
    const slideshowImages = [
        // REPLACE THESE WITH YOUR ACTUAL IMAGE FILENAMES
        // The images should be inside the 'images/hero-slideshow/' folder
        'slide1.jpg',
        'slide2.png',
        'product-memory1.jpg',
        'product-memory2.jpg',
        'tshirt-sample1.jpg', // You can use images from other folders if you adjust the path
        'mug-sample1.jpg'
        // Add more image filenames as needed
    ];
    const FADE_DURATION = 1200; // ms - Should match CSS transition-duration
    const DISPLAY_DURATION = 4000; // ms
    let currentImageIndex = 0;
    let imageElements = []; // To store the created image DOM elements

    function createSlideshowImages() {
        if (!slideshowContainer || slideshowImages.length === 0) {
            console.warn("Slideshow container not found or no images specified.");
            return;
        }
        slideshowContainer.innerHTML = ''; // Clear any existing content
        imageElements = []; // Reset the array

        slideshowImages.forEach((filename, index) => {
            const img = document.createElement('img');
            img.src = imagesPath + filename;
            img.alt = "NRPrint Product Showcase " + (index + 1);
            img.classList.add('nrprint-home-slide-image');
            // Make the first image active initially so it's visible on load
            if (index === 0) {
                img.classList.add('active');
            }
            slideshowContainer.appendChild(img);
            imageElements.push(img); // Add the created img element to our array
        });
    }

    function showNextSlide() {
        if (imageElements.length === 0) return; // No images to cycle

        // Remove 'active' class from the currently active image
        const currentActiveImage = slideshowContainer.querySelector('.nrprint-home-slide-image.active');
        if (currentActiveImage) {
            currentActiveImage.classList.remove('active');
        }

        // Update index to the next image, looping back to 0 if at the end
        currentImageIndex = (currentImageIndex + 1) % imageElements.length;

        // Add 'active' class to the new current image
        if (imageElements[currentImageIndex]) {
            imageElements[currentImageIndex].classList.add('active');
        }
    }

    // Initialize and start the slideshow
    if (slideshowContainer && slideshowImages.length > 0) {
        createSlideshowImages(); // Create image elements
        if (imageElements.length > 1) { // Only set interval if there's more than one image
            setInterval(showNextSlide, DISPLAY_DURATION + FADE_DURATION);
        } else if (imageElements.length === 1) {
            // If only one image, it's already set to active by createSlideshowImages
            console.log("Only one image in slideshow, no transitions will occur.");
        }
    } else if (slideshowImages.length === 0 && slideshowContainer) {
        console.warn("No images specified for the hero slideshow.");
        // Optionally, hide the slideshow container or display a default message/image
        // slideshowContainer.style.display = 'none';
    }

    // ----- Update copyright year and next year for accomplishments note -----
    const currentYear = new Date().getFullYear();
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = currentYear;
    }
    const nextYearElement = document.getElementById('nextYear');
    if (nextYearElement) {
        nextYearElement.textContent = currentYear + 1;
    }

    // ----- Accordion JavaScript -----
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    accordionHeaders.forEach(header => {
        header.addEventListener("click", function() {
            const currentlyActive = document.querySelector(".accordion-header.active");
            if (currentlyActive && currentlyActive !== this) {
                currentlyActive.classList.remove("active");
                const prevIcon = currentlyActive.querySelector(".accordion-icon");
                if (prevIcon) prevIcon.textContent = "+";
                currentlyActive.nextElementSibling.style.maxHeight = null;
            }

            this.classList.toggle("active");
            const icon = this.querySelector(".accordion-icon");
            if (icon) {
                icon.textContent = this.classList.contains("active") ? "−" : "+";
            }

            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // ----- Navigation Toggle JavaScript -----
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('nav-open');
            navToggle.classList.toggle('is-active');
            document.body.classList.toggle('no-scroll'); // Prevents scrolling when nav is open
        });

        // Close mobile menu when a link is clicked
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('nav-open')) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    mainNav.classList.remove('nav-open');
                    navToggle.classList.remove('is-active');
                    document.body.classList.remove('no-scroll'); // Re-enable scrolling
                }
            });
        });
    }

}); // End of DOMContentLoaded