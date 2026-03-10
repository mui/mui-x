import { useRadiusAxes, useRotationAxes, useSeries, useXAxes, useYAxes } from '../hooks';
import { useFocusedItem } from '../hooks/useFocusedItem';
import { useStore } from '../internals/store/useStore';
import { selectorChartSeriesConfig } from '../internals/plugins/corePlugins/useChartSeriesConfig';
import { isCartesianSeries } from '../internals/isCartesian';
import { isPolarSeriesType } from '../internals/isPolar';

/**
 * Get the message associated to the focused item.
 * @returns {string | null} the accessibility description linked to the focused item
 */
export function useDescription(): string | null {
  const store = useStore();
  const focusedItem = useFocusedItem();
  const seriesConfig = store.use(selectorChartSeriesConfig);

  const seriesState = useSeries();

  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();
  const { rotationAxis, rotationAxisIds } = useRotationAxes();
  const { radiusAxis, radiusAxisIds } = useRadiusAxes();

  if (focusedItem === null) {
    return null;
  }
  const { type, seriesId } = focusedItem;
  const focusedSeries = seriesState[type]?.series[seriesId];

  if (!focusedSeries) {
    return null;
  }

  const descriptionGetter = seriesConfig[type]?.descriptionGetter;

  if (!descriptionGetter) {
    return null;
  }

  const descriptionParams: Record<string, unknown> = {
    identifier: focusedItem,
    series: focusedSeries,
  };

  if (isCartesianSeries(focusedSeries)) {
    const xAxisId = focusedSeries.xAxisId ?? xAxisIds[0];
    const yAxisId = focusedSeries.yAxisId ?? yAxisIds[0];
    descriptionParams.xAxis = xAxis[xAxisId];
    descriptionParams.yAxis = yAxis[yAxisId];
  } else if (isPolarSeriesType(type)) {
    descriptionParams.rotationAxis = rotationAxis[rotationAxisIds[0]];
    descriptionParams.radiusAxis = radiusAxis[radiusAxisIds[0]];
  }

  return (descriptionGetter as (params: Record<string, unknown>) => string)(descriptionParams);
}
