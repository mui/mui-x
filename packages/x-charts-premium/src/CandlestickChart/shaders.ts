// language=Glsl
export const candlestickVertexShader = /* glsl */ `
    precision mediump float;
    
    attribute vec2 a_position;
    attribute vec2 a_center;
    attribute vec4 a_color;
    attribute float a_saturation;
    
    varying vec4 v_color;
    varying vec2 v_pos;
    
    uniform vec2 u_dimensions;
    uniform vec2 u_resolution;
    
    // https://tsev.dev/posts/2020-06-19-colour-correction-with-webgl/
    vec3 adjust_saturation(vec3 color, float value) {
      // https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
      const vec3 luminosityFactor = vec3(0.2126, 0.7152, 0.0722);
      vec3 grayscale = vec3(dot(color, luminosityFactor));
    
      return mix(grayscale, color, 1.0 + value);
    }
    
    void main() {
      // Convert from pixels to clip space (-1 to 1)
      vec2 position = a_center + a_position * u_dimensions / 2.0;
      vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      
      v_color = vec4(adjust_saturation(a_color.rgb, a_saturation), 1.0);
      v_pos = a_position * u_dimensions / 2.0;
    }
  `;

// language=Glsl
export const candlestickFragmentShader = /* glsl */ `
    precision mediump float;
    
    varying vec4 v_color;
    
    void main() {
      gl_FragColor = v_color;
    }
  `;
