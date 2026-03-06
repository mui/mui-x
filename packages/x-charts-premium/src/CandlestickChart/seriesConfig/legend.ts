import { getLabel, type LegendGetter } from '@mui/x-charts/internals';
import type { SeriesLegendItemParams } from '@mui/x-charts/ChartsLegend';

const legendGetter: LegendGetter<'ohlc'> = (params) => {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce<SeriesLegendItemParams[]>((acc, seriesId) => {
    const formattedLabel = getLabel(series[seriesId].label, 'legend');

    if (formattedLabel === undefined) {
      return acc;
    }

    acc.push({
      type: 'ohlc',
      markType: series[seriesId].labelMarkType,
      seriesId,
      color: series[seriesId].color,
      label: formattedLabel,
    });

    return acc;
  }, []);
};

export default legendGetter;
