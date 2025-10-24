import { ColorProcessor } from '../../internals/plugins/models/seriesConfig';
import { getSeriesColorFn } from '../../internals/getSeriesColorFn';

const getColor: ColorProcessor<'radar'> = (series) => {
  const getSeriesColor = getSeriesColorFn(series.color);

  return (dataIndex?: number) => {
    if (dataIndex === undefined) {
      return getSeriesColor(null);
    }

    const value = series.data[dataIndex];

    return getSeriesColor({ value, dataIndex });
  };
};

export default getColor;
