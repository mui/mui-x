import { styled } from '@mui/material/styles';
import { chartsRadialGridClasses } from './chartsRadialGridClasses';

export const GridRoot = styled('g', {
  name: 'MuiChartsRadialGrid',
  slot: 'Root',
  overridesResolver: (props, styles) => [
    { [`&.${chartsRadialGridClasses.rotationLine}`]: styles.rotationLine },
    { [`&.${chartsRadialGridClasses.radiusLine}`]: styles.radiusLine },
    styles.root,
  ],
})({});

export const GridLine = styled('line', {
  name: 'MuiChartsRadialGrid',
  slot: 'Line',
})(({ theme }) => ({
  stroke: (theme.vars || theme).palette.divider,
  shapeRendering: 'crispEdges',
  strokeWidth: 1,
  fill: 'none',
}));

export const GridCircle = styled('circle', {
  name: 'MuiChartsRadialGrid',
  slot: 'Line',
})(({ theme }) => ({
  stroke: (theme.vars || theme).palette.divider,
  shapeRendering: 'crispEdges',
  strokeWidth: 1,
  fill: 'none',
}));
