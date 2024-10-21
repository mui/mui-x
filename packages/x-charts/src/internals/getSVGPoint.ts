/**
 * Transform mouse event position to coordinates inside the SVG.
 * @param svg The SVG element
 * @param event The mouseEvent to transform
 */
export function getSVGPoint(svg: SVGSVGElement, event: Pick<MouseEvent, 'clientX' | 'clientY'>) {
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  return pt.matrixTransform(svg.getScreenCTM()!.inverse());
}
