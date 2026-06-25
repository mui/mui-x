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
 * Calls `onResize` whenever the WebGL canvas changes size, including on browser zoom / device pixel
 * ratio changes. Most browsers detect everything via the `ResizeObserver`; Safari needs a separate
 * `matchMedia` listener for zoom (see below).
 * @param gl The WebGL2 rendering context whose canvas to observe.
 * @param onResize Callback invoked after the canvas and viewport are updated.
 */
export function useWebGLResizeObserver(gl: WebGL2RenderingContext | null, onResize: () => void) {
  useEnhancedEffect(() => {
    const canvas = gl?.canvas;

    if (!(canvas instanceof HTMLCanvasElement)) {
      return undefined;
    }

    const resize = (width: number, height: number) => {
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      gl?.viewport(0, 0, canvas.width, canvas.height);

      onResize();
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = getDevicePixelContentBoxSize(entry);
        resize(width, height);
      }
    });

    let observesDevicePixels = true;
    try {
      // 'device-pixel-content-box' reports device pixels (handles high-DPI + zoom), but Safari throws.
      // WebKit bug: https://www2.webkit.org/show_bug.cgi?id=219005
      observer.observe(canvas, { box: 'device-pixel-content-box' });
    } catch {
      observesDevicePixels = false;
      observer.observe(canvas, { box: 'content-box' });
    }

    /* The 'content-box' fallback (Safari) doesn't fire on zoom. Safari 26.5+ updates `devicePixelRatio`
     * on zoom (WebKit bug https://bugs.webkit.org/show_bug.cgi?id=124862), so watch it via a matchMedia
     * resolution query and re-derive the device-pixel size from the canvas' CSS size. The query is tied
     * to the current dppx value, so re-point it after each change. Older Safari never fires it. */
    // cspell:ignore dppx
    let mql: MediaQueryList | null = null;
    const handleDevicePixelRatioChange = () => {
      resize(canvas.clientWidth * devicePixelRatio, canvas.clientHeight * devicePixelRatio);
      mql?.removeEventListener('change', handleDevicePixelRatioChange);
      mql = matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
      mql.addEventListener('change', handleDevicePixelRatioChange);
    };
    if (!observesDevicePixels) {
      mql = matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
      mql.addEventListener('change', handleDevicePixelRatioChange);
    }

    return () => {
      observer.disconnect();
      mql?.removeEventListener('change', handleDevicePixelRatioChange);
    };
  }, [gl, gl?.canvas, onResize]);
}
