/**
 * Observes `element` and calls `onResize` with the latest entry in the next animation frame,
 * at most once per frame. Returns the cleanup function.
 *
 * React 17 renders a state update inside the observer callback synchronously. The layout change
 * inside the delivery makes the browser report a "ResizeObserver loop" error.
 */
export function observeResizeNextFrame(
  element: Element,
  onResize: (entry: ResizeObserverEntry) => void,
): () => void {
  let frame = 0;
  const observer = new ResizeObserver((entries) => {
    const entry = entries[entries.length - 1];
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => onResize(entry));
  });
  observer.observe(element);
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
  };
}
