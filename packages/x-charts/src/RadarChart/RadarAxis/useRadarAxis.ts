import { warnOnce } from '@mui/x-internals/warning';
import { useRadiusAxes } from '../../hooks/useAxis';
import { useRotationScale } from '../../hooks/useScale';
import { useChartContext } from '../../context/ChartProvider/useChartContext';
import {
  selectorChartPolarCenter,
  type UseChartPolarAxisSignature,
} from '../../internals/plugins/featurePlugins/useChartPolarAxis';
import { isOrdinalScale } from '../../internals/scaleGuards';
import { degToRad } from '../../internals/degToRad';
import { clampAngle } from '../../internals/clampAngle';
import { rad2deg } from '../../internals/angleConversion';

export interface UseRadarAxisParams {
  /**
   * The metric to get.
   * If `undefined`, the hook returns `null`
   */
  metric?: string;
  /**
   * The absolute rotation angle of the metrics (in degree)
   * If not defined the metric angle will be used.
   */
  angle?: number;
  /**
   * The number of divisions with label.
   * @default 1
   */
  divisions?: number;
}

/**
 * Returns an array with on item par metrics with the different point to label.
 */
export function useRadarAxis(params: UseRadarAxisParams) {
  const { metric, angle, divisions = 1 } = params;

  const { instance, store } = useChartContext<[UseChartPolarAxisSignature]>();
  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis } = useRadiusAxes();

  const { cx, cy } = store.use(selectorChartPolarCenter);

  if (metric === undefined || !rotationScale || rotationScale.domain().length === 0) {
    return null;
  }

  const existingMetrics = rotationScale.domain() as (string | number)[];

  if (!existingMetrics.includes(metric)) {
    warnOnce([
      `MUI X Charts: You radar axis try displaying values for the metric "${metric}" which does nto exist.`,
      `either add this metric to your radar, or pick one from the existing metrics: ${existingMetrics.join(', ')}`,
    ]);
  }

  const anglesWithDefault = angle !== undefined ? degToRad(angle) : (rotationScale(metric) ?? 0);

  const radiusRatio = Array.from({ length: divisions }, (_, index) => (index + 1) / divisions);

  const radiusScale = radiusAxis[metric].scale;
  const R = radiusScale.range()[1];

  if (isOrdinalScale(radiusScale)) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('MUI X Charts: Radar chart does not support ordinal axes');
    }
    return null;
  }

  return {
    metric,
    angle: clampAngle(rad2deg(anglesWithDefault)),
    center: { x: cx, y: cy },
    labels: radiusRatio.map((ratio) => {
      const radius = ratio * R;
      const [x, y] = instance.polar2svg(radius, anglesWithDefault);

      const value = radiusScale.invert(radius);
      const defaultTickLabel = value.toString();
      return {
        x,
        y,
        value,
        formattedValue:
          radiusAxis[metric].valueFormatter?.(radiusScale.invert(radius), {
            location: 'tick',
            scale: radiusScale,
            defaultTickLabel,
            tickNumber: divisions,
          }) ?? defaultTickLabel,
      };
    }),
  };
}
