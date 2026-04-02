import { styled } from '@mui/material/styles';
import { chartsPolarGridClasses } from './chartsPolarGridClasses';

export const PolarGridRoot = styled('g', {
  name: 'MuiChartsPolarGrid',
  slot: 'Root',
  overridesResolver: (props, styles) => [
    { [`&.${chartsPolarGridClasses.radialLine}`]: styles.radialLine },
    { [`&.${chartsPolarGridClasses.circularLine}`]: styles.circularLine },
    styles.root,
  ],
})({});

export const PolarGridLine = styled('line', {
  name: 'MuiChartsPolarGrid',
  slot: 'Line',
})(({ theme }) => ({
  stroke: (theme.vars || theme).palette.divider,
  shapeRendering: 'crispEdges',
  strokeWidth: 1,
}));

export const PolarGridCircle = styled('circle', {
  name: 'MuiChartsPolarGrid',
  slot: 'Line',
})(({ theme }) => ({
  stroke: (theme.vars || theme).palette.divider,
  fill: 'none',
  strokeWidth: 1,
}));
