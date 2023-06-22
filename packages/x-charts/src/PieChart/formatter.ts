import { pie as d3Pie } from 'd3-shape';
import { ChartSeriesDefaultized, Formatter } from '../models/seriesType/config';
import { ChartsPieSorting, PieValueType } from '../models/seriesType/pie';

const getSortingComparator = (comparator: ChartsPieSorting = 'none') => {
  if (typeof comparator === 'function') {
    return comparator;
  }
  switch (comparator) {
    case 'none':
      return null;
    case 'desc':
      return (a: number, b: number) => b - a;
    case 'asc':
      return (a: number, b: number) => a - b;
    default:
      return null;
  }
};

const formatter: Formatter<'pie'> = (params) => {
  const { seriesOrder, series } = params;

  const defaultizedSeries: { [seriesId: string]: ChartSeriesDefaultized<'pie'> } = {};
  seriesOrder.forEach((seriesId) => {
    const arcs = d3Pie()
      .startAngle((2 * Math.PI * (series[seriesId].startAngle ?? 0)) / 360)
      .endAngle((2 * Math.PI * (series[seriesId].endAngle ?? 360)) / 360)
      .padAngle((2 * Math.PI * (series[seriesId].paddingAngle ?? 0)) / 360)
      .sortValues(getSortingComparator(series[seriesId].sortingValues ?? 'none'))(
      series[seriesId].data.map((piePoint) => piePoint.value),
    );
    defaultizedSeries[seriesId] = {
      valueFormatter: (v: PieValueType) => v.value.toLocaleString(),
      ...series[seriesId],
      data: series[seriesId].data.map((piePoint, index) => ({
        ...piePoint,
        id: piePoint.id ?? `auto-generated-pie-id-${seriesId}-${index}`,
        ...arcs[index],
      })),
    };
  });

  return {
    seriesOrder,
    series: defaultizedSeries,
  };
};

export default formatter;
