import { FL } from "./flocking";
import { Bird } from "./bird";

let dx = 0.05;

export class Hawk extends Bird {
  constructor(position) {
    super(position);
    this.vel.setMag(Math.floor(Math.random() * 9) + 1);
    this.huntingRadius = 100;
    this.maxSpeed = 10;
    this.maxForce = 0.8;
  }

  hunt(flock) {
    let total = 0;
    let steering = flock.reduce((accumulate, bird) => {
      let dVec = p5.Vector.sub(bird.pos, this.pos);
      if (dVec.mag() < this.huntingRadius) {
        accumulate.add(dVec);
        total++;
      }
      return accumulate;
    }, FL.createVector());

    if (total) {
      steering.div(total);
      this._normalizeSteering(steering);
    }

    if (steering.magSq() == 0) {
      steering = this.vel
        .copy()
        .rotate(FL.noise(dx) / 100)
        .sub(this.vel);

      this.acc.add(this.vel.copy().mult(-0.01));
      dx += 0.01;
    }
    // FL.push();
    // FL.translate(this.pos.x, this.pos.y);
    // FL.rotate(this.acc.heading());
    // FL.line(10, 0, this.acc.mag() * 1000, 0);
    // FL.stroke(255, 0, 0);
    // FL.rotate(this.vel.heading() - this.acc.heading());
    // FL.line(10, 0, this.vel.heading() * 100, 0);
    // FL.pop();
    return steering;
  }

  paintBird() {
    FL.fill(124, 70, 38);
    super.paintBird(20, 30);
  }

  chase(prey) {
    this.edges();

    let hunger = this.hunt(prey);

    hunger.mult(2);

    this.acc.add(hunger);
    this.update();
    this.show();
  }
}
