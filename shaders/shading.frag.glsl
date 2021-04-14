precision mediump float;

uniform vec3 kd; // diffuse coefficient
uniform vec3 ks; // specular coefficient
uniform float shininess; // shininess parameter
uniform vec3 eye; // position of camera

varying vec3 vPosition;
varying vec3 vNormal;

vec3 illuminate(vec3 lightPosition) {
    vec3 wi = lightPosition - vPosition;
    float intensity = 1.0 / dot(wi, wi); // inverse-square law
    vec3 diffuse = kd * max(dot(normalize(wi), vNormal), 0.0);

    // 1. Your specular highlights code goes here!
    //
    // This is the outline of what your program should do:
    //  - Compute the unit vector wo from the current position to the
    //    camera, by subtracting vPosition from eye and calling
    //    normalize().
    //  - Compute the reflected incident light vector r, by reflecting
    //    normalize(wi) about vNormal using the reflect() function.
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
