/**
 * Transform mouse event position to coordinates relative to the layer container.
 * (0, 0) is the top-left corner of the layer container.
 * @param element The the layer container
 * @param event The mouseEvent to transform
 */
export function getChartPoint(
  element: Element,
  event: Pick<MouseEvent, 'clientX' | 'clientY'>,
): DOMPoint {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (typeof DOMMatrix === 'undefined') {
    // Fallback for environments like JSDOM where DOMMatrix is not available.
    return { x, y, z: 0, w: 1, matrixTransform: () => ({ x, y, z: 0, w: 1 }) } as DOMPoint;
  }

  const style = getComputedStyle(element);
  const transform = new DOMMatrix(style.transform);
  const point = new DOMPoint(x, y);

  return point.matrixTransform(transform.inverse());
}
