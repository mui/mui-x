import { FormattedSeries } from '../context/SeriesContextProvider';

export type AnchorX = 'left' | 'right' | 'middle';
export type AnchorY = 'top' | 'bottom' | 'middle';

export type AnchorPosition = { horizontal: AnchorX; vertical: AnchorY };

type Size = { height: number; width: number };

// TODO: remove unused function if we agree to go in the direction of CSS vars
export type SizingParams = {
  direction?: 'row' | 'column';
  markSize?: number;
  itemWidth?: number;
  spacing?: number;
};

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

const oposit: { [k in AnchorX | AnchorY]: AnchorX | AnchorY } = {
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

export function getSeriesToDisplay(series: FormattedSeries) {
  return Object.values(series)
    .flatMap((s) => s.seriesOrder.map((seriesId) => s.series[seriesId]))
    .filter((s) => s.label !== undefined);
}

export function getLegendSize(itemNumber: number, params: Required<SizingParams>) {
  const { direction, markSize, itemWidth, spacing } = params;
  if (direction === 'row') {
    const width = itemWidth * itemNumber + spacing * (itemNumber - 1);
    const height = markSize;
    return { width, height };
  }
  const width = itemWidth;
  const height = markSize * itemNumber + spacing * (itemNumber - 1);
  return { width, height };
}
