import "p5/lib/addons/p5.dom.js";
import "./sass/index.scss";
import ml5 from "ml5";

let flock;
let frames;

let s = sk => {
  sk.setup = () => {
    sk.createCanvas(window.innerWidth, window.innerHeight);

    flock = new Flock();

    for (var i = 0; i < 50; i++) {
      flock.addBird(
        sk.createVector(
          Math.floor(sk.width * Math.random()),
          Math.floor(sk.height * Math.random())
        )
      );
    }

    frames = sk.createP(Math.floor(sk.frameRate()));
  };

  sk.draw = () => {
    sk.background("skyblue");

    flock.show();

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

  show() {
    this.birds.map(bird => {
      bird.behave(this.birds);
      bird.update();
      bird.edges();
      bird.show();
    });
  }
}

class Bird {
  constructor(pos) {
    this.pos = pos.copy();
    this.vel = p5.Vector.random2D();
    this.vel.setMag(5);
    this.acc = FL.createVector();

    this.maxSpeed = 7;
    this.maxForce = 0.3;
  }

  behave(flock) {
    const alignment = this.align(flock);
    const cohesion = this.cohere(flock);
    const separation = this.separate(flock);

    alignment.mult(4);
    cohesion.mult(5);
    separation.mult(3);

    this.acc.add(alignment);
    this.acc.add(cohesion);
    this.acc.add(separation);
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
    return this._getAverage(flock, "vel");
  }

  cohere(flock) {
    return this._getAverage(flock, "pos");
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
