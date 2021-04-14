attribute vec3 position;
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
