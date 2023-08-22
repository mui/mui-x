import { styled, CSSObject } from '@mui/system';
import { axisClasses } from '../../ChartsAxis/axisClasses';

export const AxisRoot = styled('g', {
  name: 'MuiChartsAxis',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  [`&.${axisClasses.directionY}`]: {
    [`.${axisClasses.tickLabel}`]: { dominantBaseline: 'middle' },
    [`.${axisClasses.label}`]: { dominantBaseline: 'auto', textAnchor: 'middle' },
  },
  [`&.${axisClasses.left}`]: {
    [`.${axisClasses.tickLabel}`]: { dominantBaseline: 'central', textAnchor: 'end' },
  },
  [`&.${axisClasses.right}`]: {
    [`.${axisClasses.tickLabel}`]: { dominantBaseline: 'central', textAnchor: 'start' },
  },
  [`&.${axisClasses.bottom}`]: {
    [`.${axisClasses.tickLabel}, .${axisClasses.label}`]: {
      dominantBaseline: 'hanging',
      textAnchor: 'middle',
    },
  },
  [`&.${axisClasses.top}`]: {
    [`.${axisClasses.tickLabel}, .${axisClasses.label}`]: {
      dominantBaseline: 'baseline',
      textAnchor: 'middle',
    },
  },
});

export const ChartsLine = styled('line', {
  name: 'MuiChartsAxis',
  slot: 'Line',
  overridesResolver: (props, styles) => styles.line,
})(({ theme }) => ({
  stroke: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
  strokeWidth: 1,
}));

export const ChartsTick = styled('line', {
  name: 'MuiChartsAxis',
  slot: 'Tick',
  overridesResolver: (props, styles) => styles.tick,
})(({ theme }) => ({
  stroke: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
}));

export const ChartsTickLabel = styled('text', {
  name: 'MuiChartsAxis',
  slot: 'TickLabel',
  overridesResolver: (props, styles) => styles.tickLabel,
})(({ theme }) => ({
  // Typing should be fixed in v6 (see: https://github.com/mui/material-ui/issues/30678)
  ...(theme.typography as Record<string, CSSObject>).caption,
  fill: theme.palette.text.primary,
}));

export const ChartsLabel = styled('text', {
  name: 'MuiChartsAxis',
  slot: 'Label',
  overridesResolver: (props, styles) => styles.label,
})(({ theme }) => ({
  ...(theme.typography as Record<string, CSSObject>).body1,
  fill: theme.palette.text.primary,
}));
