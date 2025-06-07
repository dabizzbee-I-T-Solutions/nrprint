let canvas;
let vines = [];
let flowers = [];
let growthTarget = 0; // The target "life" for vines, controlled by scroll (0 to 1)

// --- Same variables as before ---
let maxVines = 5;
let borderPadding = 30;
const flowerColors = ['#F4F1EE', '#FFDAB9', '#FADADD', '#E6E6FA'];
let philosophyBoxElement; // Store the element to observe

function setup() {
  philosophyBoxElement = document.querySelector('.philosophy-box');
  if (!philosophyBoxElement) return;

  canvas = createCanvas(philosophyBoxElement.offsetWidth, philosophyBoxElement.offsetHeight);
  canvas.parent('p5-canvas-container');
  canvas.style('position', 'absolute');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '0');

  // --- NEW: SCROLL-BASED CONTROL ---
  // We no longer need mouse events.
  // Add a scroll listener to the window.
  window.addEventListener('scroll', calculateGrowthTarget);
  // Call it once at the start to set the initial state.
  calculateGrowthTarget();

  // Initialize the vines once.
  startGrowth();
}

function draw() {
  clear();
  for (let flower of flowers) { flower.draw(growthTarget > 0.1); }
  for (let i = vines.length - 1; i >= 0; i--) {
    vines[i].update();
    vines[i].draw();
  }
}

// This function is the new heart of the animation control
function calculateGrowthTarget() {
  const boxRect = philosophyBoxElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  // Calculate how much of the box is visible.
  // Clamp the value between 0 (not visible) and 1 (fully visible).
  const visibleHeight = max(0, min(boxRect.bottom, viewportHeight) - max(boxRect.top, 0));
  growthTarget = visibleHeight / boxRect.height;
}


function windowResized() {
  const philosophyBox = document.querySelector('.philosophy-box');
  if (philosophyBox) {
    resizeCanvas(philosophyBox.offsetWidth, philosophyBox.offsetHeight);
    calculateGrowthTarget(); // Recalculate on resize
  }
}

function startGrowth() {
  vines = [];
  flowers = [];
  for (let i = 0; i < maxVines; i++) {
    let startPos = createVector(random(1) < 0.5 ? 0 : width, random(height * 0.5, height));
    vines.push(new Vine(startPos, random(1, 2.5)));
  }
}

// Vine Class
class Vine {
  constructor(pos, weight) {
    this.path = [pos.copy()];
    this.vel = createVector(0, -1);
    this.weight = weight;
    this.noiseOffset = random(1000);
    this.splitChance = 0.008;
    this.flowerChance = 0.012;
    this.life = 0; // Current life/alpha
    this.pathLengthTarget = 0; // Target length controlled by scroll
  }

  update() {
    // Smoothly move current life towards the scroll-controlled target
    this.life = lerp(this.life, growthTarget * 150, 0.05); // Lerp to 150 alpha
    
    // Calculate how long the path should be based on the growth target
    this.pathLengthTarget = this.life / 150 * 500; // Map life to a max path length

    // Only grow if the path is shorter than its target length
    if (this.path.length < this.pathLengthTarget) {
      let lastPos = this.path[this.path.length - 1];

      let sun = createVector(width / 2, 0);
      let attraction = p5.Vector.sub(sun, lastPos);
      attraction.normalize();
      this.vel.add(attraction.mult(0.1));

      let noiseAngle = (noise(this.noiseOffset) - 0.5) * 0.4;
      this.vel.rotate(noiseAngle);
      
      let steer = createVector();
      if (lastPos.x < borderPadding) steer.add(1, 0);
      if (lastPos.x > width - borderPadding) steer.add(-1, 0);
      if (lastPos.y < borderPadding) steer.add(0, 1);
      if (lastPos.y > height - borderPadding) steer.add(0, -1);
      this.vel.add(steer.mult(0.3));

      this.vel.normalize();
      
      let newPos = p5.Vector.add(lastPos, this.vel.copy().mult(0.6));
      this.noiseOffset += 0.02;

      this.path.push(newPos);

      if (random() < this.splitChance && vines.length < 15 && this.life > 100) {
        vines.push(new Vine(lastPos.copy(), this.weight * 0.7));
      }
      
      if (random() < this.flowerChance && this.life > 100) {
        flowers.push(new Flower(lastPos.copy()));
      }
    } 
    // If the path is longer than the target, shrink it
    else if (this.path.length > this.pathLengthTarget + 1 && this.path.length > 2) {
      this.path.pop();
    }
  }

  draw() {
    noFill();
    stroke(58, 125, 68, this.life);
    strokeWeight(this.weight);
    beginShape();
    for (let p of this.path) { vertex(p.x, p.y); }
    endShape();
  }
}

// Flower Class
class Flower {
  constructor(pos) {
    this.pos = pos;
    this.size = 0;
    this.maxSize = random(8, 15);
    this.petals = int(random(5, 8));
    this.color = color(random(flowerColors));
    this.life = 255;
  }
  
  // Pass the active state to the flower
  draw(isGrowthActive) {
    if (isGrowthActive && this.size < this.maxSize) {
      this.size = lerp(this.size, this.maxSize, 0.05); // Smoothly bloom
    } else if (!isGrowthActive) {
      this.life = lerp(this.life, 0, 0.1); // Smoothly fade out
    }
    
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    let c = this.color;
    c.setAlpha(this.life);
    fill(c);
    let angle = TWO_PI / this.petals;
    for (let i = 0; i < this.petals; i++) {
      rotate(angle);
      ellipse(this.size / 2, 0, this.size, this.size / 2);
    }
    pop();
  }
}