function defaultizeValueFormatter<ISeries extends {}, IFormatter extends (v: any) => string>(
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
      valueFormatter: defaultValueFormatter,
      ...series[seriesId],
    };
  });
  return defaultizedSeries;
}

export default defaultizeValueFormatter;
