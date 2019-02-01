import { P5, VIDEO_SCALE, STEP, cols } from "./perlin.js";

export class ParticleList {
  constructor() {
    this.particles = [];
    this.paused = false;
  }

  addParticle(pos) {
    this.particles.push(new Particle(pos));
  }

  attach(field) {
    this.field = field;
  }

  show() {
    for (let particle of this.particles) {
      if (!this.paused) {
        particle.follow(this.field);
        particle.update();
        particle.edges();
      }
      particle.display();
    }
  }
}

export class Particle {
  constructor(position) {
    this.pos = position.copy();
    this.vel = p5.Vector.random2D();
    this.acc = P5.createVector(0, 0);
    this.prevPos = this.pos.copy();
    this.color = P5.color(225, 15);
  }

  follow(field) {
    var fieldIndex =
      Math.floor(this.pos.y / STEP) * cols + Math.floor(this.pos.x / STEP);
    var thisForce = field.fields[fieldIndex].rotationVector;
    this.applyForce(thisForce);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(10);
    this.acc.mult(0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  edges() {
    if (this.pos.x >= P5.width) {
      this.pos.x = 0;
      this.prevPos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = P5.width - 1;
      this.prevPos.x = P5.width;
    }

    if (this.pos.y >= P5.height) {
      this.pos.y = 0;
      this.prevPos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = P5.height - 1;
      this.prevPos.y = P5.height;
    }
  }

  display() {
    P5.stroke(this.color);
    P5.line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
    this.prevPos = this.pos.copy();
  }
}

export class JointSystem extends Object {
  constructor() {
    super();
    this.joints = [];
  }

  addBodyPart(pos) {
    this.joints.push(new Joint(pos));
  }

  updateBody(keypoints) {
    for (let i = 0; i < keypoints.length; i++) {
      const bodyPart = keypoints[i];
      if (bodyPart.score > 0.7) {
        this.joints[i].pos = P5.createVector(
          bodyPart.position.x,
          bodyPart.position.y
        );
        this.joints[i].show = true;
      } else {
        this.joints[i].show = false;
      }
    }
  }

  displayJoints() {
    for (let i = 0; i < this.joints.length; i++) {
      this.joints[i].display();
    }
  }
}

export class Joint extends Particle {
  constructor(position) {
    super(position);
    this.show = false;
  }

  display() {
    if (this.show) {
      P5.fill(255, 57, 104, 50);
      P5.noStroke();
      P5.ellipse(this.pos.x * VIDEO_SCALE, this.pos.y * VIDEO_SCALE, 10);
    }
  }
}
