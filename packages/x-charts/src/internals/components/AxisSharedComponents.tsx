import { styled } from '@mui/material/styles';
import { axisClasses } from '../../ChartsAxis/axisClasses';

export const AxisRoot = styled('g', {
  name: 'MuiChartsAxis',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  [`& .${axisClasses.tickLabel}`]: {
    ...theme.typography.caption,
    fill: (theme.vars || theme).palette.grey[600],
    ...theme.applyStyles('dark', { fill: (theme.vars || theme).palette.grey[500] }),
  },
  [`& .${axisClasses.label}`]: {
    ...theme.typography.body1,
    fill: (theme.vars || theme).palette.grey[600],
    ...theme.applyStyles('dark', { fill: (theme.vars || theme).palette.grey[500] }),
  },

  [`& .${axisClasses.line}`]: {
    stroke: (theme.vars || theme).palette.grey[500],
    shapeRendering: 'crispEdges',
    strokeWidth: 1,
    ...theme.applyStyles('dark', { stroke: (theme.vars || theme).palette.grey[600] }),
  },
  [`& .${axisClasses.tick}`]: {
    stroke: (theme.vars || theme).palette.grey[500],
    shapeRendering: 'crispEdges',
    ...theme.applyStyles('dark', { stroke: (theme.vars || theme).palette.grey[600] }),
  },
}));
