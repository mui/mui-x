import { pie as d3Pie } from '@mui/x-charts-vendor/d3-shape';
import { ChartSeriesDefaultized } from '../../models/seriesType/config';
import { ChartsPieSorting, PieValueType } from '../../models/seriesType/pie';
import { SeriesId } from '../../models/seriesType/common';
import { getLabel } from '../../internals/getLabel';
import { SeriesProcessor } from '../../internals/plugins/models';
import { deg2rad } from '../../internals/angleConversion';

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

const seriesProcessor: SeriesProcessor<'pie'> = (params, dataset, hiddenIdentifiers) => {
  const { seriesOrder, series } = params;

  const defaultizedSeries: Record<SeriesId, ChartSeriesDefaultized<'pie'>> = {};
  seriesOrder.forEach((seriesId) => {
    // Build a map of hidden item IDs for this series
    const hiddenItemIds = new Set(
      hiddenIdentifiers
        ?.filter((item) => item.seriesId === seriesId)
        .map((item) => item.itemId)
        .filter((id): id is string | number => id !== undefined) ?? [],
    );

    // Filter out hidden data points for arc calculation
    const visibleData = series[seriesId].data.filter((piePoint, index) => {
      const itemId = piePoint.id ?? `auto-generated-pie-id-${seriesId}-${index}`;
      return !hiddenItemIds.has(itemId);
    });

    const visibleArcs = d3Pie()
      .startAngle(deg2rad(series[seriesId].startAngle ?? 0))
      .endAngle(deg2rad(series[seriesId].endAngle ?? 360))
      .padAngle(deg2rad(series[seriesId].paddingAngle ?? 0))
      .sortValues(getSortingComparator(series[seriesId].sortingValues ?? 'none'))(
      visibleData.map((piePoint) => piePoint.value),
    );

    // Map arcs back to original data, maintaining original indices
    let visibleIndex = 0;
    defaultizedSeries[seriesId] = {
      labelMarkType: 'circle',
      valueFormatter: (item: PieValueType) => item.value.toLocaleString(),
      ...series[seriesId],
      hidden: false,
      data: series[seriesId].data.map((item, index) => {
        const itemId = item.id ?? `auto-generated-pie-id-${seriesId}-${index}`;
        const isHidden = hiddenItemIds.has(itemId);
        let arcData;

        if (isHidden) {
          // For hidden items, create a zero-size arc starting at the previous visible arc's end angle
          // and ending at the same angle
          const startAngle =
            visibleIndex > 0
              ? visibleArcs[visibleIndex - 1].endAngle
              : deg2rad(series[seriesId].startAngle ?? 0);

          arcData = {
            startAngle,
            endAngle: startAngle,
            padAngle: 0,
            value: item.value,
            index,
          };
        } else {
          arcData = visibleArcs[visibleIndex];
          visibleIndex += 1;
        }

        const processedItem = {
          ...item,
          id: itemId,
          ...arcData,
        };

        return {
          labelMarkType: 'circle',
          ...processedItem,
          formattedValue:
            series[seriesId].valueFormatter?.(
              { ...processedItem, label: getLabel(processedItem.label, 'arc') },
              { dataIndex: index },
            ) ?? processedItem.value.toLocaleString(),
        };
      }),
    };
  });

  return {
    seriesOrder,
    series: defaultizedSeries,
  };
};

export default seriesProcessor;
