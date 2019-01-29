import "p5/lib/addons/p5.dom.js";

import ml5 from "ml5";

import { Particle, JointSystem } from "./particle.js";
import { Field } from "./field.js";

let particles = [];
let paused = false;
let fps;

let field = [];
let xoff = 0;
let yoff = 0;
let zoff = 0;
export let rows, cols;

export const STEP = 20;
export const INC = 0.05;
export const KEYPOINT_NUM = 17;
export const VIDEO_SCALE = 4;

let capture;
let poseNet;
let jointSystem;

let s = sk => {
  sk.setup = () => {
    sk.createCanvas(window.innerWidth, window.innerHeight - 100);
    sk.blendMode(sk.ADD);
    capture = sk.createCapture(sk.VIDEO);
    capture.size(
      window.innerWidth / VIDEO_SCALE,
      window.innerHeight / VIDEO_SCALE
    );
    capture.hide();
    poseNet = ml5.poseNet(capture, {
      imgScaleFactor: 0.3,
      flipHorizontal: true,
      detectionType: "single"
    });

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

    // Particles
    for (var i = 0; i < 200; i++) {
      particles[i] = new Particle(
        sk.createVector(
          Math.floor(sk.width * Math.random()),
          Math.floor(sk.height * Math.random())
        )
      );
    }

    // PoseNet Keypoints
    jointSystem = new JointSystem();

    for (let i = 0; i < KEYPOINT_NUM; i++) {
      jointSystem.addBodyPart(sk.createVector(0, 0));
    }

    poseNet.on("pose", function(results) {
      if (results.length) {
        const { pose, skeleton } = results[0];
        jointSystem.updateBody(pose.keypoints);
        if (skeleton.length > 0) {
          const [leftShoulder, rightShoulder] = skeleton[0];
          sk.stroke(0, 255, 0, 10);
          sk.strokeWeight(1);
          sk.line(
            leftShoulder.position.x * VIDEO_SCALE,
            leftShoulder.position.y * VIDEO_SCALE,
            rightShoulder.position.x * VIDEO_SCALE,
            rightShoulder.position.y * VIDEO_SCALE
          );
        }
      }
    });

    // Framecount
    fps = sk.createP(Math.floor(sk.frameRate()));
  };

  sk.draw = () => {
    // image(capture, 0, 0)

    sk.background(0);
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

    // field.show()

    for (var i = 0; i < particles.length; i++) {
      if (!paused) {
        particles[i].follow(field);
        particles[i].avoid(jointSystem);
        particles[i].update();
        particles[i].edges();
      }
      particles[i].display();
    }

    jointSystem.displayJoints();

    fps.html(Math.floor(sk.frameRate()));
  };

  sk.mouseClicked = () => {
    // paused = !paused
    sk.background(0);
  };
};

export const P5 = new p5(s);
