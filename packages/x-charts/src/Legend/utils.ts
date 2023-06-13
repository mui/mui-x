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
