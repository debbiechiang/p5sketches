let particles = []
let paused = false
let fps

let repulsors = []
let repulsor

let field = []
let xoff, yoff, zoff = 0
let rows, cols
let fieldIndex

const step = 20
const inc = .05


function setup () {
  createCanvas(displayWidth, displayHeight)
  background(255)

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
  for (var i = 0; i < 20; i++) {
    particles[i] = new Particle(createVector(random(width), random(height)))
  }

  // Repulsor
  repulsors.push(new Repulsor(createVector(width/2, height/2)))

  fps = createP(floor(frameRate()))
}

function draw () {
  // background(255)
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
  
  for (var x = 0; x < repulsors.length; x++) {
    repulsors[x].display()
  }

  // field.show()

  for (var i = 0; i < particles.length; i++) {
    if (!paused) {
      particles[i].follow(field)
      particles[i].avoid(repulsors)
      particles[i].update()
      particles[i].edges()
    }
    particles[i].display()
  }

  fps.html(floor(frameRate()))
}

function mousePressed() {
  const mousePos = createVector(mouseX, mouseY, 0)
  repulsors.push(new Repulsor(mousePos))
}

function mouseClicked() {
  // paused = !paused
}
