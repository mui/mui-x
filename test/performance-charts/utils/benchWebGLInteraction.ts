import { waitForWebGLToSettle } from './waitForWebGLToSettle';
import { expectWebGLCanvasDrawn } from './expectWebGLCanvasDrawn';

/**
 * Creates an interaction for `benchmark()` WebGL cases: waits for the WebGL
 * layer to settle (deterministic render counts) and asserts the canvas
 * actually drew something (no false pass on a dead software-WebGL context).
 *
 * A dead WebGL context is a systematic failure of the environment, not a
 * per-iteration one: if the first iteration drew, the others will too. Reading
 * pixels back is expensive under SwiftShader — `readPixels` synchronously
 * rasterizes the whole scene, costing seconds per iteration on big scenes,
 * which pushed heavy benches past the harness's 120s test timeout on CI. So
 * only the first iteration polls the canvas and asserts on its pixels; the
 * remaining iterations use the fixed settle window with no pixel reads, which
 * also keeps every measured iteration identical.
 *
 * Create one interaction per benchmark case (don't share instances) so each
 * case verifies its own first draw.
 */
export const createBenchWebGLInteraction = () => {
  let verified = false;
  return async () => {
    await waitForWebGLToSettle({ pollForContent: !verified });
    if (!verified) {
      expectWebGLCanvasDrawn();
      verified = true;
    }
  };
};
