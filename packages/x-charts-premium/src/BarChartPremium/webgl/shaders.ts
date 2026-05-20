// language=Glsl
export const barVertexShaderSource = /* glsl */ `
    precision mediump float;

    attribute vec2 a_position;
    attribute vec2 a_center;
    attribute vec2 a_halfSize;
    attribute vec4 a_color;
    attribute vec4 a_cornerRadii;

    varying vec4 v_color;
    varying vec2 v_pos;
    varying vec2 v_halfSize;
    varying vec4 v_cornerRadii;

    uniform vec2 u_resolution;

    void main() {
      vec2 position = a_center + a_position * a_halfSize;
      vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

      v_color = a_color;
      v_pos = a_position * a_halfSize;
      v_halfSize = a_halfSize;
      v_cornerRadii = a_cornerRadii;
    }
  `;

// language=Glsl
// Per-corner radii ordering follows CSS: top-left, top-right, bottom-right, bottom-left.
// Screen-space conventions after the y-flip in the vertex stage:
//   v_pos.y < 0 -> top, v_pos.y > 0 -> bottom
//   v_pos.x < 0 -> left, v_pos.x > 0 -> right
export const barFragmentShaderSource = /* glsl */ `
    precision mediump float;

    varying vec4 v_color;
    varying vec2 v_pos;
    varying vec2 v_halfSize;
    varying vec4 v_cornerRadii;

    float roundedBoxSDF(vec2 pos, vec2 halfSize, vec4 r) {
      float radius;
      if (pos.x < 0.0) {
        radius = pos.y < 0.0 ? r.x : r.w;
      } else {
        radius = pos.y < 0.0 ? r.y : r.z;
      }

      vec2 q = abs(pos) - halfSize + radius;
      return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
    }

    void main() {
      float dist = roundedBoxSDF(v_pos, v_halfSize, v_cornerRadii);
      // Anti-alias only outside the SDF (dist >= 0). Starting smoothstep at 0
      // keeps interior pixels at full color instead of fading them.
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);

      gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
    }
  `;
