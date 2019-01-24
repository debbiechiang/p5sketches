class Particle extends Object {
  
  constructor(position) {
    super()
    
    this.pos = position.copy()
    this.vel = createVector(0, 0)
    this.acc = createVector(0, 0)
    this.prevPos = this.pos.copy()
  }
  
  follow(field) {
    var fieldIndex = floor(this.pos.y / step) * cols + floor(this.pos.x / step)
    var thisForce = field.fields[fieldIndex].vec.z
    this.applyForce(thisForce)
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
    stroke(225, 15)
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y)
    this.prevPos = this.pos.copy()
  }
}