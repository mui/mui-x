import { useRotationScale } from '../../hooks/useScale';
import { useRadiusAxes } from '../../hooks';
import {
  selectorChartPolarCenter,
  UseChartPolarAxisSignature,
} from '../../internals/plugins/featurePlugins/useChartPolarAxis';
import { useChartContext } from '../../context/ChartProvider/useChartContext';
import { useSelector } from '../../internals/store/useSelector';

export function useRadarGridData() {
  const { instance, store } = useChartContext<[UseChartPolarAxisSignature]>();
  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis } = useRadiusAxes();

  const { cx, cy } = useSelector(store, selectorChartPolarCenter);

  if (!rotationScale || rotationScale.domain().length === 0) {
    return null;
  }

  const metrics = rotationScale.domain() as (string | number)[];
  const angles = metrics.map((key) => rotationScale(key)!);

  return {
    center: {
      x: cx,
      y: cy,
    },
    corners: metrics.map((metric, dataIndex) => {
      const radiusScale = radiusAxis[metric].scale;

      const r = radiusScale.range()[1];
      const angle = angles[dataIndex];
      const [x, y] = instance.polar2svg(r, angle);
      return {
        x,
        y,
      };
    }),
    radius: radiusAxis[metrics[0]].scale.range()[1],
  };
}
