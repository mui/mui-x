import { SeriesId } from '../models/seriesType/common';

function defaultizeValueFormatter<
  IFormatter extends (v: any, context?: unknown) => string,
  ISeries extends { valueFormatter?: Function },
>(
  series: Record<SeriesId, ISeries>,
  defaultValueFormatter: IFormatter,
): Record<SeriesId, ISeries & { valueFormatter: IFormatter }> {
  const defaultizedSeries: Record<SeriesId, ISeries & { valueFormatter: IFormatter }> = {};
  Object.keys(series).forEach((seriesId) => {
    defaultizedSeries[seriesId] = {
      ...series[seriesId],
      valueFormatter: (series[seriesId].valueFormatter as IFormatter) ?? defaultValueFormatter,
    };
  });
  return defaultizedSeries;
}

export default defaultizeValueFormatter;
