// language=Glsl
export const candlestickVertexShader = /* glsl */ `
    precision mediump float;
    
    attribute vec2 a_position;
    attribute vec2 a_center;
    attribute vec4 a_color;
    attribute float a_height;
    
    varying vec4 v_color;
    varying vec2 v_pos;
    
    uniform float u_width;
    uniform vec2 u_resolution;
    
    void main() {
      vec2 dimensions = vec2(u_width, a_height);
        
      // Convert from pixels to clip space (-1 to 1)
      vec2 position = a_center + a_position * dimensions / 2.0;
      vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      
      v_color = a_color;
    }
  `;

// language=Glsl
export const candlestickFragmentShader = /* glsl */ `
    precision mediump float;
    
    varying vec4 v_color;

    uniform float u_width;
    uniform vec2 u_resolution;
    
    void main() {
      gl_FragColor = v_color;
    }
  `;
