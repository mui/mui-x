// language=Glsl
// Positions and resolution carry drawing-area pixel coordinates that can
// exceed the ~1024 range where mediump loses sub-pixel precision on mobile
// GPUs. They must be highp. v_color stays lowp/mediump to save interpolants.
export const scatterVertexShader = /* glsl */ `
  precision highp float;
  precision mediump int;

  attribute vec2 a_position;
  attribute highp vec2 a_center;
  attribute float a_size;
  attribute mediump vec4 a_color;

  varying mediump vec4 v_color;
  varying mediump vec2 v_offset;
  varying mediump float v_radius;

  uniform highp vec2 u_resolution;

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

  varying mediump vec4 v_color;
  varying mediump vec2 v_offset;
  varying mediump float v_radius;

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
