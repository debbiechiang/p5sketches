import clone from "lodash/clone";
import { flockSnapshot } from "./flocking";

import { Bird } from "./bird";

export class Flock {
  constructor() {
    this.birds = [];
  }

  addBird(pos) {
    this.birds.push(new Bird(pos));
  }

  takeSnapshot() {
    return clone(this.birds);
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
