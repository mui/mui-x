import { ROUNDED_BOX_SDF_GLSL } from '../../utils/webgl/glsl';

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
export const barFragmentShaderSource = /* glsl */ `
    precision mediump float;

    varying vec4 v_color;
    varying vec2 v_pos;
    varying vec2 v_halfSize;
    varying vec4 v_cornerRadii;

    ${ROUNDED_BOX_SDF_GLSL}

    void main() {
      float dist = roundedBoxSDF(v_pos, v_halfSize, v_cornerRadii);
      // Anti-alias only outside the SDF (dist >= 0). Starting smoothstep at 0
      // keeps interior pixels at full color instead of fading them.
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);

      gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
    }
  `;
