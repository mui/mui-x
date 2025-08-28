import { useTheme } from '@mui/material/styles';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useRadiusAxes, useRotationAxis } from '../../hooks/useAxis';
import { ChartsRotationAxisProps, PolarAxisDefaultized } from '../../models/axis';
import { rad2deg } from '../../internals/angleConversion';
import { filterAttributeSafeProperties } from '../../internals/filterAttributeSafeProperties';
import { getDefaultBaseline, getDefaultTextAnchor } from '../../ChartsText/defaultTextPlacement';

export function useRadarMetricData() {
  const rotationAxis = useRotationAxis() as PolarAxisDefaultized<
    'point',
    any,
    ChartsRotationAxisProps
  >;
  const { scale: rotationScale, valueFormatter, labelGap = 10 } = rotationAxis;
  const { radiusAxis } = useRadiusAxes();
  const drawingArea = useDrawingArea();
  const theme = useTheme();

  const cx = drawingArea.left + drawingArea.width / 2;
  const cy = drawingArea.top + drawingArea.height / 2;

  const metrics = rotationScale.domain() as string[];
  const angles = metrics.map((key) => rotationScale(key)!);

  return {
    corners: metrics.map((metric, dataIndex) => {
      const radiusScale = radiusAxis[metric].scale;

      const r = radiusScale.range()[1] + labelGap;
      const angle = angles[dataIndex];
      const angleDeg = rad2deg(angle);
      const defaultTickLabel = metric;
      const { safe, unsafe } = filterAttributeSafeProperties({
        ...theme.typography.caption,
        fontSize: 12,
        lineHeight: 1.25,
        textAnchor: getDefaultTextAnchor(180 + angleDeg),
        dominantBaseline: getDefaultBaseline(180 + angleDeg),
        fill: (theme.vars || theme).palette.text.primary,
        stroke: 'none',
      });

      return {
        x: cx + r * Math.sin(angle),
        y: cy - r * Math.cos(angle),
        label:
          valueFormatter?.(metric, {
            location: 'tick',
            scale: rotationScale,
            defaultTickLabel,
          }) ?? defaultTickLabel,
        ...safe,
        style: unsafe,
      };
    }),
  };
}
