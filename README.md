# Graphics Workshop

_This repo contains a selection of projects designed to help you learn the basics of computer graphics. We'll be using shaders to render interactive two-dimensional and three-dimensional scenes._

_Each of these projects aims to introduce a graphics technique that is extensively used in real-world applications. The code is designed to run in real time on modern GPUs. The projects offer a large amount of artistic freedom for those interested in creating an aesthetically pleasing result._

<br>

## Contents

- [**Getting started**](#getting-started)
- [**Projects**](#projects) — Introduction to each of the projects
  - [**Quilt patterns**](#quilt-patterns)
  - [**Procedural landscapes**](#procedural-landscapes)
  - [**Rasterization and shading**](#rasterization-and-shading)
  - [**Contour sketching**](#contour-sketching)
  - [**Ray tracing**](#ray-tracing)
- [**Workflow**](#workflow) — Recommended way to work through the workshop
- [**Deployment**](#deployment) — Explanation of how automated deployment is set up
- [**Debugging tips**](#debugging-tips)

<br>

## Getting started

This workshop covers fragment shaders ([GLSL](https://en.wikipedia.org/wiki/OpenGL_Shading_Language)), procedural texture generation, rasterization, lighting calculations, and real-time ray tracing.

All of the projects will be developed in a harness that runs the graphics code in a web browser, using a technology called WebGL. This allows us to use modern web development tools to iterate quickly and easily share your work with others. However, you will not need to write JavaScript code yourself, as all of the wrapper code has been provided for you.

To get started, **make sure that you have [Node.js v14](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) installed**. **Fork this repository**, and then **clone it to your computer**. Then, **run the following commands**:

```
$ npm install
...
added 16 packages from 57 contributors and audited 16 packages in 1.459s

3 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities


$ npm run dev

  vite v2.1.5 dev server running at:

  > Local:    http://localhost:3000/
  > Network:  http://10.250.14.217:3000/

  ready in 555ms.
```

_Explanation:_ The first command installs dependencies in the `node_modules/` folder, and the second command starts the development server. You can now visit `http://localhost:3000/` in your browser. Whenever you change a file and save it, the website will automatically update.

<br>

## Projects

Here is an introduction to each of the projects.

If you are new to graphics or shading languages, I would recommend trying the "quilt patterns" project first. You should also complete "rasterization and shading" before starting the "contour sketching" and "ray tracing" projects.

### Quilt patterns

<p align="center">
<a href="#deployment">
<img src="https://i.imgur.com/5QsIZUc.png" width="600">
</a>
</p>

This project shows how you can use GPU shaders to render interesting, procedural patterns on a 2D grid. It also serves as a hand-on introduction to the wonderful yet frightening world of GPU shaders.

Before starting, make sure that you are able to open the development server. You should see an oscillating color gradient in your web browser.

1. Look at the provided skeleton code. This is known as a _fragment shader_, and it runs on the GPU. The fragment shader is run on every pixel of the screen, and the pixel number is passed into the code as `gl_FragCoord.xy`. The code outputs by assigning to `gl_FragColor`, which is the color at that pixel. It is a `vec4` or 4-dimensional vector with red, green, blue, and transparency channels.
2. Make sure you understand the starter code before continuing. What do the `coord` and `color` variables represent? What do the `abs()` and `sin()` functions do?
3. Try uncommenting the sections of the starter code, _one at a time_. Observe the change in output on your screen. Make sure that you understand what each block of code is doing before proceeding to the next one! When you're done, you should now see a moving black-and-white grid pattern.
4. **Task 1:** Make the quilt pattern more colorful! Modify the code so that instead of generating random greyscale colors with the variable `c`, it generates random RGB colors instead.
5. **Task 2:** Right now, there's just a single pattern that's flown through, but there could be many more. Find a way to use the `seed` variable, which you can modify using the "Parameters" panel at the top right of the screen, to change the shape of the pattern. (_Hint:_ You'll probably want to adjust the condition `if (mod(2.0 * cell.x + cell.y, 5.0) == 1.0)` to change the quilt's geometry.)

Feel free to experiment and share whatever patterns you find most aesthetically pleasing!

_Project skeleton is located in `shaders/quilt.frag.glsl`._

### Procedural landscapes

_Project skeleton is located in `shaders/landscape.frag.glsl`._

### Rasterization and shading

_Project skeleton is located in `shaders/shading.frag.glsl`._

### Contour sketching

_Project skeleton is located in `shaders/contours.frag.glsl`._

### Ray tracing

_Project skeleton is located in `shaders/raytracing.frag.glsl`._

<br>

## Workflow

Open your code editor in one window, and **keep the website on the side** while you're writing your shader code. It's extremely useful to see what happens to the output in real time as you edit your code. Your browser should automatically reload (thanks to [Vite](https://vitejs.dev/)) whenever you change a file and save it.

The project has a [Tweakpane](https://cocopon.github.io/tweakpane/) component in the top-right corner of the screen. You can use this to change what project is being displayed and modify parameters for that display. It persists settings when you refresh your browser.

For 3D projects, the main `<canvas>` element has an event listener for mouse and touch events, which should allow you to move the camera by clicking and dragging. Data is passed in through the appropriate uniform variables.

When you're done with the workshop, each project should render without errors or visual artifacts, and the results should be convincing.

<br>

## Deployment

This repository comes with a Continuous Integration workflow (through GitHub Actions) that compiles the code on the `main` branch, then pushes the built HTML to your repository's `gh-pages` branch. It lets you share a web link that updates whenever you push code changes.

<p align="center">
<a href="#deployment">
<img src="https://i.imgur.com/NufzXDw.png" width="600">
</a>
</p>

If this isn't enabled already, go to the "Pages" section under the "Settings" tab of your repository and set the deploy target to the `gh-pages` branch. Then, after the next `git push`, you will be see your work at `https://<YOUR_USERNAME>.github.io/graphics-workshop/`.

<br>

## Debugging tips

If you're stuck debugging OpenGL shaders, try setting `gl_FragColor` to the result of an intermediate variable and visually examining the output.

If there's a function you're confused about, you can search online through the Khronos documentation. You can also try reading [The Book of Shaders](https://thebookofshaders.com/), which is an excellent technical resource.

<br>

<sup>
All code is licensed under the <a href="LICENSE">MIT license</a>.
</sup>
