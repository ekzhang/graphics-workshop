import{s as M,l as j,a as _,b as q,R as L,t as I,c as N,p as S}from"./vendor.b3c0b267.js";const E=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const m of e.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&c(m)}).observe(document,{childList:!0,subtree:!0});function a(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerpolicy&&(e.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?e.credentials="include":t.crossorigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function c(t){if(t.ep)return;t.ep=!0;const e=a(t);fetch(t.href,e)}};E();var R="/graphics-workshop/assets/gengar.obj.372efedb.json",A="/graphics-workshop/assets/knot.obj.937920cf.json",G="/graphics-workshop/assets/sphere.obj.4e2aaece.json",O="/graphics-workshop/assets/suzanne.obj.c35b0f43.json",k="/graphics-workshop/assets/teapot.obj.40bf042c.json",V=`precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform float seed;

void main() {
    vec2 coord = gl_FragCoord.xy / resolution;

    // Output RGB color in range from 0.0 to 1.0
    vec3 color = vec3(coord.x, coord.y, 0.0);
    color.z += abs(sin(time));

    // 1. Uncomment these lines to draw triangles
    // vec2 squareCoord = 20.0 * gl_FragCoord.xy / resolution.y + vec2(time);
    // vec2 loc = fract(squareCoord);
    // color = vec3(smoothstep(-0.05, 0.05, loc.y - loc.x));

    // 2. Uncomment these lines to invert some of the triangles
    // vec2 cell = squareCoord - loc;
    // if (mod(2.0 * cell.x + cell.y, 5.0) == 1.0) {
    //     color = 1.0 - color;
    // }

    // 3. Uncomment these lines to produce interesting colors
    // float c = mod(3.0 * cell.x + 2.0 * cell.y, 7.0) / 7.0;
    // color = 1.0 - (1.0 - color) * vec3(c, c, c);

    // 4. Uncomment to lighten the colors
    // color = sqrt(color);

    gl_FragColor = vec4(color, 1.0);
}
`,H=`attribute vec2 position;

void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`,T=`#extension GL_OES_standard_derivatives : enable
precision mediump float;

uniform vec3 kd; // diffuse coefficient
uniform vec3 ks; // specular coefficient
uniform float shininess; // shininess parameter
uniform vec3 eye; // position of camera
uniform vec2 resolution;

varying vec3 vPosition;
varying vec3 vNormal;

vec3 illuminate(vec3 lightPosition) {
    vec3 wi = lightPosition - vPosition;
    float intensity = 1.0 / dot(wi, wi); // inverse-square law
    vec3 diffuse = kd * max(dot(normalize(wi), normalize(vNormal)), 0.0);

    vec3 specular = vec3(0.0); // Change me!

    return intensity * (diffuse + specular);
}

void main() {
    vec2 coord = gl_FragCoord.xy / resolution.y;

    // We add two lights to the scene. Feel free to change these
    // values, or add more lights at different positions!
    vec3 color = vec3(0.0);
    color += 40.0 * illuminate(vec3(0.0, 3.0, 9.0));
    color += 20.0 * illuminate(vec3(0.0, 10.0, 2.0));

    // Stylized shading
    float value = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
    color = vec3(0.0);
    vec3 darkblue = vec3(0.2, 0.3, 0.4);
    vec3 blue = vec3(0.5, 0.65, 0.8);
    vec3 dots = length(fract(coord * 80.0) - 0.5) < sqrt(0.5 - value) ? blue : vec3(1.0);
    color = mix(color, darkblue, step(0.2, value));
    color = mix(color, blue, step(0.25, value));
    color = mix(color, dots, step(0.35, value));
    color = mix(color, vec3(1.0), step(0.45, value));

    // Edge estimation
    float vn = abs(dot(normalize(vNormal), normalize(vPosition - eye)));
    float vnGradient = fwidth(vn);
    float edgeFactor = smoothstep(1.25, 0.75, vn / vnGradient / 5.0);
    color = mix(color, vec3(0.1), edgeFactor);

    gl_FragColor = vec4(color, 1.0);
}
`,U=`attribute vec3 position;
attribute vec3 normal;

uniform mat4 view;
uniform mat4 projection;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vPosition = position;
    vNormal = normal;
    gl_Position = projection * view * vec4(position, 1.0);
}
`,D=`precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform float seed;
uniform float scale;

float snoise(vec2);

void main() {
    vec2 coord = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;
    coord *= scale;

    // "Organic" simplex noise values in range [-1, 1]
    float noise1 = snoise(vec2(seed * 10000.0, 0) + coord);
    float noise2 = snoise(vec2(seed * 10000.0, 1e3) + coord / 2.0);
    float noise4 = snoise(vec2(seed * 10000.0, 2e3) + coord / 4.0);
    float noise8 = snoise(vec2(seed * 10000.0, 3e3) + coord / 8.0);

    // Display various scales of simplex noise
    vec3 color = 0.5 + 0.5 * vec3(noise1, noise2, noise8);

    // 1. Fractal noise scales: uncomment each line, one at a time
    // color = vec3(0.5);
    // color += 0.5 * noise8;
    // color += 0.25 * noise4;
    // color += 0.1 * noise2;
    // color += 0.05 * noise1;

    // 2. Generate "water" and "land"
    // float elevation = 0.3 - 0.2 * max(length(coord) - 20.0, 0.0);
    // elevation += noise8 + noise4 * 0.2 + noise2 * 0.1 + noise1 * 0.05;
    // float landFactor = smoothstep(-0.05, 0.05, elevation);
    // float deepSea = smoothstep(-0.1, -0.3, elevation);
    // float deepColor = 0.8 - 0.3 * smoothstep(-0.2, -0.5, elevation);
    // vec3 waterColor = mix(vec3(0.2, 0.2, 0.8), vec3(0.0, 0.0, deepColor), deepSea);
    // color = mix(waterColor, vec3(0.0, 0.6, 0.0), landFactor);

    // 3. Generate "mountains" and "beaches" based on elevation
    // float mountainFactor = (elevation - 1.0) * 5.0;
    // vec3 mountainColor = vec3(0.12, 0.15, 0.1);
    // mountainColor = mix(mountainColor, vec3(0.4, 0.32, 0.4), smoothstep(0.7, 0.8, mountainFactor));
    // mountainColor = mix(mountainColor, vec3(0.9, 0.9, 0.9), smoothstep(1.1, 1.15, mountainFactor));
    // vec3 landColor = mix(vec3(0.0, 0.6, 0.0), mountainColor, smoothstep(0.0, 0.1, mountainFactor));
    // float grassFactor = smoothstep(0.75, 0.7, elevation);
    // landColor = mix(landColor, vec3(0.2, 0.8, 0.0), grassFactor);
    // float beachFactor = smoothstep(0.5, 0.4, elevation);
    // landColor = mix(landColor, vec3(0.9, 0.9, 0.5), beachFactor);
    // color = mix(waterColor, landColor, landFactor);

    gl_FragColor = vec4(color, 1.0);
}



//
// Everything below this line is an implementation of 2D simplex
// noise in GLSL. You shouldn't modify any code below.
//
// If you're curious, see the following paper:
// https://weber.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
//

// Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}
`,Y=`attribute vec2 position;

void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`,B=`precision mediump float;

uniform vec3 kd; // diffuse coefficient
uniform vec3 ks; // specular coefficient
uniform float shininess; // shininess parameter
uniform vec3 eye; // position of camera

varying vec3 vPosition;
varying vec3 vNormal;

vec3 illuminate(vec3 lightPosition) {
    vec3 wi = lightPosition - vPosition;
    float intensity = 1.0 / dot(wi, wi); // inverse-square law
    vec3 diffuse = kd * max(dot(normalize(wi), normalize(vNormal)), 0.0);

    // 1. Your specular highlights code goes here!
    //
    // This is the outline of what your program should do:
    //  - Compute the unit vector wo from the current position to the
    //    camera, by subtracting vPosition from eye and calling
    //    normalize().
    //  - Compute the reflected incident light vector r, by reflecting
    //    normalize(wi) about normalize(vNormal) using the reflect()
    //    function.
    //  - Take the dot product of r and wo, then raise this to the
    //    exponent of the shininess coefficient. (Make sure your
    //    result is not negative!)
    //  - Multiply the result by specular coefficient ks.

    vec3 specular = vec3(0.0); // Change me!

    return intensity * (diffuse + specular);
}

void main() {
    // We add two lights to the scene. Feel free to change these
    // values, or add more lights at different positions!
    vec3 color = vec3(0.0);
    color += 40.0 * illuminate(vec3(0.0, 3.0, 9.0));
    color += 20.0 * illuminate(vec3(0.0, 10.0, 2.0));
    gl_FragColor = vec4(color, 1.0);
}
`,X=`attribute vec3 position;
attribute vec3 normal;

uniform mat4 view;
uniform mat4 projection;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vPosition = position;
    vNormal = normal;
    gl_Position = projection * view * vec4(position, 1.0);
}
`,J=`precision mediump float;

const float epsilon = 0.001;
const float inf = 1e9;

uniform vec2 resolution;
uniform vec3 eye;
uniform vec3 center;
uniform vec3 background;
uniform bool antialias;

struct Ray {
    vec3 origin;
    vec3 dir;
};

struct Material {
    vec3 kd;
    vec3 ks;
    bool metal;
    bool checker;
};

struct Hit {
    float time;
    vec3 normal;
    Material material;
};

// Trace a ray to a sphere, using high school geometry
void sphere(inout Hit h, Ray r, vec4 s, Material m) {
    // Rescale to unit sphere at the origin
    r.origin = (r.origin - s.xyz) / s.w;
    r.dir = r.dir / s.w;

    // Quadratic formula
    float a = dot(r.dir, r.dir);
    float b = dot(r.dir, r.origin);
    float c = dot(r.origin, r.origin) - 1.0;

    float d = b * b - a * c;
    if (d < 0.0) {
        return;
    }

    d = sqrt(d);
    float t = (-b - d) / a;
    if (t < epsilon) {
        t = (-b + d) / a;
    }

    if (t >= epsilon && t < h.time) {
        h.time = t;
        h.normal = normalize(r.origin + r.dir * t);
        h.material = m;
    }
}

void circle(inout Hit h, Ray r, float y, float radius, Material m) {
    float t = (y - r.origin.y) / r.dir.y;
    if (t >= epsilon && t < h.time
            && length(r.origin + t * r.dir) < radius) {
        h.time = t;
        h.normal = vec3(0.0, 1.0, 0.0);
        h.material = m;
    }
}

// Intersect a ray with the scene
Hit intersect(Ray r) {
    Hit h = Hit(inf, vec3(0.0), Material(vec3(0.0), vec3(0.0), false, false));
    sphere(h, r, vec4(0.8, -1.0, -10.0, 1.0),
        Material(vec3(0.4, 0.2, 0.8), vec3(0.8), false, false));
    sphere(h, r, vec4(-2.5, -0.2, -12.0, 1.8),
        Material(vec3(1.0, 0.4, 0.2), vec3(0.8), true, false));
    sphere(h, r, vec4(-3.5, -1.2, -6.0, 0.8),
        Material(vec3(0.2, 0.6, 0.3), vec3(0.8), false, false));
    circle(h, r, -2.0, 50.0,
        Material(vec3(0.8, 0.8, 0.8), vec3(0.0), false, true));
    return h;
}

// Compute lighting from one light
vec3 illuminate(vec3 lightPosition, vec3 pos, vec3 wo, Hit h) {
    vec3 wi = lightPosition - pos;
    vec3 kd = h.material.kd;
    if (h.material.checker) {
        // Checkerboard pattern for the floor
        vec2 coords = floor(pos.xz);
        kd = vec3(mod(coords.x + coords.y, 2.0) * 0.8 + 0.2);
    }
    float intensity = 1.0 / dot(wi, wi); // inverse-square law
    vec3 diffuse = kd * max(dot(normalize(wi), h.normal), 0.0);

    // Non-dielectric materials have tinted reflections
    vec3 ks = h.material.metal ? h.material.kd : h.material.ks;
    vec3 r = -reflect(normalize(wi), h.normal);
    vec3 specular = ks * pow(max(dot(r, wo), 0.0), 10.0);

    return intensity * (diffuse + specular);
}

// Compute total lighting at a given point
vec3 calcLighting(vec3 pos, vec3 wo, Hit h) {
    vec3 color = vec3(0.0);
    color += 100.0 * illuminate(vec3(-3.0, 10.0, 0.0), pos, wo, h);
    color += 200000.0 * illuminate(vec3(0.0, 1000.0, 0.0), pos, wo, h);
    return color;
}

// Trace a ray, returning an RGB color based on its value
vec3 trace(Ray r) {
    Hit h = intersect(r);
    if (h.time != inf) {
        vec3 pos = r.origin + h.time * r.dir;
        vec3 color = calcLighting(pos, -r.dir, h);
        if (h.material.metal) {
            vec3 dir = reflect(r.dir, h.normal);
            Hit h2 = intersect(Ray(pos, dir));
            if (h2.time < inf) {
                vec3 pos2 = pos + h2.time * dir;
                color += 0.2 * h.material.ks * calcLighting(pos2, -dir, h2);
            } else {
                color += 0.2 * h.material.ks * background;
            }
        }
        return color;
    }
    return background;
}

vec3 tracePixel(vec2 coord) {
    // Pixel coordinates, normalized so that p.y in range [-1, 1]
    vec2 p = (2.0 * coord - resolution) / resolution.y;

    // View ray from camera
    vec3 ww = normalize(center - eye);
    vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
    vec3 vv = normalize(cross(uu, ww));
    // (Note: cot(pi/12) = 2 + sqrt(3) = 3.73)
    vec3 dir = normalize(p.x * uu + p.y * vv + 3.73 * ww);

    return trace(Ray(eye, dir));
}

void main() {
    vec3 color = vec3(0.0);

    if (antialias) {
        // Anti-aliasing by supersampling multiple rays
        color += 0.25 * tracePixel(gl_FragCoord.xy + vec2(-0.25, -0.25));
        color += 0.25 * tracePixel(gl_FragCoord.xy + vec2(-0.25, +0.25));
        color += 0.25 * tracePixel(gl_FragCoord.xy + vec2(+0.25, -0.25));
        color += 0.25 * tracePixel(gl_FragCoord.xy + vec2(+0.25, +0.25));
    } else {
        color += tracePixel(gl_FragCoord.xy);
    }

    gl_FragColor = vec4(color, 1.0);
}
`,K=`attribute vec2 position;

void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;const s={quiltFrag:V,quiltVert:H,contoursFrag:T,contoursVert:U,landscapeFrag:D,landscapeVert:Y,shadingFrag:B,shadingVert:X,raytracingFrag:J,raytracingVert:K};function Q(n,{eye:o,center:a}){let c=!1,t=null;const e={eye:o,center:a},m=l=>{c=!0,t=[l.screenX/n.height,l.screenY/n.height]},h=l=>{if(!c)return;const[w,b]=[l.screenX/n.height,l.screenY/n.height],[P,z]=t;t=[w,b];const f=M([],e.eye,e.center),p=j(f);let u=Math.acos(f[1]/p),y=Math.atan2(f[2],f[0]);u=Math.min(Math.max(u-5*(b-z),1e-8),Math.PI-1e-8),y+=5*(w-P),_(e.eye,p*Math.cos(y)*Math.sin(u),p*Math.cos(u),p*Math.sin(y)*Math.sin(u)),q(e.eye,e.eye,e.center)},x=()=>{c=!1};return n.addEventListener("mousedown",m),n.addEventListener("mousemove",h),n.addEventListener("mouseup",x),n.addEventListener("touchstart",l=>m(l.touches[0])),n.addEventListener("touchmove",l=>h(l.touches[0])),n.addEventListener("touchend",x),e}const i=L({extensions:["OES_standard_derivatives"]}),g=Q(document.getElementsByTagName("canvas")[0],{eye:[1,0,5.2],center:[0,0,0]}),r=W();let d=null;function W(){const n=new I.exports.Pane({title:"Controls"}),o={project:"quilt",seed:0,scale:20,mesh:k,fps:0,kd:{r:95,g:230,b:213},ks:{r:240,g:240,b:240},shininess:5,background:{r:120,g:178,b:255},antialias:!0};n.addInput(o,"project",{options:{"Quilt patterns":"quilt","Procedural landscapes":"landscape","Rasterization and shading":"shading","Stylized rendering":"contours","Ray tracing":"raytracing"}});const a=[[n.addInput(o,"seed",{min:0,max:1}),["quilt","landscape"]],[n.addInput(o,"scale",{min:10,max:30}),["landscape"]],[n.addInput(o,"mesh",{options:{Gengar:R,Knot:A,Sphere:G,Suzanne:O,Teapot:k}}).on("change",e=>C(e.value)),["shading","contours"]],[n.addInput(o,"kd"),["shading","contours"]],[n.addInput(o,"ks"),["shading","contours"]],[n.addInput(o,"shininess",{min:1,max:9}),["shading","contours"]],[n.addInput(o,"background"),["raytracing"]],[n.addInput(o,"antialias"),["raytracing"]]];n.addMonitor(o,"fps"),n.addSeparator(),n.addButton({title:"Instructions"}).on("click",()=>{const e=document.createElement("a");e.href="https://github.com/ekzhang/graphics-workshop#readme",e.target="_blank",e.click()});const c=localStorage.getItem("graphics-workshop");if(c)try{n.importPreset(JSON.parse(c))}catch(e){console.warn(`Error loading saved preset: ${e}`)}const t=()=>{const e=n.exportPreset();localStorage.setItem("graphics-workshop",JSON.stringify(e));for(const[m,h]of a)m.hidden=!h.includes(o.project)};return t(),n.on("change",t),o}async function C(n){d=await(await fetch(n)).json()}function v(n){return[n.r/255,n.g/255,n.b/255]}function $(){try{return{quilt:i({frag:s.quiltFrag,vert:s.quiltVert}),landscape:i({frag:s.landscapeFrag,vert:s.landscapeVert}),shading:i({frag:s.shadingFrag,vert:s.shadingVert}),contours:i({frag:s.contoursFrag,vert:s.contoursVert}),raytracing:i({frag:s.raytracingFrag,vert:s.raytracingVert})}}catch{return null}}const Z=i({attributes:{position:[[-1,1],[-1,-1],[1,1],[1,-1]]},elements:[[0,1,2],[2,1,3]],uniforms:{view:()=>N([],g.eye,g.center,[0,1,0]),projection:({drawingBufferWidth:n,drawingBufferHeight:o})=>{const a=n/o;return S([],Math.PI/6,a,.01,100)},eye:()=>g.eye,center:()=>g.center,resolution:({drawingBufferWidth:n,drawingBufferHeight:o})=>[n,o],time:i.context("time")}}),nn={quilt:i({uniforms:{seed:()=>r.seed}}),landscape:i({uniforms:{seed:()=>r.seed,scale:()=>r.scale}}),shading:i({attributes:{position:()=>d.vertices,normal:()=>d.normals},uniforms:{kd:()=>v(r.kd),ks:()=>v(r.ks),shininess:()=>r.shininess},elements:()=>d.elements}),contours:i({attributes:{position:()=>d.vertices,normal:()=>d.normals},uniforms:{kd:()=>v(r.kd),ks:()=>v(r.ks),shininess:()=>r.shininess},elements:()=>d.elements}),raytracing:i({uniforms:{background:()=>v(r.background),antialias:()=>r.antialias}})};let F=$();C(r.mesh).then(()=>{const n=[...Array(60)].fill(0);i.frame(()=>{const o=n.shift(),a=performance.now();n.push(a),o!==0&&(r.fps=1e3/((a-o)/n.length)),Z(()=>{r.project==="contours"?i.clear({color:[1,1,1,1]}):i.clear({color:[0,0,0,1]}),nn[r.project](()=>{F&&F[r.project]()})})})});
