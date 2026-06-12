// Async-pipeline POC: worker computes scatter paths end-to-end.
// Input: Float64Array of (x, y) pairs + viewport metrics.
// Output: SVG <path d=...> strings (one per 1000-point chunk).

interface Msg {
  data: Float64Array;
  width: number;
  height: number;
  padding: number;
  markerSize: number;
}

interface Result {
  paths: string[];
  processingMs: number;
  pointCount: number;
}

const ALMOST_ZERO = 0.01;
const MAX_POINTS_PER_PATH = 1000;

self.addEventListener('message', (event: MessageEvent<Msg>) => {
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

  const processingMs = performance.now() - t0;
  const result: Result = { paths, processingMs, pointCount: data.length / 2 };
  (self as unknown as Worker).postMessage(result);
});
