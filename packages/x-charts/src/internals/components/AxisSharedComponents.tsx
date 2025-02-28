import { styled } from '@mui/material/styles';
import { axisClasses } from '../../ChartsAxis/axisClasses';

export const AxisRoot = styled('g', {
  name: 'MuiChartsAxis',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  [`& .${axisClasses.tickLabel}`]: {
    /* The tick label is measured using only its style prop, so applying properties that change its size will cause the
     * measurements to be off. As such, it is recommended to apply those properties through the `tickLabelStyle` prop. */
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
