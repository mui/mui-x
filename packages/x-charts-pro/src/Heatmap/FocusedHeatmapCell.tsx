import { useTheme } from '@mui/material/styles';
import { getOrdinalPosition } from '@mui/x-charts/internals';
import { useFocusedItem, useXScale, useYScale } from '../hooks';

export function FocusedHeatmapCell(props: React.SVGAttributes<SVGRectElement>) {
  const focusedItem = useFocusedItem();
  const theme = useTheme();
  const xScale = useXScale<'band'>();
  const yScale = useYScale<'band'>();

  if (!focusedItem || focusedItem.type !== 'heatmap') {
    return null;
  }

  const xDomain = xScale.domain();
  const yDomain = yScale.domain();
  const { xIndex, yIndex } = focusedItem;
  return (
    <rect
      x={getOrdinalPosition(xScale, xDomain, xIndex)}
      y={getOrdinalPosition(yScale, yDomain, yIndex)}
      width={xScale.bandwidth()}
      height={yScale.bandwidth()}
      fill="none"
      stroke={(theme.vars ?? theme).palette.text.primary}
      strokeWidth={2}
      pointerEvents="none"
      {...props}
    />
  );
}
