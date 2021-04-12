import { vec3 } from "gl-matrix";

/** @param canvas {HTMLCanvasElement} */
function createCamera(canvas, { eye, center }) {
  let tracking = false;
  let last = null;
  const camera = { eye, center };

  const begin = (event) => {
    tracking = true;
    last = [event.screenX / canvas.height, event.screenY / canvas.height];
  };

  const update = (event) => {
    if (!tracking) return;
    const [x, y] = [
      event.screenX / canvas.height,
      event.screenY / canvas.height,
    ];
    const [lastX, lastY] = last;
    last = [x, y];

    const v = vec3.sub([], camera.eye, camera.center);
    const r = vec3.len(v);
    let theta = Math.acos(v[1] / r);
    let phi = Math.atan2(v[2], v[0]);

    theta = Math.min(Math.max(theta - 5 * (y - lastY), 1e-8), Math.PI - 1e-8);
    phi += 5 * (x - lastX);
    vec3.set(
      camera.eye,
      r * Math.cos(phi) * Math.sin(theta),
      r * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta)
    );
    vec3.add(camera.eye, camera.eye, camera.center);
  };

  const end = () => {
    tracking = false;
  };

  canvas.addEventListener("mousedown", begin);
  canvas.addEventListener("mousemove", update);
  canvas.addEventListener("mouseup", end);

  canvas.addEventListener("touchstart", (event) => begin(event.touches[0]));
  canvas.addEventListener("touchmove", (event) => update(event.touches[0]));
  canvas.addEventListener("touchend", end);

  return camera;
}

export default createCamera;
