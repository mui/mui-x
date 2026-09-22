'use client';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';

function getDevicePixelContentBoxSize(entry: ResizeObserverEntry) {
  // Safari does not support devicePixelContentBoxSize
  if (entry.devicePixelContentBoxSize) {
    return {
      width: entry.devicePixelContentBoxSize[0].inlineSize,
      height: entry.devicePixelContentBoxSize[0].blockSize,
    };
  }
  // These values not correct, but they're as close as you can get in Safari
  return {
    width: entry.contentBoxSize[0].inlineSize * devicePixelRatio,
    height: entry.contentBoxSize[0].blockSize * devicePixelRatio,
  };
}

/**
 * This hook calls the provided `onResize` callback whenever the WebGL canvas is resized.
 * It detects size changes when the element is resized, the browser zoom updates or the device pixel ratio changes.
 * These last two conditions aren't supported by Safari, so `onResize` won't be called in these cases on Safari.
 * @param gl The WebGL2 rendering context whose canvas to observe.
 * @param onResize Callback invoked after the canvas and viewport are updated.
 */
export function useWebGLResizeObserver(gl: WebGL2RenderingContext | null, onResize: () => void) {
  useEnhancedEffect(() => {
    const canvas = gl?.canvas;

    if (!(canvas instanceof HTMLCanvasElement)) {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = getDevicePixelContentBoxSize(entry);
        const drawingBufferWidth = Math.max(1, width);
        const drawingBufferHeight = Math.max(1, height);

        /* Only assign when the size actually changed: assigning `width`/`height` resets the drawing
         * buffer even when the value is unchanged, clearing what is currently on screen. */
        if (canvas.width !== drawingBufferWidth || canvas.height !== drawingBufferHeight) {
          canvas.width = drawingBufferWidth;
          canvas.height = drawingBufferHeight;
        }

        // Update WebGL viewport
        gl?.viewport(0, 0, drawingBufferWidth, drawingBufferHeight);

        onResize();
      }
    });

    try {
      /* We use 'device-pixel-content-box' to observe the size of the canvas in device pixels, rather than CSS pixels.
       * This ensures that we correctly handle high-DPI displays and browser zoom.
       * However, this is not supported in Safari, which throws, so we fall back to 'content-box'.
       * WebKit Bug: https://www2.webkit.org/show_bug.cgi?id=219005 */
      observer.observe(canvas, { box: 'device-pixel-content-box' });
    } catch {
      observer.observe(canvas, { box: 'content-box' });
    }

    return () => {
      observer.disconnect();
    };
  }, [gl, gl?.canvas, onResize]);
}
