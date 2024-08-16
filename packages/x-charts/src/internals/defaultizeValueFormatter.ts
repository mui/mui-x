import { SeriesId, SeriesValueFormatter } from '../models/seriesType/common';

export function defaultizeValueFormatter<
  TValue,
  ISeries extends { valueFormatter?: SeriesValueFormatter<TValue> },
>(
  series: Record<SeriesId, ISeries>,
  defaultValueFormatter: SeriesValueFormatter<TValue>,
): Record<SeriesId, ISeries & { valueFormatter: SeriesValueFormatter<TValue> }> {
  const defaultizedSeries: Record<
    SeriesId,
    ISeries & { valueFormatter: SeriesValueFormatter<TValue> }
  > = {};
  Object.keys(series).forEach((seriesId) => {
    defaultizedSeries[seriesId] = {
      ...series[seriesId],
      valueFormatter: series[seriesId].valueFormatter ?? defaultValueFormatter,
    };
  });
  return defaultizedSeries;
}
