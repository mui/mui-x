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
