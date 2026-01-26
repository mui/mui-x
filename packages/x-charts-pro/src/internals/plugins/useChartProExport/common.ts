export function createExportIframe(title?: string): HTMLIFrameElement {
  const iframeEl = document.createElement('iframe');
  iframeEl.style.position = 'absolute';
  iframeEl.style.width = '0px';
  iframeEl.style.height = '0px';
  iframeEl.title = title || document.title;
  return iframeEl;
}

/**
 * Applies styles to an element and returns the previous styles.
 */
export function applyStyles(
  element: HTMLElement | SVGElement,
  styles: Record<string, string | null>,
) {
  const previousStyles: Record<string, string | null> = {};

  Object.entries(styles).forEach(([key, value]) => {
    const prev = element.style.getPropertyValue(key);

    previousStyles[key] = prev;

    element.style.setProperty(key, value);
  });

  return previousStyles;
}

/**
 * Copies the content of all canvases from the original element to the cloned element.
 */
export function copyCanvasesContent(original: Element, clone: Element) {
  const originalCanvases = original.querySelectorAll('canvas');
  const cloneCanvases = clone.querySelectorAll('canvas');

  const promises = Array.from(originalCanvases).map(async (originalCanvas, index) => {
    return new Promise<void>((resolve, reject) => {
      const cloneCanvas = cloneCanvases[index];
      if (cloneCanvas) {
        const dataURL = originalCanvas.toDataURL();

        const img = cloneCanvas.ownerDocument.createElement('img');
        img.src = dataURL;
        img.width = cloneCanvas.width;
        img.height = cloneCanvas.height;

        for (const styleKey in cloneCanvas.style) {
          if (!Object.hasOwn(img.style, styleKey) || !Object.hasOwn(cloneCanvas.style, styleKey)) {
            continue;
          }

          img.style[styleKey] = cloneCanvas.style[styleKey];
        }

        cloneCanvas.replaceWith(img);

        img.onload = () => {
          resolve();
        };
        img.onerror = (event) => {
          reject(event);
        };
      } else {
        resolve();
      }
    });
  });

  return Promise.all(promises);
}
