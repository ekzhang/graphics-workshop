precision mediump float;

uniform vec2 resolution;
uniform float time;

void main() {
    vec2 coord = gl_FragCoord.xy / resolution;

    // Output RGB color in range from 0.0 to 1.0
    vec3 color = vec3(coord.x, coord.y, 0.0);
    color.z += abs(sin(time));

    gl_FragColor = vec4(color, 1.0);
}
