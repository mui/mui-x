import { useRadiusAxes } from '../../hooks/useAxis';
import { useRadarSeries } from '../../hooks/useRadarSeries';
import { useRotationScale } from '../../hooks/useScale';
import { useSelector } from '../../internals/store/useSelector';
import { useStore } from '../../internals/store/useStore';
import { useChartContext } from '../../context/ChartProvider/useChartContext';
import {
  selectorChartPolarCenter,
  UseChartPolarAxisSignature,
} from '../../internals/plugins/featurePlugins/useChartPolarAxis';
import {
  UseChartCartesianAxisSignature,
  selectorChartsInteractionXAxisIndex,
  selectorChartsInteractionXAxisValue,
} from '../../internals/plugins/featurePlugins/useChartCartesianAxis';
import { AxisId } from '../../models/axis';
import { DefaultizedRadarSeriesType } from '../../models/seriesType/radar';
import { ChartInstance } from '../../internals/plugins/models';

interface UseRadarAxisHighlightParams {
  /**
   * If true, coordinates of the previous/next point will be added.
   */
  includesNeighbors?: boolean;
}

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
  points: Points[];
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

interface Points {
  highlighted: Point;
  previous?: Point;
  next?: Point;
}

export function useRadarAxisHighlight(
  params?: UseRadarAxisHighlightParams,
): UseRadarAxisHighlightReturnValue | null {
  const { includesNeighbors = false } = params ?? {};

  const radarSeries = useRadarSeries();

  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis, radiusAxisIds } = useRadiusAxes();

  const { instance } = useChartContext<[UseChartPolarAxisSignature]>();

  const store = useStore<[UseChartCartesianAxisSignature]>();
  const xAxisInteractionIndex = useSelector(store, selectorChartsInteractionXAxisIndex);
  const xAxisInteractionValue = useSelector(store, selectorChartsInteractionXAxisValue);
  const center = useSelector(store, selectorChartPolarCenter);

  const highlightedIndex = xAxisInteractionIndex;

  if (highlightedIndex === null || highlightedIndex < 0) {
    return null;
  }

  if (radarSeries === undefined || radarSeries.length === 0) {
    return null;
  }

  const metric = radiusAxisIds[highlightedIndex];
  const radiusScale = radiusAxis[metric].scale;
  const angle = rotationScale(xAxisInteractionValue as unknown as string)!;
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

      const retrunedValue: Points = {
        highlighted: {
          x,
          y,
          r,
          angle,
          value,
        },
      };
      if (!includesNeighbors) {
        return retrunedValue;
      }

      const dataLength = series.data.length;

      const prevIndex = (dataLength + highlightedIndex - 1) % dataLength;
      const nextIndex = (highlightedIndex + 1) % dataLength;

      const prevValue = series.data[prevIndex];
      const nextValue = series.data[nextIndex];

      if (prevValue != null) {
        const prevR = radiusAxis[radiusAxisIds[prevIndex]].scale(prevValue)!;
        const prevAngle = rotationScale(rotationScale.domain()[prevIndex])!;
        const [px, py] = instance.polar2svg(prevR, prevAngle);

        retrunedValue.previous = {
          x: px,
          y: py,
          r: prevR,
          angle: prevAngle,
          value: prevValue,
        };
      }

      if (nextValue != null) {
        const nextR = radiusAxis[radiusAxisIds[nextIndex]].scale(nextValue)!;
        const nextAngle = rotationScale(rotationScale.domain()[nextIndex])!;
        const [nx, ny] = instance.polar2svg(nextR, nextAngle);

        retrunedValue.next = {
          x: nx,
          y: ny,
          r: nextR,
          angle: nextAngle,
          value: nextValue,
        };
      }
      return retrunedValue;
    }),
  };
}
