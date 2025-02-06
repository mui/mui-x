import { useRotationScale } from '../../hooks/useScale';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useRadiusAxes } from '../../hooks';

export function useRadarGridData() {
  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis } = useRadiusAxes();
  const drawingArea = useDrawingArea();

  const cx = drawingArea.left + drawingArea.width / 2;
  const cy = drawingArea.top + drawingArea.height / 2;

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
      return {
        x: cx + r * Math.sin(angle),
        y: cy - r * Math.cos(angle),
      };
    }),
  };
}
