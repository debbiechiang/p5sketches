let particles = [];
let gravity; 
let paused = false
let fps
const step = 25
let f
let xoff, yoff, zoff


function setup () {
  createCanvas(500, 500)
  background(225)
  xoff = 0.01
  yoff = 0.10501
  zoff = 0.001

  gravity = createVector(0, .5)

  f = new Field();

  for (var i = 0; i < 10; i++) {
    particles[i] = new Particle(createVector(random(width), random(height)))
  }

  // this needs a changeup
  for (var i= 0; i <= width/step; i++) {
    xoff += 0.05
    for (var j= 0; j <= height/step; j++) {
      f.addPoint(createVector(i * step, j * step, noise(xoff, yoff)))
      yoff += 0.15
    }
  }
  zoff += 0.05
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

  f.run()

  fps.html(floor(frameRate()))
}

function mouseClicked() {
  paused = !paused
}
