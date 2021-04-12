import Regl from "regl";
import Tweakpane from "tweakpane";
import { mat4 } from "gl-matrix";

import fragmentShader from "./frag.glsl?raw";
import vertexShader from "./vert.glsl?raw";
import createCamera from "./camera";

const regl = Regl();

const camera = createCamera(document.getElementsByTagName("canvas")[0], {
  eye: [1.7, 1.5, 2.9],
  center: [0, 0, 0],
});

const params = initPane();

function initPane() {
  const pane = new Tweakpane({ title: "Parameters" });
  const params = {
    scale: 15,
    grid: 20,
    example: 2,
    mode: 3,
  };

  pane.addInput(params, "scale", { min: 0, max: 50 });
  pane.addInput(params, "grid", { min: 5, max: 40, step: 1 });
  pane.addInput(params, "example", { options: { torus: 1, csg: 2 } });
  pane.addInput(params, "mode", {
    options: { shading: 3, curvature: 2, normal: 1 },
  });

  const saved = localStorage.getItem("graphics-workshop");
  if (saved) {
    try {
      pane.importPreset(JSON.parse(saved));
    } catch (error) {
      console.warn(`Error loading saved preset: ${error}`);
    }
  }

  pane.on("change", () => {
    const data = pane.exportPreset();
    localStorage.setItem("graphics-workshop", JSON.stringify(data));
  });

  return params;
}

const common = regl({
  uniforms: {
    view: () => mat4.lookAt([], camera.eye, camera.center, [0, 1, 0]),
    resolution: ({ drawingBufferWidth, drawingBufferHeight }) => [
      drawingBufferWidth,
      drawingBufferHeight,
    ],
    time: regl.context("time"),
  },
});

const draw = regl({
  frag: fragmentShader,
  vert: vertexShader,
  attributes: {
    position: [
      [-1, 1],
      [-1, -1],
      [1, 1],
      [1, -1],
    ],
  },
  elements: [
    [0, 1, 2],
    [2, 1, 3],
  ],
});

regl.frame(() => {
  common(() => {
    regl.clear({ color: [0, 0, 0, 1] });
    draw();
  });
});
