let particles = [];
let paused = false
let fps

let repulsor
let repulsed

let field = []
let xoff, yoff, zoff = 0
let rows, cols
let fieldIndex

const step = 20
const inc = .05


function setup () {
  createCanvas(displayWidth, displayHeight)
  // background(0)

  // Perlin noise field
  zoff = 0
  rows = floor(height/step) + 1
  cols = floor(width/step) + 1

  field = new Field();
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      field.addPoint(createVector(x*step, y*step, 0))
    }
  }

  // Particles
  for (var i = 0; i < 1000; i++) {
    particles[i] = new Particle(createVector(random(width), random(height)))
  }

  // Repulsor
  repulsor = new Repulsor(createVector(width/2, height/2))
  repulsed = repulsor.repulse(field)

  // console.log(p5.Vector.sub(repulsor.pos, repulsed.vec).mag())

  fps = createP(floor(frameRate()))
}

function draw () {
  yoff = 0
  for (var y = 0; y < rows; y++) {
    xoff = 0
    for (var x = 0; x < cols; x++) {
      xoff += inc
      var index = y * cols + x
      var angle = p5.Vector.fromAngle(noise(xoff, yoff, zoff) * 2 * PI)
      field.updateAngle(index, angle)
    }
    yoff += inc
    zoff += 0.0007
  }

  background(255)
  field.show()

  repulsor.display()
  // repulsed.paint()
  // for (var i = 0; i < particles.length; i++) {
  //   if (!paused) {
  //     particles[i].follow(field)
  //     particles[i].update()
  //     particles[i].edges()
  //   }
  //   particles[i].display()
  // }

  fps.html(floor(frameRate()))
}

function mouseClicked() {
  paused = !paused
}
