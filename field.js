
class Field extends Object {
  constructor() {
    super()
    this.fields = []
  }

  addPoint(vec) {
    this.fields.push(new FieldPoint(vec))
  }

  updateAngle(index, angle) {
    this.fields[index].setZ(angle)
  }

  show() {
    for (var i = 0; i < this.fields.length; i++) {
      this.fields[i].display()
    }
  }
}

class FieldPoint extends Object {
  constructor(vec) {
    super()
    this.vec = vec.copy()
    this.painted = false
  }

  setZ(rotation) {
    this.vec.z = rotation
  } 

  paint(boolean) {
    this.painted = boolean
  }

  display() {
    strokeWeight(1)
    stroke((this.painted) ? '#f00' : 150)

    push()
    translate(this.vec.x, this.vec.y)
    rotate(this.vec.z.heading())
    line(0,0,20,0)
    pop()
  }
}