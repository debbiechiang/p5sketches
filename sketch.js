let particles = [];
let paused = false
let fps
let field = []
let xoff, yoff, zoff = 0
let rows, cols

const step = 20
const inc = .05


function setup () {
  createCanvas(500, 500)
  zoff = 0
  
  rows = floor(height/step) + 1
  cols = floor(width/step) + 1

  field = new Field();
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      field.addPoint(createVector(x*step, y*step, 0))
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
    particles[i].update()
    }
    particles[i].display()
    particles[i].edges()
  }

  // this needs a changeup 
    yoff = 0
    for (var y = 0; y < rows; y++) {
      xoff = 0
      for (var x = 0; x < cols; x++) {
        xoff += inc
        var index = y * rows + x
        var angle = p5.Vector.fromAngle(noise(xoff, yoff, zoff) * TWO_PI)
        field.updateAngle(index, angle)
      }
      yoff += inc
      zoff += 0.0007
    }

  field.run()

  fps.html(floor(frameRate()))
}

function mouseClicked() {
  console.log(field)
  paused = !paused
}
