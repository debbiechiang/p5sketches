import clone from "lodash/clone";

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

  updatePositions(config) {
    return this.birds.map(bird => bird.behave(config));
  }

  show(config) {
    let accelerations = this.updatePositions(config);
    this.birds.map((bird, i) => {
      bird.edges();
      bird.acc.add(accelerations[i]);
      bird.update();
      bird.show();
    });
  }
}
