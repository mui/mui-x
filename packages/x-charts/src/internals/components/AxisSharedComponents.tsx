import { styled } from '@mui/material/styles';
import { axisClasses } from '../../ChartsAxis/axisClasses';

export const AxisRoot = styled('g', {
  name: 'MuiChartsAxis',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  [`& .${axisClasses.tickLabel}`]: {
    ...theme.typography.caption,
    fill: (theme.vars || theme).palette.text.primary,
  },
  [`& .${axisClasses.label}`]: {
    ...theme.typography.body1,
    fill: (theme.vars || theme).palette.text.primary,
  },

  [`& .${axisClasses.line}`]: {
    stroke: (theme.vars || theme).palette.text.primary,
    shapeRendering: 'crispEdges',
    strokeWidth: 1,
  },
  [`& .${axisClasses.tick}`]: {
    stroke: (theme.vars || theme).palette.text.primary,
    shapeRendering: 'crispEdges',
  },
}));
