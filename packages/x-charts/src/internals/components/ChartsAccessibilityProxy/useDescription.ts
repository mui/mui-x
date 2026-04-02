import {
  useChartsLocalization,
  useRadiusAxes,
  useRotationAxes,
  useSeries,
  useXAxes,
  useYAxes,
} from '../../../hooks';
import { useStore } from '../../store/useStore';
import { selectorChartSeriesConfig } from '../../plugins/corePlugins/useChartSeriesConfig';
import { isCartesianSeries } from '../../isCartesian';
import { isPolarSeriesType } from '../../isPolar';
import { selectorChartsFocusedOrToFocusedItem } from '../../plugins/featurePlugins/useChartKeyboardNavigation';

/**
 * Get the message associated to the focused item.
 * @returns {string | null} the accessibility description linked to the focused item
 */
export function useDescription(): string | null {
  const store = useStore();
  const focusedItem = store.use(selectorChartsFocusedOrToFocusedItem);
  const seriesConfig = store.use(selectorChartSeriesConfig);

  const seriesState = useSeries();

  const { localeText } = useChartsLocalization();

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
    localeText,
  };

  if (isCartesianSeries(focusedSeries)) {
    const xAxisId = focusedSeries.xAxisId ?? xAxisIds[0];
    const yAxisId = focusedSeries.yAxisId ?? yAxisIds[0];
    descriptionParams.xAxis = xAxis[xAxisId];
    descriptionParams.yAxis = yAxis[yAxisId];
  }
  if (isPolarSeriesType(type)) {
    descriptionParams.rotationAxis = rotationAxis[rotationAxisIds[0]];
    descriptionParams.radiusAxis = radiusAxis[radiusAxisIds[0]];
  }

  return (descriptionGetter as (params: Record<string, unknown>) => string)(descriptionParams);
}
