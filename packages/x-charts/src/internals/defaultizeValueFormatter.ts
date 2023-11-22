import { isFunction } from './utils';

function defaultizeValueFormatter<
  ISeries extends { valueFormatter?: IFormatter },
  IFormatter extends (v: any) => string,
>(
  series: {
    [id: string]: ISeries;
  },
  defaultValueFormatter: IFormatter,
): {
  [id: string]: ISeries & {
    valueFormatter: IFormatter;
  };
} {
  const defaultizedSeries: {
    [id: string]: ISeries & {
      valueFormatter: IFormatter;
    };
  } = {};
  Object.keys(series).forEach((seriesId) => {
    defaultizedSeries[seriesId] = {
      ...series[seriesId],
      valueFormatter: isFunction(series[seriesId]) ? series[seriesId] : defaultValueFormatter,
    };
  });
  return defaultizedSeries;
}

export default defaultizeValueFormatter;
