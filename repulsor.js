class Repulsor extends Particle {
  constructor(position) {
    super(position)
    this.mass = 16
    this.tolerance = width/6
  }

  update() {
    super.update()
  }

  display() {
    fill(0)
    ellipse(this.pos.x, this.pos.y, this.mass)
  }

  repulse(field) {
    // return field.fields[floor(random(0, field.fields.length))]
    
    for (var i = 0; i < field.fields.length; i++) {
      const dist = p5.Vector.sub(this.pos, field.fields[i].vec).mag()
      field.fields[i].paint((dist < this.tolerance) ? true : false)
    }
  }
}