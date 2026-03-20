"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wickFragmentShader = exports.wickVertexShader = void 0;
// language=Glsl
exports.wickVertexShader = "\n  precision mediump float;\n\n  attribute vec4 a_wick_color;\n  attribute vec2 a_position;\n  attribute vec2 a_center;\n  attribute float a_height;\n\n  varying vec4 v_color;\n  \n  uniform float u_candle_width;\n  uniform vec2 u_resolution;\n\n  void main() {\n    vec2 center = a_center + vec2(u_candle_width / 2.0, 0);\n    vec2 position = center + a_position * vec2(0, a_height) / 2.0;\n    vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;\n\n    v_color = a_wick_color;\n    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n  }\n";
// language=Glsl
exports.wickFragmentShader = "\n  precision mediump float;\n\n  varying vec4 v_color;\n\n  void main() {\n    gl_FragColor = v_color;\n  }\n";
