let particles = [];
let gravity; 
let paused = false
let fps

function setup () {
  createCanvas(500, 500)
  background(225)
  
  gravity = createVector(0, .5)

  for (var i = 0; i < 10; i++) {
    particles[i] = new Particle(createVector(random(width), random(height)))
  }
  fps = createP(floor(frameRate()))
}

function draw () {
  background(225)

  for (var i = 0; i < particles.length; i++) {
    if (!paused) {
    particles[i].applyForce(gravity)
    particles[i].update()
    }
    particles[i].display()
    particles[i].edges()
  }

  fps.html(floor(frameRate()))
}

function mouseClicked() {
  paused = !paused
}
