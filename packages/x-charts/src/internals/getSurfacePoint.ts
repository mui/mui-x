/**
 * Transform mouse event position to coordinates inside the SVG surface or the layer container.
 * @param element The SVG surface or the layer container
 * @param event The mouseEvent to transform
 */
export function getSurfacePoint(element: Element, event: Pick<MouseEvent, 'clientX' | 'clientY'>) {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  const transform = new DOMMatrix(style.transform);

  const point = new DOMPoint(event.clientX - rect.left, event.clientY - rect.top);

  return point.matrixTransform(transform.inverse());
}
