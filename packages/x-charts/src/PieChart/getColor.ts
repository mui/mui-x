import { DefaultizedPieSeriesType } from '../models/seriesType/pie';

export default function getColor(series: DefaultizedPieSeriesType) {
  return (dataIndex: number) => {
    return series.data[dataIndex].color;
  };
}
