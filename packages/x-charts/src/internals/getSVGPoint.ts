/**
 * Transform mouse event position to coordinates inside the SVG.
 * @param svg The SVG element
 * @param event The mouseEvent to transform
 */
export function getSVGPoint(svg: HTMLElement, event: Pick<MouseEvent, 'clientX' | 'clientY'>) {
  const rect = svg.getBoundingClientRect();
  const style = getComputedStyle(svg);
  const transform = new DOMMatrix(style.transform);

  const point = new DOMPoint(event.clientX - rect.left, event.clientY - rect.top);

  return point.matrixTransform(transform.inverse());
}
