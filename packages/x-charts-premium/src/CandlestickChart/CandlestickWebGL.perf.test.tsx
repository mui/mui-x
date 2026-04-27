import { describe, expect, test } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { CandlestickWebGLProgram } from './CandlestickWebGLProgram';

/**
 * Self-contained A/B micro-benchmark for the candlestick WebGL pipeline.
 *
 * Runs two paths side-by-side over the same data and the same number of "zoom frames":
 *   - `naive`      mimics the pre-doc pipeline: fresh `Float32Array` allocations every
 *                   frame, `bufferData(STATIC_DRAW)` for every buffer, attribute /
 *                   uniform locations re-fetched per frame.
 *   - `optimized`   uses `CandlestickWebGLProgram` from the package: pooled typed arrays
 *                   handed out as `subarray` views, growable buffers (`bufferSubData`
 *                   after the first upload), cached locations, identity-cached colors.
 *
 * Both paths run inside the same browser tab against the same WebGL2 context, so the
 * delta between them isolates the structural wins from the doc.
 */

const POINT_COUNT = 200_000;
const FRAME_COUNT = 30;

function makeCandle(i: number) {
  const open = 100 + Math.sin(i / 50) * 10;
  const close = open + Math.cos(i / 30) * 5;
  const high = Math.max(open, close) + 2;
  const low = Math.min(open, close) - 2;
  return { open, high, low, close };
}

function buildColors(n: number) {
  const out = new Float32Array(n * 4);
  for (let i = 0; i < n; i += 1) {
    out[i * 4] = 0.2;
    out[i * 4 + 1] = 0.6;
    out[i * 4 + 2] = 0.8;
    out[i * 4 + 3] = 1.0;
  }
  return out;
}

function buildColorsBytes(n: number) {
  const out = new Uint8Array(n * 4);
  for (let i = 0; i < n; i += 1) {
    out[i * 4] = 51;
    out[i * 4 + 1] = 153;
    out[i * 4 + 2] = 204;
    out[i * 4 + 3] = 255;
  }
  return out;
}

function buildWickColorsBytes(n: number) {
  const out = new Uint8Array(n * 2 * 4);
  for (let i = 0; i < out.length; i += 4) {
    out[i] = 255;
    out[i + 1] = 255;
    out[i + 2] = 255;
    out[i + 3] = 255;
  }
  return out;
}

/* Generate fresh position arrays per frame. Returned arrays have new identity each call,
 * so any "skip upload when ref unchanged" short-circuit must inspect contents. */
function generateFreshFrame(n: number, frame: number) {
  const candleCenters = new Float32Array(n * 2);
  const candleHeights = new Float32Array(n);
  const wickCenters = new Float32Array(n * 2 * 2);
  const wickHeights = new Float32Array(n * 2);
  /* zoomShift simulates a horizontal pan; values change every frame so the upload is
   * never a no-op even with reference equality. */
  const zoomShift = (frame % 30) * 0.5;
  for (let i = 0; i < n; i += 1) {
    const candle = makeCandle(i);
    const x = i * 0.5 + zoomShift;
    const cMid = (candle.open + candle.close) / 2;
    const cHeight = Math.abs(candle.open - candle.close);
    candleCenters[i * 2] = x;
    candleCenters[i * 2 + 1] = cMid;
    candleHeights[i] = cHeight;

    const upper = i * 2;
    wickCenters[upper * 2] = x;
    wickCenters[upper * 2 + 1] = (candle.high + cMid) / 2;
    wickHeights[upper] = candle.high - cMid;

    const lower = i * 2 + 1;
    wickCenters[lower * 2] = x;
    wickCenters[lower * 2 + 1] = (cMid + candle.low) / 2;
    wickHeights[lower] = cMid - candle.low;
  }
  return { candleCenters, candleHeights, wickCenters, wickHeights };
}

/* Pooled positions: same `pool` each call, `subarray` for fresh identity but shared bytes. */
const pool = {
  candleCenters: new Float32Array(POINT_COUNT * 2),
  candleHeights: new Float32Array(POINT_COUNT),
  wickCenters: new Float32Array(POINT_COUNT * 2 * 2),
  wickHeights: new Float32Array(POINT_COUNT * 2),
};

function generatePooledFrame(n: number, frame: number) {
  const zoomShift = (frame % 30) * 0.5;
  for (let i = 0; i < n; i += 1) {
    const candle = makeCandle(i);
    const x = i * 0.5 + zoomShift;
    const cMid = (candle.open + candle.close) / 2;
    const cHeight = Math.abs(candle.open - candle.close);
    pool.candleCenters[i * 2] = x;
    pool.candleCenters[i * 2 + 1] = cMid;
    pool.candleHeights[i] = cHeight;

    const upper = i * 2;
    pool.wickCenters[upper * 2] = x;
    pool.wickCenters[upper * 2 + 1] = (candle.high + cMid) / 2;
    pool.wickHeights[upper] = candle.high - cMid;

    const lower = i * 2 + 1;
    pool.wickCenters[lower * 2] = x;
    pool.wickCenters[lower * 2 + 1] = (cMid + candle.low) / 2;
    pool.wickHeights[lower] = cMid - candle.low;
  }
  return {
    candleCenters: pool.candleCenters.subarray(0, n * 2),
    candleHeights: pool.candleHeights.subarray(0, n),
    wickCenters: pool.wickCenters.subarray(0, n * 2 * 2),
    wickHeights: pool.wickHeights.subarray(0, n * 2),
  };
}

