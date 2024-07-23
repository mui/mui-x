export type SymbolsTypes = 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
// Returns the index of a defined shape
export function getSymbol(shape: SymbolsTypes): number {
  const symbolNames = 'circle cross diamond square star triangle wye'.split(/ /);

  return symbolNames.indexOf(shape) || 0;
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

/**
 * Transform mouse event position to coordinates inside the SVG.
 * @param svg The SVG element
 * @param event The mouseEvent to transform
 */
export function getSVGPoint(svg: SVGSVGElement, event: MouseEvent) {
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  return pt.matrixTransform(svg.getScreenCTM()!.inverse());
}

/**
 * Helper that converts values and percentages into values.
 * @param value The value provided by the developer. Can either be a number or a string with '%' or 'px'.
 * @param refValue The numerical value associated to 100%.
 * @returns The numerical value associated to the provided value.
 */
export function getPercentageValue(value: number | string, refValue: number) {
  if (typeof value === 'number') {
    return value;
  }
  if (value === '100%') {
    // Avoid potential rounding issues
    return refValue;
  }
  if (value.endsWith('%')) {
    const percentage = Number.parseFloat(value.slice(0, value.length - 1));
    if (!Number.isNaN(percentage)) {
      return (percentage * refValue) / 100;
    }
  }
  if (value.endsWith('px')) {
    const val = Number.parseFloat(value.slice(0, value.length - 2));
    if (!Number.isNaN(val)) {
      return val;
    }
  }
  throw Error(
    `MUI-Charts: Received an unknown value "${value}". It should be a number, or a string with a percentage value.`,
  );
}

/**
 * Remove spaces to have viable ids
 */
export function cleanId(id: string) {
  return id.replace(' ', '_');
}
