// language=Glsl
export const scatterVertexShader = /* glsl */ `
  precision mediump float;

  attribute vec2 a_position;
  attribute vec2 a_center;
  attribute float a_size;
  attribute vec4 a_color;

  varying vec4 v_color;
  varying vec2 v_offset;
  varying float v_radius;

  uniform vec2 u_resolution;

  void main() {
    float radius = a_size * 0.5;
    vec2 point = a_center + a_position * radius;

    vec2 clipSpace = (point / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

    v_color = a_color;
    v_offset = a_position;
    v_radius = radius;
  }
`;

// language=Glsl
export const scatterFragmentShader = /* glsl */ `
  precision mediump float;

  varying vec4 v_color;
  varying vec2 v_offset;
  varying float v_radius;

  void main() {
    float dist = length(v_offset);
    if (dist > 1.0) {
      discard;
    }
    // Simple antialiased edge: fade the last pixel of the radius.
    float edge = max(0.0, 1.0 - 1.0 / max(v_radius, 1.0));
    float alpha = 1.0 - smoothstep(edge, 1.0, dist);
    gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
  }
`;
