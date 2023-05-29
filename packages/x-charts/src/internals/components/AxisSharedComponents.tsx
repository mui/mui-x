import { styled } from '@mui/material/styles';

export const Line = styled('line', {
  name: 'MuiChartsAxis',
  slot: 'Line',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  stroke: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
}));

export const Tick = styled('line', {
  name: 'MuiChartsAxis',
  slot: 'Tick',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  stroke: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
}));

export const TickLabel = styled('text', {
  name: 'MuiChartsAxis',
  slot: 'TickLabel',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  ...theme.typography.caption,
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
}));

export const Label = styled('text', {
  name: 'MuiChartsAxis',
  slot: 'Label',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  ...theme.typography.body1,
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
}));
