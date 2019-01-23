
class Field extends Object {
  constructor() {
    super()
    this.fields = []
  }

  addPoint(vec) {
    this.fields.push(new FieldPoint(vec))
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
    this.loc = vec.copy()
  }

  display() {
    strokeWeight(4)
    stroke(0)

    push()
    translate(this.loc.x, this.loc.y)
    rotate(this.loc.z * TWO_PI)
    line(0,0,10,0)
    pop()
  }
}