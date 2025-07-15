import { styled } from '@mui/material/styles';
import { axisClasses } from '../../ChartsAxis/axisClasses';

export const AxisRoot = styled('g', {
  name: 'MuiChartsAxis',
  slot: 'Root',
})(({ theme }) => ({
  [`& .${axisClasses.tickLabel}`]: {
    /* The tick label is measured using only its style prop, so applying properties that change its size will cause the
     * measurements to be off. As such, it is recommended to apply those properties through the `tickLabelStyle` prop. */
    ...theme.typography.caption,
    fill: (theme.vars || theme).palette.text.primary,
  },
  [`& .${axisClasses.label}`]: {
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
