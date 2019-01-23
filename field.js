
class Field extends Object {
  constructor() {
    super()
    this.fields = []
  }

  addPoint(vec) {
    this.fields.push(new FieldPoint(vec))
  }

  updateAngle(index, angle) {
    this.fields[index].setZ(angle.heading())
  }

  run() {
    for (var i = 0; i < this.fields.length; i++) {
      this.fields[i].display()
    }
  }
}

class FieldPoint extends Object {
  constructor(vec) {
    super()
    this.x = vec.x
    this.y = vec.y
    this.z = vec.z
  }

  setZ(rotation) {
    this.z = rotation
  }

  display() {
    strokeWeight(1)
    stroke(0)

    push()
    translate(this.x, this.y)
    rotate(this.z)
    line(0,0,20,0)
    pop()
  }
}