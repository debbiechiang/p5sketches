import {P5, VIDEO_SCALE, STEP, cols, rows} from './sketch.js'

export class Particle extends Object {
  constructor(position) {
    super()
    
    this.pos = position.copy()
    this.vel = p5.Vector.random2D()
    this.acc = P5.createVector(0, 0)
    this.prevPos = this.pos.copy()
    this.color = P5.color(225, 10)
  }
  
  follow(field) {
    var fieldIndex = Math.floor(this.pos.y / STEP) * cols + Math.floor(this.pos.x / STEP)
    var thisForce = field.fields[fieldIndex].rotationVector
    this.applyForce(thisForce)
  }

  avoid(jointSystem) {
    for (var i = 0; i < jointSystem.joints.length; i++) {
      const thisPoint = jointSystem.joints[i];
      // only avoid points that PoseNet recognizes. 
      if (thisPoint.show) {
        const dVec = p5.Vector.sub(P5.createVector(thisPoint.pos.x * VIDEO_SCALE, thisPoint.pos.y * VIDEO_SCALE), this.pos)
        const distance = dVec.magSq()

        if (distance < 1000) {
          this.color = P5.color(200,100,30, 10)
        }

        dVec.setMag(-8000/distance)
        this.applyForce(dVec)
      }
    }
  }
  
  update() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.vel.limit(10)
    this.acc.mult(0)
  }
   
  applyForce(force) {
    this.acc.add(force)
  }
  
  edges() {
    if (this.pos.x >= P5.width) {
      this.pos.x = 0
      this.prevPos.x = 0
    } else if (this.pos.x < 0) {
      this.pos.x = P5.width - 1
      this.prevPos.x = P5.width
    }
    
    if (this.pos.y >= P5.height) {
      this.pos.y = 0
      this.prevPos.y = 0
    } else if (this.pos.y < 0) {
      this.pos.y = P5.height - 1
      this.prevPos.y = P5.height
    }
  }
  
  display() {
    P5.blendMode(P5.ADD)
    P5.stroke(this.color)
    P5.line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y)
    // ellipse(this.pos.x, this.pos.y, 2)
    this.prevPos = this.pos.copy()
  }
}

export class JointSystem extends Object {
  constructor() {
    super()
    this.joints = []
  }

  addBodyPart(pos) {
    this.joints.push(new Joint(pos))
  }

  updateBody(keypoints) {
    for (let i = 0; i < keypoints.length; i++) {
      const bodyPart = keypoints[i]
      if(bodyPart.score > .7) {
        this.joints[i].pos = P5.createVector(bodyPart.position.x, bodyPart.position.y)
        this.joints[i].show = true
      } else {
        this.joints[i].show = false
      }
    }
  }

  displayJoints() {
    for (let i = 0; i < this.joints.length; i++) {
      this.joints[i].display()
    }
  }
}

export class Joint extends Particle {
  constructor(position) {
    super(position) 
    this.show = false
  }

  display() {
    if (this.show) {
      P5.fill(255, 57,104, 50) 
      P5.noStroke()
      P5.ellipse(this.pos.x * VIDEO_SCALE, this.pos.y * VIDEO_SCALE, 10) 
    }
  }
}