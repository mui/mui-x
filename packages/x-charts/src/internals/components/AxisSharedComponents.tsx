import { styled } from '@mui/material/styles';
import { axisClasses } from '../../ChartsAxis/axisClasses';

export const AxisRoot = styled('g', {
  name: 'MuiChartsAxis',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  [`& .${axisClasses.tickLabel}`]: {
    ...theme.typography.caption,
    fill: '#575757',
    ...theme.applyStyles('dark', { fill: (theme.vars || theme).palette.grey[400] }),
  },
  [`& .${axisClasses.label}`]: {
    ...theme.typography.body1,
    fill: '#575757',
    ...theme.applyStyles('dark', { fill: (theme.vars || theme).palette.grey[400] }),
  },

  [`& .${axisClasses.line}`]: {
    stroke: (theme.vars || theme).palette.grey[500],
    shapeRendering: 'crispEdges',
    strokeWidth: 1,
  },
  [`& .${axisClasses.tick}`]: {
    stroke: (theme.vars || theme).palette.grey[500],
    shapeRendering: 'crispEdges',
  },
}));
