import { describe, expect, test } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { HeatmapWebGLProgram } from './HeatmapWebGLProgram';

/**
 * Self-contained A/B micro-benchmark for the heatmap WebGL pipeline.
 *
 * Mirrors the candlestick perf test: a `naive` path with per-frame allocations,
 * `bufferData`, and re-fetched locations vs the `optimized` path through
 * `HeatmapWebGLProgram`. The same WebGL2 context backs both runs so the delta
 * isolates the structural wins.
 */

const POINT_COUNT = 200_000;
const FRAME_COUNT = 30;

function buildColors(n: number) {
  const out = new Float32Array(n * 4);
  for (let i = 0; i < n; i += 1) {
    out[i * 4] = 0.3;
    out[i * 4 + 1] = 0.7;
    out[i * 4 + 2] = 0.5;
    out[i * 4 + 3] = 1.0;
  }
  return out;
}

function buildColorsBytes(n: number) {
  const out = new Uint8Array(n * 4);
  for (let i = 0; i < n; i += 1) {
    out[i * 4] = 76;
    out[i * 4 + 1] = 178;
    out[i * 4 + 2] = 127;
    out[i * 4 + 3] = 255;
  }
  return out;
}

function generateFreshCenters(n: number, frame: number) {
  /* New typed array every frame — what the doc warns against. */
  const out = new Float32Array(n * 2);
  const offset = (frame % 30) * 0.25;
  for (let i = 0; i < n; i += 1) {
    out[i * 2] = (i % 1000) * 1.2 + offset;
    out[i * 2 + 1] = Math.floor(i / 1000) * 1.2 + offset;
  }
  return out;
}

const centersPool = new Float32Array(POINT_COUNT * 2);

function generatePooledCenters(n: number, frame: number) {
  const offset = (frame % 30) * 0.25;
  for (let i = 0; i < n; i += 1) {
    centersPool[i * 2] = (i % 1000) * 1.2 + offset;
    centersPool[i * 2 + 1] = Math.floor(i / 1000) * 1.2 + offset;
  }
  return centersPool.subarray(0, n * 2);
}

const cachedColors = buildColorsBytes(POINT_COUNT);

type Counters = {
  bufferData: number;
  bufferSubData: number;
  bufferDataBytes: number;
  bufferSubDataBytes: number;
  createBuffer: number;
  getAttribLocation: number;
  getUniformLocation: number;
  drawArraysInstanced: number;
};

function setupGL() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 400;
  document.body.appendChild(canvas);
  const rawGl = canvas.getContext('webgl2', { antialias: false })!;
  rawGl.viewport(0, 0, canvas.width, canvas.height);

  const counters: Counters = {
    bufferData: 0,
    bufferSubData: 0,
    bufferDataBytes: 0,
    bufferSubDataBytes: 0,
    createBuffer: 0,
    getAttribLocation: 0,
    getUniformLocation: 0,
    drawArraysInstanced: 0,
  };

  const gl = new Proxy(rawGl, {
    get(target, prop) {
      const value = target[prop as keyof WebGL2RenderingContext];
      if (typeof value !== 'function') {
        return value;
      }
      const fn = value as (...args: unknown[]) => unknown;
      switch (prop) {
        case 'bufferData':
          return (...args: unknown[]) => {
            counters.bufferData += 1;
            const data = args[1];
            if (data && typeof data === 'object' && 'byteLength' in data) {
              counters.bufferDataBytes += (data as ArrayBufferView).byteLength;
            }
            return fn.apply(target, args);
          };
        case 'bufferSubData':
          return (...args: unknown[]) => {
            counters.bufferSubData += 1;
            const data = args[2];
            if (data && typeof data === 'object' && 'byteLength' in data) {
              counters.bufferSubDataBytes += (data as ArrayBufferView).byteLength;
            }
            return fn.apply(target, args);
          };
        case 'createBuffer':
          return (...args: unknown[]) => {
            counters.createBuffer += 1;
            return fn.apply(target, args);
          };
        case 'getAttribLocation':
          return (...args: unknown[]) => {
            counters.getAttribLocation += 1;
            return fn.apply(target, args);
          };
        case 'getUniformLocation':
          return (...args: unknown[]) => {
            counters.getUniformLocation += 1;
            return fn.apply(target, args);
          };
        case 'drawArraysInstanced':
          return (...args: unknown[]) => {
            counters.drawArraysInstanced += 1;
            return fn.apply(target, args);
          };
        default:
          return fn.bind(target);
      }
    },
  }) as WebGL2RenderingContext;

  return { canvas, gl, counters };
}

function logCounters(label: string, counters: Counters) {
  // eslint-disable-next-line no-console
  console.log(
    `[${label}] GL ops: ` +
      `bufferData=${counters.bufferData} (${(counters.bufferDataBytes / 1024 / 1024).toFixed(2)} MB), ` +
      `bufferSubData=${counters.bufferSubData} (${(counters.bufferSubDataBytes / 1024 / 1024).toFixed(2)} MB), ` +
      `createBuffer=${counters.createBuffer}, ` +
      `getAttribLocation=${counters.getAttribLocation}, ` +
      `getUniformLocation=${counters.getUniformLocation}, ` +
      `drawArraysInstanced=${counters.drawArraysInstanced}`,
  );
}

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

