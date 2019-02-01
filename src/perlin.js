import "p5/lib/addons/p5.dom.js";
import { ParticleList, Particle } from "./particle.js";
import { Field } from "./field.js";

let particles;
let paused = false;
let fps;

let field = [];
let xoff = 0;
let yoff = 0;
let zoff = 0;
export let rows, cols;

export const STEP = 40;
export const INC = 0.05;
export const KEYPOINT_NUM = 17;
export const VIDEO_SCALE = 4;

let s = sk => {
  sk.toggleFlow = true;
  sk.setup = () => {
    sk.createCanvas(window.innerWidth, window.innerHeight);
    // sk.blendMode(sk.ADD);

    // Perlin noise field
    zoff = 0;
    rows = Math.floor(sk.height / STEP) + 1;
    cols = Math.floor(sk.width / STEP) + 1;

    field = new Field();
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        field.addPoint(sk.createVector(x * STEP, y * STEP, 0));
      }
    }

    particles = new ParticleList();
    particles.attach(field);

    // Particles
    for (var i = 0; i < 200; i++) {
      particles.addParticle(
        sk.createVector(
          Math.floor(sk.width * Math.random()),
          Math.floor(sk.height * Math.random())
        )
      );
    }

    // Framecount
    fps = sk.createP(Math.floor(sk.frameRate()));
  };

  sk.draw = () => {
    sk.background(0);

    // Refactor this into a 2D matrix
    yoff = 0;
    for (var y = 0; y < rows; y++) {
      xoff = 0;
      for (var x = 0; x < cols; x++) {
        xoff += INC;
        var index = y * cols + x;
        var angle = p5.Vector.fromAngle(
          sk.noise(xoff, yoff, zoff) * 2 * Math.PI
        );
        field.updateAngle(index, angle);
      }
      yoff += INC;
      zoff += 0.0007;
    }
    if (sk.toggleFlow) {
      // Smoky view
      sk.blendMode(sk.ADD);
      particles.show(true);
    } else {
      // Perlin field view
      sk.blendMode(sk.BLEND);
      field.show();
      // particles.show(false);
    }

    fps.html(Math.floor(sk.frameRate()));
  };

  sk.mouseClicked = () => {
    sk.toggleFlow = !sk.toggleFlow;
  };
};

export const P5 = new p5(s);
