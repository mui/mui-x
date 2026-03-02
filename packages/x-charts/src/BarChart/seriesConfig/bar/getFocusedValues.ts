import type { FocusedValuesGetter } from '../../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusValuesGetter.types';

export const getFocusedValues: FocusedValuesGetter<'bar'> = (item, state) => {
  const series = state.series.defaultizedSeries.bar?.series[item.seriesId];

  const seriesLabel = typeof series?.label === 'function' ? series.label('legend') : series?.label;
  const seriesValue = series?.data?.[item.dataIndex] ?? null;

  if (series?.layout === 'horizontal') {
    const axisId = series?.yAxisId;

    const yAxis = state.cartesianAxis?.y.find((axis) => axis.id === axisId);
    const axisLabel = yAxis?.label;
    const axisValue = yAxis?.data?.[item.dataIndex!];

    return {
      axisLabel,
      axisValue,
      seriesLabel,
      seriesValue,
    };
  }
  const axisId = series?.xAxisId;

  const xAxis = state.cartesianAxis?.x.find((axis) => axis.id === axisId);
  const axisLabel = xAxis?.label;
  const axisValue = xAxis?.data?.[item.dataIndex!];

  return {
    axisLabel,
    axisValue,
    seriesLabel,
    seriesValue,
  };
};
