
class Particle extends Object {
  
  constructor(position) {
    super()
    
    this.pos = position.copy()
    this.vel = createVector(0, 0)
    this.acc = createVector(0, 0)
  }
  
  update() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.acc.mult(0)
    this.vel.limit(15)
  }
  
  applyForce(force) {
    this.acc.add(force)
  }

  edges() {
    if (this.pos.x >= width) {
      this.pos.x = 0
    } else if (this.pos.x < 0) {
      this.pos.x = width
    }

   if (this.pos.y >= height) {
      this.pos.y = 0
    } else if (this.pos.y < 0) {
      this.pos.y = height
    }
  }

  display() {
    fill(255)
    noStroke()
    ellipse(this.pos.x, this.pos.y, 15)
  }
}