/**
 * Transform mouse event position to coordinates relative to the layer container.
 * (0, 0) is the top-left corner of the layer container.
 * @param element The the layer container
 * @param event The mouseEvent to transform
 */
export function getLayerRelativePoint(
  element: Element,
  event: Pick<MouseEvent, 'clientX' | 'clientY'>,
) {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  const transform = new DOMMatrix(style.transform);

  const point = new DOMPoint(event.clientX - rect.left, event.clientY - rect.top);

  return point.matrixTransform(transform.inverse());
}
