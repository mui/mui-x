import { useRotationScale } from '../../hooks/useScale';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useRadiusAxes } from '../../hooks';
import { UseChartPolarAxisSignature } from '../../internals/plugins/featurePlugins/useChartPolarAxis';
import { useChartContext } from '../../context/ChartProvider/useChartContext';

export function useRadarGridData() {
  const { instance } = useChartContext<[UseChartPolarAxisSignature]>();
  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis } = useRadiusAxes();
  const drawingArea = useDrawingArea();

  const cx = drawingArea.left + drawingArea.width / 2;
  const cy = drawingArea.top + drawingArea.height / 2;

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
