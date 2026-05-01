'use client';
import { styled } from '@mui/material/styles';

export const StyledText = styled('text', {
  slot: 'internal',
  shouldForwardProp: undefined,
})(({ theme }) => ({
  ...theme.typography.body2,
  stroke: 'none',
  fill: (theme.vars || theme).palette.text.primary,
  shapeRendering: 'crispEdges',
  textAnchor: 'middle',
  dominantBaseline: 'middle',
}));
