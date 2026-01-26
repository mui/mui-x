// language=Glsl
export const candlestickLineVertexShader = /* glsl */ `
  precision mediump float;

  attribute vec2 a_position;
  attribute vec2 a_center;
  attribute float a_height;

  varying vec4 v_color;
  
  uniform float u_candle_width;
  uniform vec2 u_resolution;

  void main() {
    vec2 center = a_center + vec2(u_candle_width / 2.0, 0);
    vec2 position = center + a_position * vec2(0, a_height) / 2.0;
    vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`;
// language=Glsl
export const candlestickLineFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec4 u_color;

  void main() {
    gl_FragColor = u_color;
  }
`;
