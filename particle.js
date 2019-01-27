class Particle extends Object {
  
  constructor(position) {
    super()
    
    this.pos = position.copy()
    this.vel = p5.Vector.random2D()
    this.acc = createVector(0, 0)
    this.prevPos = this.pos.copy()
  }
  
  follow(field) {
    var fieldIndex = floor(this.pos.y / step) * cols + floor(this.pos.x / step)
    var thisForce = field.fields[fieldIndex].rotationVector
    this.applyForce(thisForce)
  }

  avoid(repulsors) {
    for (var i = 0; i < repulsors.length; i++) {
      const dVec = p5.Vector.sub(repulsors[i].pos, this.pos)
      const distance = dVec.magSq()
      constrain(distance, 300, 500)
      dVec.setMag(-1000/distance)
  
      this.applyForce(dVec)
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
    if (this.pos.x >= width) {
      this.pos.x = 0
      this.prevPos.x = 0
    } else if (this.pos.x < 0) {
      this.pos.x = width - 1
      this.prevPos.x = width
    }
    
    if (this.pos.y >= height) {
      this.pos.y = 0
      this.prevPos.y = 0
    } else if (this.pos.y < 0) {
      this.pos.y = height - 1
      this.prevPos.y = height
    }
  }
  
  display() {
    stroke(0, 50)
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y)
    // ellipse(this.pos.x, this.pos.y, 2)
    this.prevPos = this.pos.copy()
  }
}

class JointSystem extends Object {
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
        this.joints[i].pos = createVector(bodyPart.position.x, bodyPart.position.y)
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

class Joint extends Particle {
  constructor(position) {
    super(position) 
    this.show = false
  }

  display() {
    if (this.show) {
      fill(255, 0, 0) 
      noStroke()
      ellipse(this.pos.x * videoScale, this.pos.y * videoScale, 10) 
    }
  }
}