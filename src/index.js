import Regl from "regl";
import Tweakpane from "tweakpane";
import { mat4 } from "gl-matrix";

import gengarUrl from "../models/gengar.obj.json?url";
import knotUrl from "../models/knot.obj.json?url";
import sphereUrl from "../models/sphere.obj.json?url";
import suzanneUrl from "../models/suzanne.obj.json?url";
import teapotUrl from "../models/teapot.obj.json?url";
import quiltFrag from "../shaders/quilt.frag.glsl?raw";
import quiltVert from "../shaders/quilt.vert.glsl?raw";
import contoursFrag from "../shaders/contours.frag.glsl?raw";
import contoursVert from "../shaders/contours.vert.glsl?raw";
import landscapeFrag from "../shaders/landscape.frag.glsl?raw";
import landscapeVert from "../shaders/landscape.vert.glsl?raw";
import shadingFrag from "../shaders/shading.frag.glsl?raw";
import shadingVert from "../shaders/shading.vert.glsl?raw";
import createCamera from "./camera";

const regl = Regl({ extensions: ["OES_standard_derivatives"] });

const camera = createCamera(document.getElementsByTagName("canvas")[0], {
  eye: [1.0, 0.0, 5.2],
  center: [0, 0, 0],
});

const params = initPane();
let mesh = null;

function initPane() {
  const pane = new Tweakpane({ title: "Controls" });
  const params = {
    project: "quilt",
    seed: 0,
    scale: 20,
    mesh: teapotUrl,
    fps: 0,
    kd: { r: 95, g: 230, b: 213 },
    ks: { r: 240, g: 240, b: 240 },
    shininess: 5.0,
  };

  pane.addInput(params, "project", {
    options: {
      "Quilt patterns": "quilt",
      "Procedural landscapes": "landscape",
      "Rasterization and shading": "shading",
      "Stylized rendering": "contours",
      "Ray tracing": "raytracing",
    },
  });

  const inputs = [
    [pane.addInput(params, "seed", { min: 0, max: 1 }), ["quilt", "landscape"]],
    [pane.addInput(params, "scale", { min: 10, max: 30 }), ["landscape"]],
    [
      pane
        .addInput(params, "mesh", {
          options: {
            Gengar: gengarUrl,
            Knot: knotUrl,
            Sphere: sphereUrl,
            Suzanne: suzanneUrl,
            Teapot: teapotUrl,
          },
        })
        .on("change", (event) => updateMesh(event.value)),
      ["shading", "contours"],
    ],
    [pane.addInput(params, "kd"), ["shading", "contours"]],
    [pane.addInput(params, "ks"), ["shading", "contours"]],
    [
      pane.addInput(params, "shininess", { min: 1, max: 9 }),
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

async function updateMesh(path) {
  const resp = await fetch(path);
  mesh = await resp.json();
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
    projection: ({ drawingBufferWidth, drawingBufferHeight }) => {
      const aspectRatio = drawingBufferWidth / drawingBufferHeight;
      return mat4.perspective([], Math.PI / 6, aspectRatio, 0.01, 100);
    },
    eye: () => camera.eye,
    center: () => camera.center,
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
    attributes: {
      position: () => mesh.vertices,
      normal: () => mesh.normals,
    },
    uniforms: {
      kd: () => [params.kd.r / 255, params.kd.g / 255, params.kd.b / 255],
      ks: () => [params.ks.r / 255, params.ks.g / 255, params.ks.b / 255],
      shininess: () => params.shininess,
    },
    elements: () => mesh.elements,
    frag: shadingFrag,
    vert: shadingVert,
  }),
  contours: regl({
    attributes: {
      position: () => mesh.vertices,
      normal: () => mesh.normals,
    },
    uniforms: {
      kd: () => [params.kd.r / 255, params.kd.g / 255, params.kd.b / 255],
      ks: () => [params.ks.r / 255, params.ks.g / 255, params.ks.b / 255],
      shininess: () => params.shininess,
    },
    elements: () => mesh.elements,
    frag: contoursFrag,
    vert: contoursVert,
  }),
  raytracing: regl({
    frag: quiltFrag,
    vert: quiltVert,
  }),
};

updateMesh(params.mesh).then(() => {
  const frameTimes = [...Array(60)].fill(0);
  regl.frame(() => {
    const lastTime = frameTimes.shift();
    const time = performance.now();
    frameTimes.push(time);
    if (lastTime !== 0) {
      params.fps = 1000 / ((time - lastTime) / frameTimes.length);
    }
    common(() => {
      if (params.project === "contours") regl.clear({ color: [1, 1, 1, 1] });
      else regl.clear({ color: [0, 0, 0, 1] });
      draw[params.project]();
      const endTime = performance.now();
    });
  });
});
