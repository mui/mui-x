import { ColorProcessor } from '../../internals/plugins/models/seriesConfig';
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
