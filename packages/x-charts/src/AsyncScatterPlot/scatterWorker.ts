/* eslint-disable no-restricted-globals */
/**
 * Worker entry for `AsyncScatterPlot`. Receives a Float64Array of (x, y) pairs
 * plus viewport metrics, computes the linear scale, and returns SVG path
 * strings (one per ~1000-point chunk, matching the existing BatchScatter
 * convention).
 *
 * @internal
 */

interface ScatterWorkerInput {
  data: Float64Array;
  width: number;
  height: number;
  padding: number;
  markerSize: number;
}

interface ScatterWorkerOutput {
  paths: string[];
  processingMs: number;
  pointCount: number;
  domain: { xMin: number; xMax: number; yMin: number; yMax: number };
}

const ALMOST_ZERO = 0.01;
const MAX_POINTS_PER_PATH = 1000;

self.addEventListener('message', (event: MessageEvent<ScatterWorkerInput>) => {
  const { data, width, height, padding, markerSize } = event.data;
  const t0 = performance.now();

  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;
  for (let i = 0; i < data.length; i += 2) {
    const x = data[i];
    const y = data[i + 1];
    if (x < xMin) {
      xMin = x;
    }
    if (x > xMax) {
      xMax = x;
    }
    if (y < yMin) {
      yMin = y;
    }
    if (y > yMax) {
      yMax = y;
    }
  }

  const innerW = width - 2 * padding;
  const innerH = height - 2 * padding;
  const xRange = xMax - xMin || 1;
  const yRange = yMax - yMin || 1;

  const paths: string[] = [];
  const buf: string[] = [];
  let inBuf = 0;
  for (let i = 0; i < data.length; i += 2) {
    const sx = padding + ((data[i] - xMin) / xRange) * innerW;
    const sy = height - padding - ((data[i + 1] - yMin) / yRange) * innerH;
    buf.push(`M${sx - markerSize} ${sy} a${markerSize} ${markerSize} 0 1 1 0 ${ALMOST_ZERO}`);
    inBuf += 1;
    if (inBuf >= MAX_POINTS_PER_PATH) {
      paths.push(buf.join(''));
      buf.length = 0;
      inBuf = 0;
    }
  }
  if (buf.length) {
    paths.push(buf.join(''));
  }

  const result: ScatterWorkerOutput = {
    paths,
    processingMs: performance.now() - t0,
    pointCount: data.length / 2,
    domain: { xMin, xMax, yMin, yMax },
  };
  (self as unknown as Worker).postMessage(result);
});