const NAIVE_VERTEX = /* glsl */ `#version 300 es
in vec2 a_position;
in vec2 a_center;
in vec4 a_color;
out vec4 v_color;
uniform vec2 u_dimensions;
uniform vec2 u_resolution;
void main() {
  vec2 position = a_center + a_position * u_dimensions / 2.0;
  vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  v_color = a_color;
}
`;

const NAIVE_FRAGMENT = /* glsl */ `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 fragColor;
void main() { fragColor = v_color; }
`;

function makeNaiveProgram(gl: WebGL2RenderingContext) {
  const program = gl.createProgram()!;
  const vs = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vs, NAIVE_VERTEX);
  gl.compileShader(vs);
  gl.attachShader(program, vs);
  const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fs, NAIVE_FRAGMENT);
  gl.compileShader(fs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  return program;
}

describe('HeatmapWebGL pipeline (200k × 30 frames)', () => {
  test.skipIf(isJSDOM)(
    'naive: bufferData every frame, fresh allocs, repeated lookups',
    async () => {
      const { canvas, gl, counters } = setupGL();
      try {
        const program = makeNaiveProgram(gl);
        gl.useProgram(program);

        const t0 = performance.now();
        for (let frame = 0; frame < FRAME_COUNT; frame += 1) {
          const centers = generateFreshCenters(POINT_COUNT, frame);
          const colors = buildColors(POINT_COUNT);

          const aPos = gl.getAttribLocation(program, 'a_position');
          const aCenter = gl.getAttribLocation(program, 'a_center');
          const aColor = gl.getAttribLocation(program, 'a_color');
          const uDim = gl.getUniformLocation(program, 'u_dimensions');
          const uRes = gl.getUniformLocation(program, 'u_resolution');
          gl.uniform2f(uDim, 1.2, 1.2);
          gl.uniform2f(uRes, canvas.width, canvas.height);

          const quadBuffer = gl.createBuffer()!;
          gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(aPos);
          gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

          const centerBuffer = gl.createBuffer()!;
          gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, centers, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(aCenter);
          gl.vertexAttribPointer(aCenter, 2, gl.FLOAT, false, 0, 0);
          gl.vertexAttribDivisor(aCenter, 1);

          const colorBuffer = gl.createBuffer()!;
          gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(aColor);
          gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
          gl.vertexAttribDivisor(aColor, 1);

          gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, POINT_COUNT);
          gl.finish();

          gl.deleteBuffer(quadBuffer);
          gl.deleteBuffer(centerBuffer);
          gl.deleteBuffer(colorBuffer);
        }
        const elapsed = performance.now() - t0;
        // eslint-disable-next-line no-console
        console.log(
          `[NAIVE-HEATMAP] ${POINT_COUNT} pts × ${FRAME_COUNT} frames = ${elapsed.toFixed(1)}ms total, ${(elapsed / FRAME_COUNT).toFixed(2)}ms/frame`,
        );
        logCounters('NAIVE-HEATMAP', counters);
        expect(counters.drawArraysInstanced).toBe(FRAME_COUNT);
        expect(elapsed).toBeGreaterThan(0);
      } finally {
        canvas.remove();
      }
    },
  );

  test.skipIf(isJSDOM)(
    'optimized: pooled views, growable buffers, cached locations, color short-circuit',
    async () => {
      const { canvas, gl, counters } = setupGL();
      try {
        const program = new HeatmapWebGLProgram(gl);
        program.setResolution(canvas.width, canvas.height);
        program.setRectDimensions(1.2, 1.2);
        program.setBorderRadius(0);

        const t0 = performance.now();
        for (let frame = 0; frame < FRAME_COUNT; frame += 1) {
          const centers = generatePooledCenters(POINT_COUNT, frame);
          program.plot({
            centers,
            /* Same ref every frame → upload short-circuit fires after frame 0. */
            colors: cachedColors,
          });
          program.render(POINT_COUNT);
          gl.finish();
        }
        const elapsed = performance.now() - t0;
        // eslint-disable-next-line no-console
        console.log(
          `[OPTIMIZED-HEATMAP] ${POINT_COUNT} pts × ${FRAME_COUNT} frames = ${elapsed.toFixed(1)}ms total, ${(elapsed / FRAME_COUNT).toFixed(2)}ms/frame`,
        );
        logCounters('OPTIMIZED-HEATMAP', counters);
        /* Sanity-check the structural wins the doc patterns enforce. */
        expect(counters.createBuffer).toBeLessThan(FRAME_COUNT);
        expect(counters.getAttribLocation).toBeLessThan(FRAME_COUNT);
        /* Static colors short-circuit after frame 0; only `centers` re-uploads. */
        expect(counters.bufferSubData).toBe(FRAME_COUNT - 1);

        program.dispose();
      } finally {
        canvas.remove();
      }
    },
  );
});
