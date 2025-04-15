import * as React from 'react';
import { styled } from '@mui/material/styles';

const Rect = styled('rect')(({ theme }) => ({
  '&': {
    fill: (theme.vars || theme).palette.grey[500],
  },
}));

export function ChartPreviewHandle({
  x,
  y,
  height,
}: Pick<React.ComponentProps<'rect'>, 'x' | 'y' | 'width' | 'height'>) {
  return <Rect x={x} y={y} width={2} height={height} />;
}
