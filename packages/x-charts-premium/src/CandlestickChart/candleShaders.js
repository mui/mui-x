"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.candleFragmentShader = exports.candleVertexShader = void 0;
// language=Glsl
exports.candleVertexShader = "\n  precision mediump float;\n\n  attribute vec2 a_position;\n  attribute vec2 a_center;\n  attribute vec4 a_color;\n  attribute float a_height;\n\n  varying vec4 v_color;\n\n  uniform float u_candle_width;\n  uniform vec2 u_resolution;\n\n  void main() {\n    vec2 center = a_center + vec2(u_candle_width / 2.0, 0);\n    vec2 dimensions = vec2(u_candle_width, a_height);\n\n    // Convert from pixels to clip space (-1 to 1)\n    vec2 position = center + a_position * dimensions / 2.0;\n    vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;\n    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n\n    v_color = a_color;\n  }\n";
// language=Glsl
exports.candleFragmentShader = "\n  precision mediump float;\n\n  varying vec4 v_color;\n\n  void main() {\n    gl_FragColor = v_color;\n  }\n";
