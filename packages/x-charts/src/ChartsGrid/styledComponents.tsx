import { styled } from '@mui/material/styles';
import { chartsGridClasses } from './chartsGridClasses';

export const GridRoot = styled('g', {
  name: 'MuiChartsGrid',
  slot: 'Root',
  overridesResolver: (props, styles) => [
    { [`&.${chartsGridClasses.verticalLine}`]: styles.verticalLine },
    { [`&.${chartsGridClasses.horizontalLine}`]: styles.horizontalLine },
    styles.root,
  ],
})({});

export const GridLine = styled('line', {
  name: 'MuiChartsGrid',
  slot: 'Line',
  overridesResolver: (props, styles) => styles.line,
})(({ theme }) => ({
  stroke: (theme.vars || theme).palette.divider,
  shapeRendering: 'crispEdges',
  strokeWidth: 1,
}));
