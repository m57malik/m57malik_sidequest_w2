// Object representing a sad, droopy animated blob
let blob = {
  // Position of the blob (starts centered, but will droop down)
  x: 240,
  y: 160, // centre of the canvas

  // Base size and shape resolution
  r: 28, // Base radius of the blob
  points: 48, // Number of vertices around the circle (higher = smoother)

  // Shape deformation settings for sadness
  wobble: 12, // More irregular shape to show distress
  wobbleFreq: 0.3, // Slower, more sluggish movement

  // Time values for animation
  t: 0, // Time input for noise()
  tSpeed: 0.003, // Much slower breathing - lethargic
  
  // Sadness-specific properties
  droopAmount: 0, // How much the blob droops downward
  tears: [], // Array to hold falling tear drops
};

// Tear drop object
class Tear {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(1, 2);
    this.size = random(3, 6);
    this.opacity = 255;
  }
  
  update() {
    this.y += this.speed;
    this.opacity -= 2; // Fade out as it falls
  }
  
  display() {
    noStroke();
    fill(100, 150, 200, this.opacity);
    ellipse(this.x, this.y, this.size, this.size * 1.5);
  }
  
  isGone() {
    return this.opacity <= 0 || this.y > height;
  }
}

function setup() {
  createCanvas(480, 320);
  noStroke();

  // Text settings for on-screen message
  textFont("Georgia"); // Serif font feels more somber
  textSize(13);
}

function draw() {
  // Melancholic blue-grey gradient background
  setGradient(0, 0, width, height, color(60, 70, 90), color(90, 100, 120));

  // --- Animate over time ---
  // Increment time very slowly for lethargic movement
  blob.t += blob.tSpeed;
  
  // Blob slowly droops downward over time (gravity effect)
  if (blob.droopAmount < 40) {
    blob.droopAmount += 0.15;
  }

  // Occasionally spawn a tear
  if (random() < 0.02) {
    let tearX = blob.x + random(-blob.r * 0.5, blob.r * 0.5);
    let tearY = blob.y + blob.droopAmount;
    blob.tears.push(new Tear(tearX, tearY));
  }

  // Update and display tears
  for (let i = blob.tears.length - 1; i >= 0; i--) {
    blob.tears[i].update();
    blob.tears[i].display();
    
    if (blob.tears[i].isGone()) {
      blob.tears.splice(i, 1);
    }
  }

  // --- Draw the sad blob ---
  // Muted blue color - less saturated, more grey
  fill(80, 100, 140, 200);
  beginShape();

  // Loop once around the circle
  for (let i = 0; i < blob.points; i++) {
    // Angle around the circle (0 → TAU)
    const a = (i / blob.points) * TAU;

    // Sample Perlin noise using:
    // - direction (cos/sin of angle)
    // - time (blob.t) for slow animation
    const n = noise(
      cos(a) * blob.wobbleFreq + 100,
      sin(a) * blob.wobbleFreq + 100,
      blob.t,
    );

    // Convert noise value (0–1) into a radius offset
    let r = blob.r + map(n, 0, 1, -blob.wobble, blob.wobble);
    
    // Make the bottom droop more (sadness effect)
    // Points near the bottom (a ≈ PI/2 to 3*PI/2) droop more
    let droopFactor = map(sin(a), -1, 1, 0.5, 1.5);
    let yOffset = blob.droopAmount * droopFactor;

    // Convert polar coordinates (angle + radius)
    // into screen coordinates (x, y)
    vertex(
      blob.x + cos(a) * r, 
      blob.y + sin(a) * r + yOffset
    );
  }

  // Close the shape to form a solid blob
  endShape(CLOSE);

  // --- On-screen message ---
  fill(180, 190, 210);
  text("A sad blob, heavy with melancholy...", 10, 18);
}

// Helper function to create gradient background
function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}
