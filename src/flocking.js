import "p5/lib/addons/p5.dom.js";
import "./sass/index.scss";
import ml5 from "ml5";
import clone from "lodash/clone";
let flock = [];
let hawk;
let frames;
let alignmentSlider;
let cohesionSlider;
let separationSlider;
let dx = 15;
let flockSnapshot;

let s = sk => {
  sk.setup = () => {
    sk.createCanvas(window.innerWidth, window.innerHeight - 100);

    flock = new Flock();
    for (var i = 0; i < 100; i++) {
      flock.addBird(
        sk.createVector(
          Math.floor(Math.random() * sk.width),
          Math.floor(Math.random() * sk.height)
        )
      );
    }

    hawk = new Hawk(
      sk.createVector(
        Math.floor(Math.random() * sk.width),
        Math.floor(Math.random() * sk.height)
      )
    );

    alignmentSlider = sk.createSlider(0, 10, 2);
    sk.createP("Alignment");
    cohesionSlider = sk.createSlider(0, 10, 2);
    sk.createP("Cohesion");
    separationSlider = sk.createSlider(0, 30, 0.2);
    sk.createP("Separation");

    frames = sk.createP(Math.floor(sk.frameRate()));
  };

  sk.draw = () => {
    sk.background("skyblue");
    flock.takeSnapshot();

    flock.show();
    hawk.chase(flock.birds);
    frames.html(Math.floor(sk.frameRate()));
  };
};

const FL = new p5(s);

class Flock {
  constructor() {
    this.birds = [];
  }

  addBird(pos) {
    this.birds.push(new Bird(pos));
  }

  takeSnapshot() {
    flockSnapshot = clone(this.birds);
  }

  updatePositions(flock) {
    return this.birds.map(bird => bird.behave(flock));
  }

  show() {
    let accelerations = this.updatePositions(flockSnapshot);
    this.birds.map((bird, i) => {
      bird.edges();
      bird.acc.add(accelerations[i]);
      bird.update();
      bird.show();
    });
  }
}

class Bird {
  constructor(pos) {
    this.pos = pos.copy();
    this.vel = p5.Vector.random2D();
    this.vel.setMag(Math.floor(Math.random() * 7) + 1);
    this.acc = FL.createVector();

    this.maxSpeed = 8;
    this.maxForce = 0.2;
  }

  behave(flock) {
    const alignment = this.align(flock);
    const cohesion = this.cohere(flock);
    const separation = this.separate(flock);

    alignment.mult(alignmentSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    return alignment.add(cohesion).add(separation);
  }

  _normalizeSteering(force, total) {
    return force
      .div(total)
      .setMag(this.maxSpeed)
      .sub(this.vel)
      .limit(this.maxForce);
  }

  _getAverage(flock, measurement, perceptionRadius = 50) {
    let total = 0;
    const self = this;
    const steering = flock.reduce((acc, bird) => {
      let d = FL.dist(self.pos.x, self.pos.y, bird.pos.x, bird.pos.y);
      if (bird != self && d < perceptionRadius) {
        acc.add(bird[measurement]);
        total++;
      }
      return acc;
    }, FL.createVector());

    if (total) {
      this._normalizeSteering(steering, total);
    }
    return steering;
  }

  align(flock) {
    return this._getAverage(flock, "vel", 50);
  }

  cohere(flock) {
    return this._getAverage(flock, "pos", 20);
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
      this._normalizeSteering(steering, total);
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
    this.vel.limit(this.maxSpeed);
    this.acc.mult(0);
  }

  paintBird() {
    FL.fill(131, 175, 247);
    FL.noStroke();
    FL.beginShape();
    FL.vertex(5, 0);
    FL.vertex(10, 20);
    FL.vertex(5, 15);
    FL.vertex(0, 20);
    FL.vertex(5, 0);
    FL.endShape(FL.CLOSE);
  }

  show() {
    FL.push();
    FL.translate(this.pos.x, this.pos.y);
    FL.rotate(this.vel.heading() + Math.PI / 2);
    this.paintBird();
    FL.pop();
  }
}

class Hawk extends Bird {
  constructor(position) {
    super(position);
    this.vel.setMag(Math.floor(Math.random() * 9) + 1);
    this.huntingRadius = 120;
    this.maxSpeed = 12;
    this.maxForce = 0.8;
  }

  hunt(flock) {
    let pursue = this._getAverage(flock, "pos", this.huntingRadius);
    if (pursue.magSq() == 0) {
      pursue = this.vel
        .copy()
        .rotate(FL.noise(dx) / 100)
        .sub(this.vel);

      this.acc.add(this.vel.copy().mult(-0.01));
      dx += 0.01;
    }
    FL.push();
    FL.translate(this.pos.x, this.pos.y);
    FL.rotate(this.acc.heading());
    FL.line(10, 0, this.acc.mag() * 1000, 0);
    FL.pop();
    return pursue;
  }

  paintBird() {
    FL.fill(255, 0, 0);
    FL.noStroke();
    FL.beginShape();
    FL.vertex(10, 0);
    FL.vertex(20, 30);
    FL.vertex(10, 17);
    FL.vertex(0, 30);
    FL.vertex(10, 0);
    FL.endShape(FL.CLOSE);
  }

  chase(prey) {
    hawk.edges();

    let hunger = hawk.hunt(prey);

    hunger.mult(2);

    this.acc.add(hunger);
    hawk.update();
    hawk.show();
  }
}
