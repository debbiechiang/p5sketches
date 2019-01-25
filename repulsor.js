class Repulsor extends Object {
  constructor(position) {
    super()
    this.pos = position
    this.vel = createVector(0,0)

    this.mass = 16
    this.tolerance = width/10
  }

  display() {
    fill(0)
    ellipse(this.pos.x, this.pos.y, this.mass)
  }
}