/* Cached colors: same Uint8Array refs across all frames — the optimized program
 * will short-circuit color uploads when it sees the same identity twice in a row. */
const cachedCandleColors = buildColorsBytes(POINT_COUNT);
const cachedWickColors = buildWickColorsBytes(POINT_COUNT);

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

  /* Wrap the context in a counting proxy. The proxy preserves `this` so the underlying
   * driver calls behave identically. */
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

const NAIVE_VERTEX = /* glsl */ `#version 300 es
in vec2 a_position;
in vec2 a_center;
in float a_height;
in vec4 a_color;
uniform vec2 u_resolution;
uniform float u_candle_width;
out vec4 v_color;
void main() {
  vec2 center = a_center + vec2(u_candle_width / 2.0, 0);
  vec2 dimensions = vec2(u_candle_width, a_height);
  vec2 position = center + a_position * dimensions / 2.0;
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

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

describe('CandlestickWebGL pipeline (200k × 30 frames)', () => {
  test.skipIf(isJSDOM)(
    'naive: bufferData every frame, fresh allocs, repeated lookups',
    async () => {
      const { canvas, gl, counters } = setupGL();
      try {
        const program = makeNaiveProgram(gl);
        gl.useProgram(program);

        const t0 = performance.now();
        for (let frame = 0; frame < FRAME_COUNT; frame += 1) {
          /* Fresh allocations every frame — what the doc calls out as wasteful. */
          const { candleCenters, candleHeights } = generateFreshFrame(POINT_COUNT, frame);
          /* Colors freshly allocated too, even though they don't change. */
          const colors = buildColors(POINT_COUNT);

          /* Repeated location lookups — what the doc says to avoid. */
          const aPos = gl.getAttribLocation(program, 'a_position');
          const aCenter = gl.getAttribLocation(program, 'a_center');
          const aHeight = gl.getAttribLocation(program, 'a_height');
          const aColor = gl.getAttribLocation(program, 'a_color');
          const uRes = gl.getUniformLocation(program, 'u_resolution');
          const uWidth = gl.getUniformLocation(program, 'u_candle_width');
          gl.uniform2f(uRes, canvas.width, canvas.height);
          gl.uniform1f(uWidth, 1.0);

          /* Fresh GL buffer every frame — equivalent to the pre-doc leak in plot(). */
          const quadBuffer = gl.createBuffer()!;
          gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(aPos);
          gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

          const centerBuffer = gl.createBuffer()!;
          gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, candleCenters, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(aCenter);
          gl.vertexAttribPointer(aCenter, 2, gl.FLOAT, false, 0, 0);
          gl.vertexAttribDivisor(aCenter, 1);

          const heightBuffer = gl.createBuffer()!;
          gl.bindBuffer(gl.ARRAY_BUFFER, heightBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, candleHeights, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(aHeight);
          gl.vertexAttribPointer(aHeight, 1, gl.FLOAT, false, 0, 0);
          gl.vertexAttribDivisor(aHeight, 1);

          const colorBuffer = gl.createBuffer()!;
          gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(aColor);
          gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
          gl.vertexAttribDivisor(aColor, 1);

          gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, POINT_COUNT);

          /* Force the driver to surface any pending work before we move on. */
          gl.finish();

          gl.deleteBuffer(quadBuffer);
          gl.deleteBuffer(centerBuffer);
          gl.deleteBuffer(heightBuffer);
          gl.deleteBuffer(colorBuffer);
        }
        const elapsed = performance.now() - t0;
        // eslint-disable-next-line no-console
        console.log(
          `[NAIVE] ${POINT_COUNT} pts × ${FRAME_COUNT} frames = ${elapsed.toFixed(1)}ms total, ${(elapsed / FRAME_COUNT).toFixed(2)}ms/frame`,
        );
        logCounters('NAIVE', counters);
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
        const program = new CandlestickWebGLProgram(gl);
        program.setResolution(canvas.width, canvas.height);
        program.setCandleWidth(1.0);

        const t0 = performance.now();
        for (let frame = 0; frame < FRAME_COUNT; frame += 1) {
          const positions = generatePooledFrame(POINT_COUNT, frame);
          program.plot({
            candleCenters: positions.candleCenters,
            candleHeights: positions.candleHeights,
            wickCenters: positions.wickCenters,
            wickHeights: positions.wickHeights,
            /* Same Float32Array ref every frame → upload short-circuit fires. */
            candleColors: cachedCandleColors,
            wickColors: cachedWickColors,
          });
          program.render(POINT_COUNT);
          gl.finish();
        }

        const elapsed = performance.now() - t0;
        // eslint-disable-next-line no-console
        console.log(
          `[OPTIMIZED] ${POINT_COUNT} pts × ${FRAME_COUNT} frames = ${elapsed.toFixed(1)}ms total, ${(elapsed / FRAME_COUNT).toFixed(2)}ms/frame`,
        );
        logCounters('OPTIMIZED', counters);
        /* Sanity-check the structural wins the doc patterns enforce. */
        expect(counters.createBuffer).toBeLessThan(FRAME_COUNT);
        expect(counters.getAttribLocation).toBeLessThan(FRAME_COUNT);
        expect(counters.bufferSubData).toBeGreaterThan(counters.bufferData);

        program.dispose();
      } finally {
        canvas.remove();
      }
    },
  );
});
