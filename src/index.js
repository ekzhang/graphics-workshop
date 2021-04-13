import Regl from "regl";
import Tweakpane from "tweakpane";
import { mat4 } from "gl-matrix";

import quiltFrag from "../shaders/quilt.frag.glsl?raw";
import quiltVert from "../shaders/quilt.vert.glsl?raw";
import landscapeFrag from "../shaders/landscape.frag.glsl?raw";
import landscapeVert from "../shaders/landscape.vert.glsl?raw";
import createCamera from "./camera";

const regl = Regl();

const camera = createCamera(document.getElementsByTagName("canvas")[0], {
  eye: [1.7, 1.5, 2.9],
  center: [0, 0, 0],
});

const params = initPane();

function initPane() {
  const pane = new Tweakpane({ title: "Controls" });
  const params = {
    project: "quilt",
    seed: 0,
    scale: 20,
    mesh: "...",
    fps: 0,
  };

  pane.addInput(params, "project", {
    options: {
      "Quilt patterns": "quilt",
      "Procedural landscapes": "landscape",
      "Rasterization and shading": "shading",
      "Contour sketching": "contours",
      "Ray tracing": "raytracing",
    },
  });

  const inputs = [
    [pane.addInput(params, "seed", { min: 0, max: 1 }), ["quilt", "landscape"]],
    [pane.addInput(params, "scale", { min: 10, max: 30 }), ["landscape"]],
    [
      pane.addInput(params, "mesh", {
        options: {
          "Stanford Bunny": "...",
          "Utah Teapot": "...1",
          "Trefoil Knot": "...2",
          Dragon: "...3",
          Suzanne: "...4",
        },
      }),
      ["shading", "contours"],
    ],
  ];

  pane.addMonitor(params, "fps");
  pane.addSeparator();
  pane.addButton({ title: "Instructions" }).on("click", () => {
    const a = document.createElement("a");
    a.href = "https://github.com/ekzhang/graphics-workshop#readme";
    a.target = "_blank";
    a.click();
  });

  const saved = localStorage.getItem("graphics-workshop");
  if (saved) {
    try {
      pane.importPreset(JSON.parse(saved));
    } catch (error) {
      console.warn(`Error loading saved preset: ${error}`);
    }
  }

  const update = () => {
    const data = pane.exportPreset();
    localStorage.setItem("graphics-workshop", JSON.stringify(data));
    for (const [input, projects] of inputs) {
      input.hidden = !projects.includes(params.project);
    }
  };

  update();
  pane.on("change", update);

  return params;
}

const common = regl({
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
  uniforms: {
    view: () => mat4.lookAt([], camera.eye, camera.center, [0, 1, 0]),
    resolution: ({ drawingBufferWidth, drawingBufferHeight }) => [
      drawingBufferWidth,
      drawingBufferHeight,
    ],
    time: regl.context("time"),
  },
});

const draw = {
  quilt: regl({
    frag: quiltFrag,
    vert: quiltVert,
    uniforms: {
      seed: () => params.seed,
    },
  }),
  landscape: regl({
    frag: landscapeFrag,
    vert: landscapeVert,
    uniforms: {
      seed: () => params.seed,
      scale: () => params.scale,
    },
  }),
  shading: regl({
    frag: quiltFrag,
    vert: quiltVert,
  }),
  contours: regl({
    frag: quiltFrag,
    vert: quiltVert,
  }),
  raytracing: regl({
    frag: quiltFrag,
    vert: quiltVert,
  }),
};

const frameTimes = [...Array(60)].fill(0);
regl.frame(() => {
  const lastTime = frameTimes.shift();
  const time = performance.now();
  frameTimes.push(time);
  if (lastTime !== 0) {
    params.fps = 1000 / ((time - lastTime) / frameTimes.length);
  }
  common(() => {
    regl.clear({ color: [0, 0, 0, 1] });
    draw[params.project]();
    const endTime = performance.now();
  });
});
