// Partition worker: receives a SharedArrayBuffer + an index range and computes
// SVG path strings for that slice using pre-computed global extremums.

interface PartitionMsg {
  sab: SharedArrayBuffer;
  start: number; // inclusive (point index, not Float64 index)
  end: number; // exclusive
  width: number;
  height: number;
  padding: number;
  markerSize: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

interface PartitionResult {
  paths: string[];
  processingMs: number;
  start: number;
  end: number;
}

const ALMOST_ZERO = 0.01;
const MAX_POINTS_PER_PATH = 1000;

self.addEventListener('message', (event: MessageEvent<PartitionMsg>) => {
  const { sab, start, end, width, height, padding, markerSize, xMin, xMax, yMin, yMax } =
    event.data;
  const data = new Float64Array(sab);
  const t0 = performance.now();

  const innerW = width - 2 * padding;
  const innerH = height - 2 * padding;
  const xRange = xMax - xMin || 1;
  const yRange = yMax - yMin || 1;

  const paths: string[] = [];
  const buf: string[] = [];
  let inBuf = 0;
  for (let i = start; i < end; i += 1) {
    const xi = i * 2;
    const sx = padding + ((data[xi] - xMin) / xRange) * innerW;
    const sy = height - padding - ((data[xi + 1] - yMin) / yRange) * innerH;
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
  const result: PartitionResult = { paths, processingMs, start, end };
  (self as unknown as Worker).postMessage(result);
});
