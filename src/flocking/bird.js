import {
  FL,
  alignmentSlider,
  cohesionSlider,
  separationSlider,
  predator
} from "./flocking.js";

export class Bird {
  constructor(pos) {
    this.pos = pos.copy();
    this.vel = p5.Vector.random2D();
    this.vel.setMag(Math.floor(Math.random() * 7) + 1);
    this.acc = FL.createVector();

    this.scared = false;
    this.scaredCooldown = 50;
    this.scaredColor = FL.color(244, 125, 66);
    this.defaultColor = FL.color(131, 175, 247);

    this.maxSpeed = 6;
    this.maxForce = 0.2;
  }

  behave(flock) {
    const alignment = this.align(flock);
    const cohesion = this.cohere(flock);
    const separation = this.separate(flock);
    const fear = this.flee(predator);
    const hunger = this.feed();

    alignment.mult(alignmentSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());
    fear.mult(15);
    hunger.mult(1);

    return alignment
      .add(cohesion)
      .add(separation)
      .add(hunger)
      .add(fear);
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
    }, FL.createVector());

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
    }, FL.createVector());

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
    let steering = FL.createVector();
    let total = 0;
    for (let bird of flock) {
      let separation;
      let d = FL.dist(this.pos.x, this.pos.y, bird.pos.x, bird.pos.y);
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

  flee(predator) {
    let perceptionRadius = 80;
    let steering = FL.createVector();
    let total = 0;
    let d = FL.dist(this.pos.x, this.pos.y, predator.pos.x, predator.pos.y);
    if (d < perceptionRadius) {
      total++;
      this.scared = true;
      setTimeout(() => (this.scared = false), this.scaredCooldown);
      steering = p5.Vector.sub(this.pos, predator.pos);
      steering.mult(500 / (d * d));
    }

    if (total) {
      steering.setMag(this.maxSpeed * 1.5); // adrenaline
      steering.sub(this.vel);
      steering.limit(this.maxForce * 1.6);
    }

    return steering;
  }

  feed() {
    let food = FL.createVector(FL.mouseX, FL.mouseY);
    let perceptionRadius = 300;
    let steering = FL.createVector();

    let d = FL.dist(this.pos.x, this.pos.y, food.x, food.y);
    if (FL.mouseIsPressed && d < perceptionRadius) {
      steering = p5.Vector.sub(food, this.pos);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce * 1.3);
    }

    return steering;
  }

  edges() {
    if (this.pos.x >= FL.width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = FL.width - 1;
    }

    if (this.pos.y >= FL.height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = FL.height - 1;
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
    FL.noStroke();
    FL.beginShape();
    FL.vertex(w / 2, 0);
    FL.vertex(w, h);
    FL.vertex(w / 2, h * 0.75);
    FL.vertex(0, h);
    FL.vertex(w / 2, 0);
    FL.endShape(FL.CLOSE);
  }

  show() {
    FL.push();
    FL.translate(this.pos.x, this.pos.y);
    FL.rotate(this.vel.heading() + Math.PI / 2);
    FL.fill(this.scared ? this.scaredColor : this.defaultColor);
    this.paintBird(10, 20);
    FL.pop();
  }
}
