import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useRadiusAxes, useRotationAxis } from '../../hooks/useAxis';
import { ChartsRotationAxisProps, PolarAxisDefaultized } from '../../models/axis';

export function useRadarMetricData() {
  const rotationAxis = useRotationAxis() as PolarAxisDefaultized<
    'point',
    any,
    ChartsRotationAxisProps
  >;
  const { scale: rotationScale, valueFormatter, labelGap = 10 } = rotationAxis;
  const { radiusAxis } = useRadiusAxes();
  const drawingArea = useDrawingArea();

  const cx = drawingArea.left + drawingArea.width / 2;
  const cy = drawingArea.top + drawingArea.height / 2;

  const metrics = rotationScale.domain() as string[];
  const angles = metrics.map((key) => rotationScale(key)!);

  return {
    corners: metrics.map((metric, dataIndex) => {
      const radiusScale = radiusAxis[metric].scale;

      const r = radiusScale.range()[1] + labelGap;
      const angle = angles[dataIndex];
      return {
        x: cx + r * Math.sin(angle),
        y: cy - r * Math.cos(angle),
        angle: (angle * 180) / Math.PI,
        label: valueFormatter?.(metric, { location: 'tick', scale: rotationScale }) ?? metric,
      };
    }),
  };
}
