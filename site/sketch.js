let particles = [];
const numParticles = 50; // Keep it low for performance and subtlety

function setup() {
    let canvasContainer = select('#p5-canvas-container');
    // Ensure container is ready
    if (canvasContainer) {
        let canvas = createCanvas(canvasContainer.width, canvasContainer.height);
        canvas.parent('p5-canvas-container'); // Attach canvas to the div
        
        // Create particles
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
        noStroke(); // No outlines for particles
    } else {
        console.error("p5.js canvas container not found!");
    }
}

function draw() {
    if (particles.length > 0) { // Only draw if setup was successful
        clear(); // Clears the canvas each frame for no trails
        // Or use a low alpha background for trails:
        // background(227, 242, 253, 30); // Very light blue with low alpha for trails

        for (let particle of particles) {
            particle.update();
            particle.display();
        }
    }
}

function windowResized() {
    let canvasContainer = select('#p5-canvas-container');
    if (canvasContainer) {
        resizeCanvas(canvasContainer.width, canvasContainer.height);
    }
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-0.3, 0.3), random(-0.3, 0.3)); 
        this.size = random(2, 6); // Slightly larger particles can also look nice
        // Color matching the home section's palette for subtlety
        this.color = color(13, 71, 161, random(40, 90)); // Darker blue with alpha
    }

    update() {
        this.pos.add(this.vel);
        this.edges();
    }

    display() {
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    edges() {
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = height;
        if (this.pos.y > height) this.pos.y = 0;
    }
}