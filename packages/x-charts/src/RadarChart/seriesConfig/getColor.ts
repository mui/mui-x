import { type ColorProcessor } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getSeriesColorFn } from '../../internals/getSeriesColorFn';

const getColor: ColorProcessor<'radar'> = (series) => {
  const getSeriesColor = getSeriesColorFn(series);

  return (dataIndex?: number) => {
    if (dataIndex === undefined) {
      return series.color;
    }

    const value = series.data[dataIndex];

    return getSeriesColor({ value, dataIndex });
  };
};

export default getColor;
