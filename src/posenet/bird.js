import {
  PN,
  alignmentSlider,
  cohesionSlider,
  separationSlider,
  jointSystem
} from "./posenet.js";

export class Bird {
  constructor(pos) {
    this.pos = pos.copy();
    this.vel = p5.Vector.random2D();
    this.vel.setMag(Math.floor(Math.random() * 7) + 1);
    this.acc = PN.createVector();

    this.scared = false;
    this.scaredCooldown = 50;
    this.scaredColor = PN.color(244, 125, 66);
    this.defaultColor = PN.color(131, 175, 247);

    this.maxSpeed = 6;
    this.maxForce = 0.2;
  }

  behave({ flock, predators }) {
    const alignment = this.align(flock);
    const cohesion = this.cohere(flock);
    const separation = this.separate(flock);
    const hunger = this.feed();

    alignment.mult(alignmentSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());
    hunger.mult(1);

    if (predators && predators[0].pos.x !== 0) {
      const fear = this.flee(predators);
      fear.mult(15);
      alignment.add(fear);
    }

    alignment
      .add(cohesion)
      .add(separation)
      .add(hunger);

    return alignment;
  }

  _normalizeSteering(force) {
    return force
      .setMag(this.maxSpeed)
      .sub(this.vel)
      .limit(this.maxForce);
  }

  align(flock) {
    let total = 0;
    let perceptionRadius = 50;
    const self = this;
    const steering = flock.reduce((accumulate, bird) => {
      let d = p5.Vector.sub(bird.pos, self.pos);
      if (bird != self && d.mag() < perceptionRadius) {
        accumulate.add(bird.vel);
        total++;
      }
      return accumulate;
    }, PN.createVector());

    if (total) {
      steering.div(total);
      this._normalizeSteering(steering);
    }

    return steering;
  }

  cohere(flock) {
    let total = 0;
    let perceptionRadius = 50;
    const self = this;
    const target = flock.reduce((accumulate, bird) => {
      let d = p5.Vector.sub(bird.pos, self.pos);
      if (bird != self && d.mag() < perceptionRadius) {
        accumulate.add(bird.pos);
        total++;
      }
      return accumulate;
    }, PN.createVector());

    if (total) {
      return target
        .div(total)
        .sub(this.pos)
        .setMag(this.maxSpeed)
        .sub(this.vel)
        .limit(this.maxForce);
    }

    return target;
  }

  separate(flock) {
    let perceptionRadius = 24;
    let steering = PN.createVector();
    let total = 0;
    for (let bird of flock) {
      let separation;
      let d = PN.dist(this.pos.x, this.pos.y, bird.pos.x, bird.pos.y);
      if (bird != this && d < perceptionRadius) {
        total++;
        separation = p5.Vector.sub(this.pos, bird.pos);
        separation.div(d * d);
        steering.add(separation);
      }
    }
    if (total) {
      steering.div(total);
      this._normalizeSteering(steering);
    }
    return steering;
  }

  flee(bodyParts) {
    let perceptionRadius = 80;
    let steering = PN.createVector();
    let total = 0;

    for (let bodyPart of bodyParts) {
      let d = PN.dist(this.pos.x, this.pos.y, bodyPart.pos.x, bodyPart.pos.y);
      if (d < perceptionRadius) {
        total++;
        this.scared = true;
        setTimeout(() => (this.scared = false), this.scaredCooldown);
        steering = p5.Vector.sub(this.pos, bodyPart.pos);
        steering.mult(500 / (d * d));
      }
    }

    if (total) {
      steering.setMag(this.maxSpeed * 1.5); // adrenaline
      steering.sub(this.vel);
      steering.limit(this.maxForce * 1.6);
    }

    return steering;
  }

  feed() {
    let food = PN.createVector(PN.mouseX, PN.mouseY);
    let perceptionRadius = 300;
    let steering = PN.createVector();

    let d = PN.dist(this.pos.x, this.pos.y, food.x, food.y);
    if (PN.mouseIsPressed && d < perceptionRadius) {
      steering = p5.Vector.sub(food, this.pos);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce * 1.3);
    }

    return steering;
  }

  edges() {
    if (this.pos.x >= PN.width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = PN.width - 1;
    }

    if (this.pos.y >= PN.height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = PN.height - 1;
    }
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    if (!this.scared) {
      this.vel.limit(this.maxSpeed);
    }
    this.acc.mult(0);
  }

  paintBird(w, h) {
    PN.noStroke();
    PN.beginShape();
    PN.vertex(w / 2, 0);
    PN.vertex(w, h);
    PN.vertex(w / 2, h * 0.75);
    PN.vertex(0, h);
    PN.vertex(w / 2, 0);
    PN.endShape(PN.CLOSE);
  }

  show() {
    PN.push();
    PN.translate(this.pos.x, this.pos.y);
    PN.rotate(this.vel.heading() + Math.PI / 2);
    PN.fill(this.scared ? this.scaredColor : this.defaultColor);
    this.paintBird(10, 20);
    PN.pop();
  }
}
