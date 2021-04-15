import Regl from "regl";
import Tweakpane from "tweakpane";
import { mat4 } from "gl-matrix";

import gengarUrl from "../models/gengar.obj.json?url";
import knotUrl from "../models/knot.obj.json?url";
import sphereUrl from "../models/sphere.obj.json?url";
import suzanneUrl from "../models/suzanne.obj.json?url";
import teapotUrl from "../models/teapot.obj.json?url";
import shaders from "./shaders";
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
    background: { r: 120, g: 178, b: 255 },
    antialias: true,
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
    [pane.addInput(params, "background"), ["raytracing"]],
    [pane.addInput(params, "antialias"), ["raytracing"]],
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

function toColor(color) {
  return [color.r / 255, color.g / 255, color.b / 255];
}

function compileShaders() {
  try {
    return {
      quilt: regl({
        frag: shaders.quiltFrag,
        vert: shaders.quiltVert,
      }),
      landscape: regl({
        frag: shaders.landscapeFrag,
        vert: shaders.landscapeVert,
      }),
      shading: regl({
        frag: shaders.shadingFrag,
        vert: shaders.shadingVert,
      }),
      contours: regl({
        frag: shaders.contoursFrag,
        vert: shaders.contoursVert,
      }),
      raytracing: regl({
        frag: shaders.raytracingFrag,
        vert: shaders.raytracingVert,
      }),
    };
  } catch {
    return null;
  }
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

const setup = {
  quilt: regl({
    uniforms: {
      seed: () => params.seed,
    },
  }),
  landscape: regl({
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
      kd: () => toColor(params.kd),
      ks: () => toColor(params.ks),
      shininess: () => params.shininess,
    },
    elements: () => mesh.elements,
  }),
  contours: regl({
    attributes: {
      position: () => mesh.vertices,
      normal: () => mesh.normals,
    },
    uniforms: {
      kd: () => toColor(params.kd),
      ks: () => toColor(params.ks),
      shininess: () => params.shininess,
    },
    elements: () => mesh.elements,
  }),
  raytracing: regl({
    uniforms: {
      background: () => toColor(params.background),
      antialias: () => params.antialias,
    },
  }),
};

let draw = compileShaders();

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
      setup[params.project](() => {
        if (draw) draw[params.project]();
      });
    });
  });
});

// Hot module reloading for shader code
if (import.meta.hot) {
  import.meta.hot.accept("./shaders.js", (module) => {
    Object.assign(shaders, module.default);
    draw = compileShaders();
  });
}
