import { FormattedSeries } from '../context/SeriesContextProvider';

export type AnchorX = 'left' | 'right' | 'middle';
export type AnchorY = 'top' | 'bottom' | 'middle';

export type AnchorPosition = { horizontal: AnchorX; vertical: AnchorY };

export type SizingParams = {
  direction?: 'row' | 'column';
  markSize?: number;
  itemWidth?: number;
  spacing?: number;
};

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
