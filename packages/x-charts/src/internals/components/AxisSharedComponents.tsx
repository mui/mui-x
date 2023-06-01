import { styled } from '@mui/material/styles';

export const Line = styled('line', {
  name: 'MuiAxis',
  slot: 'Line',
  overridesResolver: (props, styles) => styles.line,
})(({ theme }) => ({
  stroke: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
}));

export const Tick = styled('line', {
  name: 'MuiAxis',
  slot: 'Tick',
  overridesResolver: (props, styles) => styles.tick,
})(({ theme }) => ({
  stroke: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
}));

export const TickLabel = styled('text', {
  name: 'MuiAxis',
  slot: 'TickLabel',
  overridesResolver: (props, styles) => styles.tickLabel,
})(({ theme }) => ({
  ...theme.typography.caption,
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
}));

export const Label = styled('text', {
  name: 'MuiAxis',
  slot: 'Label',
  overridesResolver: (props, styles) => styles.label,
})(({ theme }) => ({
  ...theme.typography.body1,
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
}));
