import { pie as d3Pie } from '@mui/x-charts-vendor/d3-shape';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import { ChartsPieSorting, PieValueType } from '../models/seriesType/pie';
import { SeriesId } from '../models/seriesType/common';
import { getLabel } from '../internals/getLabel';
import { SeriesFormatter } from '../context/PluginProvider/SeriesFormatter.types';

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

const formatter: SeriesFormatter<'pie'> = (params) => {
  const { seriesOrder, series } = params;

  const defaultizedSeries: Record<SeriesId, ChartSeriesDefaultized<'pie'>> = {};
  seriesOrder.forEach((seriesId) => {
    const arcs = d3Pie()
      .startAngle((2 * Math.PI * (series[seriesId].startAngle ?? 0)) / 360)
      .endAngle((2 * Math.PI * (series[seriesId].endAngle ?? 360)) / 360)
      .padAngle((2 * Math.PI * (series[seriesId].paddingAngle ?? 0)) / 360)
      .sortValues(getSortingComparator(series[seriesId].sortingValues ?? 'none'))(
      series[seriesId].data.map((piePoint) => piePoint.value),
    );
    defaultizedSeries[seriesId] = {
      valueFormatter: (item: PieValueType) => item.value.toLocaleString(),
      ...series[seriesId],
      data: series[seriesId].data
        .map((item, index) => ({
          ...item,
          id: item.id ?? `auto-generated-pie-id-${seriesId}-${index}`,
          ...arcs[index],
        }))
        .map((item, index) => ({
          ...item,
          formattedValue:
            series[seriesId].valueFormatter?.(
              { ...item, label: getLabel(item.label, 'arc') },
              { dataIndex: index },
            ) ?? item.value.toLocaleString(),
        })),
    };
  });

  return {
    seriesOrder,
    series: defaultizedSeries,
  };
};

export default formatter;
