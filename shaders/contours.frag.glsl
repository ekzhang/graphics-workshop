#extension GL_OES_standard_derivatives : enable
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
