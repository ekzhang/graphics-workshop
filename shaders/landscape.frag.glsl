precision mediump float;

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
     color = vec3(0.5);
     color += 0.5 * noise8;
     color += 0.25 * noise4;
     color += 0.1 * noise2;
     color += 0.05 * noise1;

    // 2. Generate "water" and "land"
    float elevation = 0.3 - 0.2 * max(length(coord) - 20.0, 0.0);
    elevation += noise8 + noise4 * 0.2 + noise2 * 0.1 + noise1 * 0.05;


    float temperature = 0.3 - 0.8 * max(length(coord) - 17.0, 0.0);

    // temperature sampled independently
    temperature += noise8 + noise4 * 0.1 + noise2 * 0.2 + noise1 * 0.1;

    float landFactor = smoothstep(-0.05, 0.05, elevation);
    float deepSea = smoothstep(-0.1, -0.3, elevation);
    float deepColor = 0.8 - 0.3 * smoothstep(-0.2, -0.5, elevation);
    vec3 waterColor = mix(vec3(0.2, 0.2, 0.8), vec3(0.0, 0.0, deepColor), deepSea);
    color = mix(waterColor, vec3(0.0, 0.6, 0.0), landFactor);

    // 3. Generate "mountains" and "beaches" based on elevation
    float mountainFactor = (elevation - 1.0) * 5.0;

    // temperature factor 
    float temperatureFactor = (temperature - 1.0) * 8.0;

    vec3 mountainColor = vec3(0.12, 0.15, 0.1);
    mountainColor = mix(mountainColor, vec3(0.4, 0.32, 0.4), smoothstep(0.7, 0.8, mountainFactor));
    mountainColor = mix(mountainColor, vec3(0.9, 0.9, 0.9), smoothstep(1.1, 1.15, mountainFactor));
    vec3 landColor = mix(vec3(0.0, 0.6, 0.0), mountainColor, smoothstep(0.0, 0.1, mountainFactor));
    float grassFactor = smoothstep(0.75, 0.7, elevation);
    landColor = mix(landColor, vec3(0.2, 0.8, 0.0), grassFactor + 0.1 * temperatureFactor);
    float beachFactor = smoothstep(0.5, 0.4, elevation + 0.001 * temperature);
    landColor = mix(landColor, vec3(0.9, 0.9, 0.5), beachFactor);
    color = mix(waterColor, landColor, landFactor);

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
