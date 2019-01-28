import {P5} from './sketch.js'

export class Field extends Object {
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
    this.rotationVector = P5.createVector(0,0)
  }

  setZ(rotation) {
    this.rotationVector = rotation
  } 

  paint(boolean) {
    this.painted = boolean
  }

  display() {
    strokeWeight(1)
    stroke((this.painted) ? '#f00' : 150)

    push()
    translate(this.vec.x, this.vec.y)
    rotate(this.rotationVector.heading())
    line(0,0,20,0)
    pop()
  }
}