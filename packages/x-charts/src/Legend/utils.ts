export type AnchorX = 'left' | 'right' | 'middle';
export type AnchorY = 'top' | 'bottom' | 'middle';
export type AnchorPosition = { horizontal: AnchorX; vertical: AnchorY };
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
  reference: AnchorPosition,
  elementSize: Size,
  inElement?: AnchorPosition,
) {
  const element = {
    ...inElement,
    horizontal: oposit[reference.horizontal],
    vertical: oposit[reference.vertical],
  };
  const translateLeft =
    getAnchorValue(reference.horizontal, referenceSize.width) -
    getAnchorValue(element.horizontal, elementSize.width);
  const translateTop =
    getAnchorValue(reference.vertical, referenceSize.height) -
    getAnchorValue(element.vertical, elementSize.height);

  return { left: translateLeft, top: translateTop };
}
