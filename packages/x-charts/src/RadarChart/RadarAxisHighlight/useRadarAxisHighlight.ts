import { useRadiusAxes } from '../../hooks/useAxis';
import { useRadarSeries } from '../../hooks/useRadarSeries';
import { useRotationScale } from '../../hooks/useScale';
import { useStore } from '../../internals/store/useStore';
import { useChartContext } from '../../context/ChartProvider/useChartContext';
import {
  selectorChartPolarCenter,
  type UseChartPolarAxisSignature,
} from '../../internals/plugins/featurePlugins/useChartPolarAxis';
import { type AxisId } from '../../models/axis';
import { type DefaultizedRadarSeriesType } from '../../models/seriesType/radar';
import { type ChartInstance } from '../../internals/plugins/models';
import {
  selectorChartsInteractionRotationAxisIndex,
  selectorChartsInteractionRotationAxisValue,
} from '../../internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarInteraction.selectors';

interface UseRadarAxisHighlightReturnValue {
  /**
   * The radar center.
   */
  center: { cx: number; cy: number };
  /**
   * The radar radius.
   */
  radius: number;
  /**
   * The index of the highlighted axis.
   */
  highlightedIndex: number;
  /**
   * The id of the highlighted axis.
   */
  highlightedMetric: AxisId;
  /**
   * The angle (in radians) of the  highlighted axis.
   */
  highlightedAngle: number;
  /**
   * The radar series.
   */
  series: DefaultizedRadarSeriesType[];
  /**
   * The { x, y, value } values for the highlighted points in the same order as the `series` array.
   * If `includesNeighbors` is set to `true` it also contains the information for `previous` and `next` data point.
   */
  points: Point[];
  /**
   * Charts instances giving access to `polar2svg` and `svg2polar` helpers.
   */
  instance: ChartInstance<[UseChartPolarAxisSignature], []>;
}

interface Point {
  x: number;
  y: number;
  r: number;
  angle: number;
  value: number;
}

export function useRadarAxisHighlight(): UseRadarAxisHighlightReturnValue | null {
  const radarSeries = useRadarSeries();

  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis, radiusAxisIds } = useRadiusAxes();

  const { instance } = useChartContext<[UseChartPolarAxisSignature]>();

  const store = useStore<[UseChartPolarAxisSignature]>();
  const rotationAxisIndex = store.use(selectorChartsInteractionRotationAxisIndex);
  const rotationAxisValue = store.use(selectorChartsInteractionRotationAxisValue);

  const center = store.use(selectorChartPolarCenter);

  const highlightedIndex = rotationAxisIndex;

  if (!rotationScale) {
    return null;
  }

  if (highlightedIndex === null || highlightedIndex === -1) {
    return null;
  }

  if (radarSeries === undefined || radarSeries.length === 0) {
    return null;
  }

  const metric = radiusAxisIds[highlightedIndex];
  const radiusScale = radiusAxis[metric].scale;
  const angle = rotationScale(rotationAxisValue)!;
  const radius = radiusScale.range()[1];

  return {
    center,
    radius,
    instance,
    highlightedIndex,
    highlightedMetric: metric,
    highlightedAngle: angle,
    series: radarSeries,
    points: radarSeries.map((series) => {
      const value = series.data[highlightedIndex];

      const r = radiusScale(value)!;
      const [x, y] = instance.polar2svg(r, angle);

      const returnedValue: Point = {
        x,
        y,
        r,
        angle,
        value,
      };

      return returnedValue;
    }),
  };
}
