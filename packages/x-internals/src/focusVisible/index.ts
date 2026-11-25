type CssLength = string | number;

const toCssLength = (value: CssLength) => (typeof value === 'number' ? `${value}px` : value);

export function getFocusVisibleReach({
  outlineWidth = 0,
  outlineOffset = 0,
}: {
  outlineWidth?: CssLength;
  outlineOffset?: CssLength;
}) {
  if (typeof outlineWidth === 'number' && typeof outlineOffset === 'number') {
    return `${outlineWidth + outlineOffset}px`;
  }
  return `calc(${toCssLength(outlineWidth)} + ${toCssLength(outlineOffset)})`;
}
