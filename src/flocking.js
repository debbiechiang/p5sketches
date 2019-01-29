import "p5/lib/addons/p5.dom.js";
import "./sass/index.scss";
import ml5 from "ml5";

import { Flock } from "./flock";
import { Hawk } from "./hawk";

export let alignmentSlider;
export let cohesionSlider;
export let separationSlider;
export let hawk;
export let flockSnapshot;

let flock;
let frames;

let s = sk => {
  const _randomPosition = () =>
    sk.createVector(
      Math.floor(Math.random() * sk.width),
      Math.floor(Math.random() * sk.height)
    );

  sk.setup = () => {
    sk.createCanvas(window.innerWidth, window.innerHeight - 100);
    sk.ellipseMode(sk.CENTER);

    flock = new Flock();
    for (var i = 0; i < 100; i++) {
      flock.addBird(_randomPosition());
    }

    hawk = new Hawk(_randomPosition());

    alignmentSlider = sk.createSlider(0, 4, 1);
    sk.createP("Alignment");
    cohesionSlider = sk.createSlider(0, 4, 1);
    sk.createP("Cohesion");
    separationSlider = sk.createSlider(0, 10, 3);
    sk.createP("Separation");

    frames = sk.createP(Math.floor(sk.frameRate()));
  };

  sk.draw = () => {
    sk.background("skyblue");
    flockSnapshot = flock.takeSnapshot();

    flock.show();
    hawk.chase(flockSnapshot);
    frames.html(Math.floor(sk.frameRate()));
  };
};

export const FL = new p5(s);
