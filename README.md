# Graphics Workshop

_This repo contains a selection of projects designed to help you learn the basics of computer graphics. We'll be using code to render interactive two-dimensional and three-dimensional scenes._

_Each of these projects is based on graphics that are used in real-world applications. The code is designed to render in real time, taking advantage of GPU shaders. They all offer artistic freedom for those interested in aesthetics._

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

All of the projects will be developed in a harness that runs the graphics code in a web browser, using a technology called WebGL. This allows us to use modern web development tools to iterate quickly and easily share your work with others. However, all of the wrapper code has been provided for you, so you will not need to write JavaScript code directly.

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

If you are new to graphics or shading languages, I would recommend you try "quilt patterns" first. You should also complete "rasterization and shading" before starting the "contour sketching" and "ray tracing" projects.

### Quilt patterns

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

When you're done with the workshop, each project should render without errors or visual artifacts, and the results should be convincing.

<br>

## Deployment

This repository comes with a Continuous Integration workflow (through GitHub Actions) that compiles the code on the `main` branch, then pushes the built HTML to your repository's `gh-pages` branch. It lets you share a web link that updates whenever you push code changes.

![Screenshot of GitHub Pages setup](https://i.imgur.com/NufzXDw.png)

If this isn't enabled already, go to the "Pages" section under the "Settings" tab of your repository and set the deploy target to the `gh-pages` branch. Then, after the next `git push`, you will be see your work at `https://<YOUR_USERNAME>.github.io/graphics-workshop/`.

<br>

## Debugging tips

If you're stuck debugging OpenGL shaders, try setting `gl_FragColor` to the result of an intermediate variable and visually examining the output.

If there's a function you're confused about, you can search online through the Khronos documentation. You can also try reading [The Book of Shaders](https://thebookofshaders.com/), which is an excellent technical resource.

<br>

<sup>
All code is licensed under the <a href="LICENSE">MIT license</a>.
</sup>
