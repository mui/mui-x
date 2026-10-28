import { ScalarMetric } from '@mui/internal-benchmark/page';
import type { InteractionContext } from '@mui/internal-benchmark/page';
import { expectWebGLCanvasDrawn } from './expectWebGLCanvasDrawn';

/** The `elementtiming` name of the marker: its paint is recorded as `bench:paint#webgl`. */
const WEBGL_PAINT = 'webgl';

// How long the GPU takes, after the chart's first draw pass, to finish everything submitted until
// then: compiling the shaders, uploading the data and drawing. The paint above doesn't include it:
// the main thread paints the frame before the GPU has run the draw. Informational: it varies from
// sample to sample far more than the paint, so an alarm on it would rarely settle.
const gpuTime = new ScalarMetric({
  name: 'webgl:gpu',
  format: { style: 'unit', unit: 'millisecond', maximumFractionDigits: 2 },
});

const DRAW_METHODS = [
  'drawArrays',
  'drawArraysInstanced',
  'drawElements',
  'drawElementsInstanced',
  'drawRangeElements',
] as const;

const drawnCanvases = new WeakSet<HTMLCanvasElement | OffscreenCanvas>();
/** Settles with the GPU time of the latest canvas's first draw pass. */
let pendingGpuTime: Promise<number> | null = null;

function appendPaintMarker() {
  const marker = document.createElement('span');
  marker.setAttribute('elementtiming', WEBGL_PAINT);
  Object.assign(marker.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    opacity: '0.01',
    pointerEvents: 'none',
    fontSize: '1px',
  });
  marker.textContent = ' ';
  document.body.appendChild(marker);
}

/**
 * Resolves with how long the GPU takes to execute everything submitted so far. Never blocks: a
 * fence's status only changes between tasks, so it is checked once per task until signaled.
 */
async function measureGpuTime(gl: WebGL2RenderingContext): Promise<number> {
  const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  if (!sync) {
    throw new Error('WebGL bench: could not create a fence to time the GPU.');
  }
  gl.flush();
  const submittedAt = performance.now();
  while (gl.getSyncParameter(sync, gl.SYNC_STATUS) !== gl.SIGNALED) {
    // eslint-disable-next-line no-await-in-loop -- polling is inherently sequential
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
  }
  const duration = performance.now() - submittedAt;
  gl.deleteSync(sync);
  return duration;
}

function onFirstDrawPass(gl: WebGL2RenderingContext) {
  appendPaintMarker();
  pendingGpuTime = measureGpuTime(gl);
}

// Observes the page's WebGL draw calls without changing them. A chart draws from an effect, after
// the commits that create its context and upload its data, so a sample can't wait for it from the
// interaction. Each sample mounts a new canvas: after its first draw pass — the current task, once
// the rest of the pass has run — a paint marker is added, which paints in the frame that shows the
// draw, and a fence times the GPU's work on it.
for (const method of DRAW_METHODS) {
  const draw = WebGL2RenderingContext.prototype[method] as (
    this: WebGL2RenderingContext,
    ...args: unknown[]
  ) => void;
  Object.defineProperty(WebGL2RenderingContext.prototype, method, {
    configurable: true,
    writable: true,
    value: function observedDraw(this: WebGL2RenderingContext, ...args: unknown[]) {
      draw.apply(this, args);
      if (!drawnCanvases.has(this.canvas)) {
        drawnCanvases.add(this.canvas);
        queueMicrotask(() => onFirstDrawPass(this));
      }
    },
  });
}

/**
 * Interaction passed to `reactBenchmark()` for WebGL benches: waits for the paint of the frame that
 * shows the chart's first WebGL draw, recorded as `bench:paint#webgl`, and for the GPU to execute
 * it, recorded as `webgl:gpu`, then asserts the canvas actually drew something (no false pass on a
 * dead software-WebGL context).
 */
export async function benchWebGLInteraction({ waitForElementTiming }: InteractionContext) {
  try {
    await waitForElementTiming(WEBGL_PAINT);
  } catch (error) {
    // Nothing drew: the canvas check says why when the context is the reason.
    expectWebGLCanvasDrawn();
    throw error;
  }
  document.querySelector(`[elementtiming="${WEBGL_PAINT}"]`)?.remove();
  // The marker is added in the same task that starts timing the GPU.
  gpuTime.record(await pendingGpuTime!);
  pendingGpuTime = null;
  expectWebGLCanvasDrawn();
}
