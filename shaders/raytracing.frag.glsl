precision mediump float;

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
    // added another sphere
    sphere(h, r, vec4(2.5, -1.0, -7.0, 1.0), 
        Material(vec3(0.8, 0.6, 0.4), vec3(0.8), false, false));
    circle(h, r, -2.0, 50.0,
        Material(vec3(0.8, 0.8, 0.8), vec3(0.0), false, true));
    return h;
}

// Compute lighting from one light
vec3 illuminate(vec3 lightPosition, vec3 pos, vec3 wo, Hit h) {
    vec3 wi = lightPosition - pos;
    vec3 kd = h.material.kd;

    Ray myRay;
    myRay.origin = pos;
    myRay.dir = normalize(wi);

    Hit myHit = intersect(myRay);
    if (myHit.time != inf) {
        return vec3(0.0);
    }

    if (h.material.checker) {
        // Checkerboard pattern for the floor
        vec2 coords = floor(pos.xz);
        kd = vec3(mod(coords.x + coords.y, 2.0) * 0.8 + 0.2);
    }
    float intensity = 1.0 / dot(wi, wi); // inverse-square law
    vec3 diffuse = kd * max(dot(normalize(wi), h.normal), 0.0);

    /*
struct Ray {
    vec3 origin;
    vec3 dir;
};

struct Hit {
    float time;
    vec3 normal;
    Material material;
};
    */
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
    // added another point of lighting
    color += 10.0 * illuminate(vec3(6.0, 1.0, 0.0), pos, wo, h);
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
