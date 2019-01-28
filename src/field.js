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
    P5.strokeWeight(1)
    P5.stroke((this.painted) ? '#f00' : 150)

    P5.push()
    P5.translate(this.vec.x, this.vec.y)
    P5.rotate(this.rotationVector.heading())
    P5.line(0,0,20,0)
    P5.pop()
  }
}