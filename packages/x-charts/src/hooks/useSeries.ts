import * as React from 'react';
import { FormattedSeries, SeriesContext } from '../context/SeriesProvider';

/**
 * Get access to the internal state of series.
 * Structured by type of series:
 * { seriesType?: { series: { id1: precessedValue, ... }, seriesOrder: [id1, ...] } }
 * @returns FormattedSeries series
 */
export function useSeries(): FormattedSeries {
  const { isInitialized, data } = React.useContext(SeriesContext);

  if (!isInitialized) {
    throw new Error(
      [
        'MUI X: Could not find the series ref context.',
        'It looks like you rendered your component outside of a ChartsContainer parent component.',
      ].join('\n'),
    );
  }

  return data;
}

/**
 * Get access to the internal state of pie series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns { series: Record<SeriesId, DefaultizedPieSeriesType>; seriesOrder: SeriesId[]; } | undefined pieSeries
 */
export function usePieSeries(): FormattedSeries['pie'] {
  const series = useSeries();

  return React.useMemo(() => series.pie, [series.pie]);
}

/**
 * Get access to the internal state of line series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns { series: Record<SeriesId, DefaultizedLineSeriesType>; seriesOrder: SeriesId[]; } | undefined lineSeries
 */
export function useLineSeries(): FormattedSeries['line'] {
  const series = useSeries();

  return React.useMemo(() => series.line, [series.line]);
}

/**
 * Get access to the internal state of bar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns { series: Record<SeriesId, DefaultizedBarSeriesType>; seriesOrder: SeriesId[]; } | undefined barSeries
 */
export function useBarSeries(): FormattedSeries['bar'] {
  const series = useSeries();

  return React.useMemo(() => series.bar, [series.bar]);
}

/**
 * Get access to the internal state of scatter series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns { series: Record<SeriesId, DefaultizedScatterSeriesType>; seriesOrder: SeriesId[]; } | undefined scatterSeries
 */
export function useScatterSeries(): FormattedSeries['scatter'] {
  const series = useSeries();

  return React.useMemo(() => series.scatter, [series.scatter]);
}
