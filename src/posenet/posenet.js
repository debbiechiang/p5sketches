import "p5/lib/addons/p5.dom.js";
import "../sass/index.scss";
import ml5 from "ml5";

import { Flock } from "./flock";

let flockSnapshot;

let flock;
let frames;

// videos
let capture;
let poseNet;
export let jointSystem;
const VIDEO_SCALE = 4;
const KEYPOINT_NUM = 10;
const NUMBER_OF_BIRDS = 200;

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
      imageScaleFactor: 0.5,
      flipHorizontal: true,
      detectionType: "single",
      multiplier: 0.5
    });

    // Flocking Controls
    flock = new Flock();
    for (var i = 0; i < NUMBER_OF_BIRDS; i++) {
      flock.addBird(_randomPosition());
    }

    // PoseNet
    jointSystem = new JointSystem();

    for (var i = 0; i < KEYPOINT_NUM; i++) {
      jointSystem.add(new Joint(sk.createVector()));
    }

    poseNet.on("pose", function(results) {
      if (results.length) {
        const { pose } = results[0];
        jointSystem.updateJoints(pose.keypoints.slice(0, KEYPOINT_NUM));
      }
    });

    frames = sk.createP(Math.floor(sk.frameRate()));
  };

  sk.draw = () => {
    sk.background("skyblue");
    // sk.image(capture, 0, 0);
    flockSnapshot = flock.takeSnapshot();
    flock.show({
      flock: flockSnapshot,
      predators: jointSystem.getJointsToBeAfraidOf()
    });
    jointSystem.show();
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
    // 0	nose
    // 1	leftEye
    // 2	rightEye
    // 3	leftEar
    // 4	rightEar
    // 5	leftShoulder
    // 6	rightShoulder
    // 7	leftElbow
    // 8	rightElbow
    // 9	leftWrist
    // 10	rightWrist
    // 11	leftHip
    // 12	rightHip
    // 13	leftKnee
    // 14	rightKnee
    // 15	leftAnkle
    // 16	rightAnkle
    return this.joints.slice(7, 10);
  }

  updateJoints(keypoints) {
    keypoints.forEach((el, i) => {
      this.joints[i].updatePosition(el);
    });
  }

  connect(arr) {
    return arr
      .reduce((acc, curr) => {
        if (this.joints[curr].visible) {
          return [
            ...acc,
            PN.vertex(this.joints[curr].pos.x, this.joints[curr].pos.y)
          ];
        }
        return acc;
      }, [])
      .join();
  }

  show() {
    this.joints.forEach(joint => joint.show());

    PN.strokeWeight(4);
    PN.stroke(15, 20);
    PN.noFill();
    PN.beginShape();
    // leftEar, leftEye, nose, rightEye, rightEar
    this.connect([3, 1, 0, 2, 4]);
    PN.endShape();
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
      PN.fill(255, 57, 104, 80);
      PN.noStroke();
      PN.ellipse(this.pos.x, this.pos.y, 20);
    }
  }
}
