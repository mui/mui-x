import { waitForWebGLToSettle } from './waitForWebGLToSettle';
import { expectWebGLCanvasDrawn } from './expectWebGLCanvasDrawn';

/**
 * Interaction passed to `benchmark()` for WebGL benches: waits for the WebGL
 * layer to settle (deterministic render counts) then asserts the canvas
 * actually drew something (no false pass on a dead software-WebGL context).
 */
export const benchWebGLInteraction = async () => {
  await waitForWebGLToSettle();
  expectWebGLCanvasDrawn();
};
