import { styled } from '@mui/material/styles';
import { axisClasses } from '../../ChartsAxis/axisClasses';

export const AxisRoot = styled('g', {
  name: 'MuiChartsAxis',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  [`& .${axisClasses.tickLabel}`]: {
    ...theme.typography.caption,
    fill: theme.palette.text.primary,
  },
  [`& .${axisClasses.label}`]: {
    ...theme.typography.body1,
    fill: theme.palette.text.primary,
  },

  [`& .${axisClasses.line}`]: {
    stroke: theme.palette.text.primary,
    shapeRendering: 'crispEdges',
    strokeWidth: 1,
  },
  [`& .${axisClasses.tick}`]: {
    stroke: theme.palette.text.primary,
    shapeRendering: 'crispEdges',
  },
}));

// [`&.${axisClasses.directionY}`]: {
//   [`.${axisClasses.tickLabel}`]: { dominantBaseline: 'middle' },
//   [`.${axisClasses.label}`]: { dominantBaseline: 'auto', textAnchor: 'middle' },
// },
// [`&.${axisClasses.left}`]: {
//   [`.${axisClasses.tickLabel}`]: { dominantBaseline: 'central', textAnchor: 'end' },
// },
// [`&.${axisClasses.right}`]: {
//   [`.${axisClasses.tickLabel}`]: { dominantBaseline: 'central', textAnchor: 'start' },
// },
// [`&.${axisClasses.bottom}`]: {
//   [`.${axisClasses.tickLabel}, .${axisClasses.label}`]: {
//     dominantBaseline: 'hanging',
//     textAnchor: 'middle',
//   },
// },
// [`&.${axisClasses.top}`]: {
//   [`.${axisClasses.tickLabel}, .${axisClasses.label}`]: {
//     dominantBaseline: 'baseline',
//     textAnchor: 'middle',
//   },
// },
// });
