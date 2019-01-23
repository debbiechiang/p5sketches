let particles = [];
// let gravity; 
let paused = false
let fps
const step = 25
let field = []
let xoff, yoff, zoff = 0
let rows, cols
let inc 


function setup () {
  createCanvas(500, 500)
  inc = .05
  zoff = 0
  rows = floor(width/step)
  cols = floor(height/step)

  // gravity = createVector(0, .5)

  // field = new Field();
  for (var x = 0; x <= cols; x++) {
    for (var y = 0; y <= rows; y++) {
      field.push(createVector(x * step, y * step, 0))
    }
  }

  for (var i = 0; i < 10; i++) {
    particles[i] = new Particle(createVector(random(width), random(height)))
  }

  fps = createP(floor(frameRate()))
}

function draw () {
  background(225)

  for (var i = 0; i < particles.length; i++) {
    if (!paused) {
    // particles[i].applyForce(gravity)
    particles[i].update()
    }
    particles[i].display()
    particles[i].edges()
  }

  // this needs a changeup 
    xoff = 0
    for (var x= 0; x <= rows; x++) {
      yoff = 0
      for (var y= 0; y <= cols; y++) {
        yoff += inc
        var index = (x * rows + y);
        var angle = p5.Vector.fromAngle(noise(xoff, yoff, zoff) * TWO_PI)
        // field.updateAngle(index, p5.Vector.fromAngle(angle))

        strokeWeight(1)
        stroke(0)
        push()
          translate(x * step, y * step)
          rotate(angle.heading())
          line(0,0,step,0)
        pop()
      }
      xoff += inc
      zoff += 0.0005
    }

  // field.run()

  fps.html(floor(frameRate()))
}

function mouseClicked() {
  paused = !paused
}
