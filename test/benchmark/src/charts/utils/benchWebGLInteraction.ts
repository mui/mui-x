import type { InteractionContext } from '@mui/internal-benchmark/page';
import { expectWebGLCanvasDrawn } from './expectWebGLCanvasDrawn';

/** The `elementtiming` name of the marker: its paint is recorded as `bench:paint#webgl`. */
const WEBGL_PAINT = 'webgl';

const DRAW_METHODS = [
  'drawArrays',
  'drawArraysInstanced',
  'drawElements',
  'drawElementsInstanced',
  'drawRangeElements',
] as const;

const drawnCanvases = new WeakSet<HTMLCanvasElement | OffscreenCanvas>();

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

// Observes the page's WebGL draw calls without changing them. A chart draws from an effect, after
// the commits that create its context and upload its data, so a sample can't wait for it from the
// interaction. Each sample mounts a new canvas: after its first draw pass — the current task, once
// the rest of the pass has run — a paint marker is added, which paints in the frame that submits the
// draw. That paint is the main thread's: the GPU executes the draw after it.
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
        queueMicrotask(appendPaintMarker);
      }
    },
  });
}

/**
 * Interaction passed to `reactBenchmark()` for WebGL benches: waits for the paint of the frame that
 * submits the chart's first WebGL draw, recorded as `bench:paint#webgl`, then asserts the canvas
 * actually drew something (no false pass on a dead software-WebGL context).
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
  expectWebGLCanvasDrawn();
}
