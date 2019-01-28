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
const keypointNum = 17
const videoScale = 4

let capture
let videoLayer
let poseNet
let jointSystem

function modelLoaded () {
}

function setup () {
  createCanvas(displayWidth, displayHeight-100)
  videoLayer = createGraphics(800, 800)
  capture = createCapture(VIDEO)
  capture.size(width/videoScale, height/videoScale)
  capture.hide()
  poseNet = ml5.poseNet(capture, {
    imgScaleFactor: 0.3,
    flipHorizontal: true,
    detectionType: 'single'
  }, modelLoaded)

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
  for (var i = 0; i < 200; i++) {
    particles[i] = new Particle(createVector(random(width), random(height)))
  }

  // PoseNet Keypoints
  jointSystem = new JointSystem()

  for (let i = 0; i < keypointNum; i++) {
    jointSystem.addBodyPart(createVector(0,0))
  }

  poseNet.on('pose', function(results) {
    if(results.length) {
      const {pose, skeleton} = results[0]
      jointSystem.updateBody(pose.keypoints)
    }
  })

  // Repulsor
  // repulsors.push(new Repulsor(createVector(width/2, height/2)))

  // Framecount
  fps = createP(floor(frameRate()))
}



function draw () {
  // videoLayer.clear()

  // image(capture, 0, 0)


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
  
  // field.show()

  for (var i = 0; i < particles.length; i++) {
    if (!paused) {
      particles[i].follow(field)
      particles[i].avoid(jointSystem)
      particles[i].update()
      particles[i].edges()
    }
    particles[i].display()
  }

  jointSystem.displayJoints()

  fps.html(floor(frameRate()))
}

function mousePressed() {
  const mousePos = createVector(mouseX, mouseY, 0)
  repulsors.push(new Repulsor(mousePos))
}

function mouseClicked() {
  paused = !paused
}
