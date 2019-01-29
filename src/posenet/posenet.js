import "p5/lib/addons/p5.dom.js";
import "../sass/index.scss";
import ml5 from "ml5";

import { Flock } from "./flock";

export let alignmentSlider;
export let cohesionSlider;
export let separationSlider;
// export let predator;
let flockSnapshot;

let flock;
let frames;

// videos
let capture;
let poseNet;
export let jointSystem;
const VIDEO_SCALE = 5;
const KEYPOINT_NUM = 17;

let s = sk => {
  const _randomPosition = () =>
    sk.createVector(
      Math.floor(Math.random() * sk.width),
      Math.floor(Math.random() * sk.height)
    );

  sk.setup = () => {
    sk.createCanvas(window.innerWidth, window.innerHeight - 100);

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

    alignmentSlider = sk.createSlider(0, 4, 1);
    sk.createP("Alignment");
    cohesionSlider = sk.createSlider(0, 4, 1);
    sk.createP("Cohesion");
    separationSlider = sk.createSlider(0, 10, 3);
    sk.createP("Separation");

    // Flocking Controls
    flock = new Flock();
    for (var i = 0; i < 100; i++) {
      flock.addBird(_randomPosition());
    }

    // PoseNet
    jointSystem = new JointSystem();

    for (var i = 0; i < KEYPOINT_NUM; i++) {
      jointSystem.add(new Joint(sk.createVector()));
    }

    poseNet.on("pose", function(results) {
      if (results.length) {
        const { pose, skeleton } = results[0];
        jointSystem.updateJoints(pose.keypoints);
      }
    });
    frames = sk.createP(Math.floor(sk.frameRate()));
  };

  sk.draw = () => {
    sk.background("skyblue");
    flockSnapshot = flock.takeSnapshot();
    flock.show({
      flock: flockSnapshot,
      predators: jointSystem.getJointsToBeAfraidOf()
    });
    // flock.flee(jointSystem.getJointsToBeAfraidOf());
    // predator.chase(flockSnapshot);
    // jointSystem.show();
    frames.html(Math.floor(sk.frameRate()));
  };
};

export const PN = new p5(s);

class JointSystem {
  constructor() {
    this.joints = [];
  }

  add(joint) {
    this.joints.push(joint);
  }

  getJointsToBeAfraidOf() {
    // return this.joints.slice(9, 11); // 9: leftWrist, 10: rightWrist
    return this.joints.slice(1, 3); // leftEye, rightEye
  }

  updateJoints(keypoints) {
    keypoints.forEach((el, i) => {
      this.joints[i].updatePosition(el);
    });
  }

  show() {
    // this.joints.forEach(joint => joint.show());
    this.getJointsToBeAfraidOf().forEach(joint => joint.show());
  }
}

class Joint {
  constructor(position) {
    this.pos = position.copy();
    this.vec = PN.createVector();
    this.acc = PN.createVector();

    this.confidenceThreshold = 0.5;
    this.visible = false;
  }

  updatePosition(bodyPart) {
    // if (bodyPart.part === "rightWrist" && bodyPart.score > 0.5) {
    //   console.log(bodyPart);
    // }
    if (!this.part) {
      this.part = bodyPart.part;
    }
    if (bodyPart.score > this.confidenceThreshold) {
      this.pos.x = bodyPart.position.x * VIDEO_SCALE;
      this.pos.y = bodyPart.position.y * VIDEO_SCALE;
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  show() {
    if (this.visible) {
      PN.fill(255, 57, 104);
      PN.noStroke();
      PN.ellipse(this.pos.x, this.pos.y, 10);
    }
  }
}
