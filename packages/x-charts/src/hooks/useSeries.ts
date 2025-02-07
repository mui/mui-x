'use client';
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
