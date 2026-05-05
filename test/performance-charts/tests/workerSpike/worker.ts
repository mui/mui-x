// Simulated scatter "seriesProcessor" workload: scale each (x, y) pair.
// Representative of pure CPU work that the real seriesProcessor does
// (mapping dataset -> tuples + applying defaults).

type WorkerMessage =
  | { mode: 'clone' | 'transfer'; data: Float64Array }
  | { mode: 'sab'; sab: SharedArrayBuffer };

self.addEventListener('message', (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data;
  let buffer: Float64Array;

  if (msg.mode === 'sab') {
    buffer = new Float64Array(msg.sab);
  } else {
    buffer = msg.data;
  }

  const t0 = performance.now();

  // Simulated work: scale each (x, y) pair.
  for (let i = 0; i < buffer.length; i += 2) {
    buffer[i] = buffer[i] * 0.001;
    buffer[i + 1] = buffer[i + 1] * 0.001;
  }

  const processingMs = performance.now() - t0;

  if (msg.mode === 'sab') {
    (self as unknown as Worker).postMessage({ mode: 'sab', processingMs });
  } else if (msg.mode === 'transfer') {
    (self as unknown as Worker).postMessage(
      { mode: 'transfer', processingMs, data: buffer },
      { transfer: [buffer.buffer] },
    );
  } else {
    (self as unknown as Worker).postMessage({ mode: 'clone', processingMs, data: buffer });
  }
});
