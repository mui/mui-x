import { SeriesId } from '../models/seriesType/common';

function defaultizeValueFormatter<
  ISeries extends { valueFormatter?: IFormatter },
  IFormatter extends (v: any) => string,
>(
  series: Record<SeriesId, ISeries>,
  defaultValueFormatter: IFormatter,
): Record<SeriesId, ISeries & { valueFormatter: IFormatter }> {
  const defaultizedSeries: Record<SeriesId, ISeries & { valueFormatter: IFormatter }> = {};
  Object.keys(series).forEach((seriesId) => {
    defaultizedSeries[seriesId] = {
      ...series[seriesId],
      valueFormatter: series[seriesId].valueFormatter ?? defaultValueFormatter,
    };
  });
  return defaultizedSeries;
}

export default defaultizeValueFormatter;
