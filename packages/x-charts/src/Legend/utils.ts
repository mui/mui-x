type AnchorX = 'left' | 'right' | 'middle';
type AnchorY = 'top' | 'bottom' | 'middle';
type Anchor = { x: AnchorX; y: AnchorY };
type Size = { height: number; width: number };

const getAnchorValue = (anchor: AnchorX | AnchorY, value: number) => {
  switch (anchor) {
    case 'middle':
      return value / 2;
    case 'left':
    case 'top':
      return 0;
    default:
      return value;
  }
};

const oposit: { [k in AnchorX]: AnchorX } | { [k in AnchorY]: AnchorY } = {
  left: 'right',
  right: 'left',
  middle: 'middle',
  bottom: 'top',
  top: 'bottom',
};

export function getTranslateValues(
  referenceSize: Size,
  reference: Anchor,
  elementSize: Size,
  inElement?: Anchor,
) {
  const element = { ...inElement, x: oposit[reference.x], y: oposit[reference.y] };
  const translateLeft =
    getAnchorValue(reference.x, referenceSize.width) - getAnchorValue(element.x, elementSize.width);
  const translateTop =
    getAnchorValue(reference.y, referenceSize.height) -
    getAnchorValue(element.y, elementSize.height);

  return { left: translateLeft, top: translateTop };
}
