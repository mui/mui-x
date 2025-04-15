import * as React from 'react';
import { styled } from '@mui/material/styles';

const Rect = styled('rect')(({ theme }) => ({
  '&': {
    fill: (theme.vars || theme).palette.grey[500],
    cursor: 'ew-resize',
  },
}));

export const ChartPreviewHandle = React.forwardRef<
  SVGRectElement,
  Pick<React.ComponentProps<'rect'>, 'x' | 'y' | 'width' | 'height'>
>(function ChartPreviewHandle({ x, y, height }, ref) {
  return <Rect ref={ref} x={x} y={y} width={3} height={height} />;
});
