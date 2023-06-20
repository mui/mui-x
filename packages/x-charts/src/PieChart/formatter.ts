import { pie as d3Pie } from 'd3-shape';
import { ChartSeriesDefaultized, Formatter } from '../models/seriesType/config';
import { PieValueType } from '../models/seriesType/pie';

const formatter: Formatter<'pie'> = (params) => {
  const { seriesOrder, series } = params;

  const defaultizedSeries: { [seriesId: string]: ChartSeriesDefaultized<'pie'> } = {};
  seriesOrder.forEach((seriesId) => {
    const arcs = d3Pie()(series[seriesId].data.map((piePoint) => piePoint.value));
    defaultizedSeries[seriesId] = {
      valueFormatter: (v: PieValueType) => v.value.toLocaleString(),
      ...series[seriesId],
      data: series[seriesId].data.map((piePoint, index) => ({ ...piePoint, ...arcs[index] })),
    };
  });

  return {
    seriesOrder,
    series: defaultizedSeries,
  };
};

export default formatter;
