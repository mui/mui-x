import * as React from 'react';
import { ChartsSeriesConfig } from '../models/seriesType/config';
import { SeriesId } from '../models/seriesType/common';
import { useSeries } from '../hooks';

export function useSeriesOfType<T extends keyof ChartsSeriesConfig>(
  seriesType: T,
  ...seriesIds: SeriesId[]
) {
  const series = useSeries();

  return React.useMemo(
    () => {
      if (seriesIds.length === 0) {
        return series[seriesType];
      }

      if (seriesIds.length === 1) {
        return series?.[seriesType]?.series[seriesIds[0]];
      }

      return seriesIds.map((id) => series?.[seriesType]?.series[id]).filter(Boolean);
    },
    // DANGER: Ensure that the dependencies array is correct.
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series[seriesType], ...seriesIds],
  );
}
