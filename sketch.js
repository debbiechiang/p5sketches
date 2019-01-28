let particles = []
let paused = false
let fps

let field = []
let xoff, yoff, zoff = 0
let rows, cols
let fieldIndex

const STEP = 20
const INC = .05
const KEYPOINT_NUM = 17
const VIDEO_SCALE = 4

let capture
let videoLayer
let poseNet
let jointSystem

function modelLoaded () {
}

function setup () {
  createCanvas(windowWidth, windowHeight-100)
  videoLayer = createGraphics(800, 800)
  capture = createCapture(VIDEO)
  capture.size(width/VIDEO_SCALE, height/VIDEO_SCALE)
  capture.hide()
  poseNet = ml5.poseNet(capture, {
    imgScaleFactor: 0.3,
    flipHorizontal: true,
    detectionType: 'single'
  }, modelLoaded)

  // Perlin noise field
  zoff = 0
  rows = floor(height/STEP) + 1
  cols = floor(width/STEP) + 1

  field = new Field();
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      field.addPoint(createVector(x*STEP, y*STEP, 0))
    }
  }

  // Particles
  for (var i = 0; i < 200; i++) {
    particles[i] = new Particle(createVector(random(width), random(height)))
  }

  // PoseNet Keypoints
  jointSystem = new JointSystem()

  for (let i = 0; i < KEYPOINT_NUM; i++) {
    jointSystem.addBodyPart(createVector(0,0))
  }

  poseNet.on('pose', function(results) {
    if(results.length) {
      const {pose, skeleton} = results[0]
      jointSystem.updateBody(pose.keypoints)
    }
  })

  // Framecount
  fps = createP(floor(frameRate()))
}

function draw () {
  // image(capture, 0, 0)

  background(0)
  yoff = 0
  for (var y = 0; y < rows; y++) {
    xoff = 0
    for (var x = 0; x < cols; x++) {
      xoff += INC
      var index = y * cols + x
      var angle = p5.Vector.fromAngle(noise(xoff, yoff, zoff) * 2 * PI)
      field.updateAngle(index, angle)
    }
    yoff += INC
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

  // jointSystem.displayJoints()

  fps.html(floor(frameRate()))
}

function mouseClicked() {
  // paused = !paused
  blendMode(BLEND)
  background(0)
}
