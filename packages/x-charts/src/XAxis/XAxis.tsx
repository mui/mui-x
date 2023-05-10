import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled, useThemeProps, useTheme, Theme } from '@mui/material/styles';
import { CartesianContext } from '../context/CartesianContextProvider';
import { DrawingContext } from '../context/DrawingProvider';
import useTicks from '../hooks/useTicks';
import { XAxisProps } from '../models/axis';
import { getXAxisUtilityClass } from './xAxisClasses';

const Line = styled('line', {
  name: 'MuiXAxis',
  slot: 'Line',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  stroke: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
}));

const Tick = styled('line', {
  name: 'MuiXAxis',
  slot: 'Tick',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  stroke: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
}));

const TickLabel = styled('text', {
  name: 'MuiXAxis',
  slot: 'TickLabel',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  ...theme.typography.caption,
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
}));

const Label = styled('text', {
  name: 'MuiXAxis',
  slot: 'Label',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  ...theme.typography.body1,
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
}));

const useUtilityClasses = (ownerState: XAxisProps & { theme: Theme }) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel'],
    label: ['label'],
  };

  return composeClasses(slots, getXAxisUtilityClass, classes);
};

export function XAxis(inProps: XAxisProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiXAxis' });
  const {
    xAxis: {
      [props.axisId]: { scale: xScale, ticksNumber, ...settings },
    },
  } = React.useContext(CartesianContext);

  const {
    position = 'bottom',
    disableLine = false,
    disableTicks = false,
    tickFontSize = 10,
    label,
    labelFontSize = 14,
    tickSize: tickSizeProp = 6,
  } = { ...settings, ...props };

  const theme = useTheme();
  const classes = useUtilityClasses({ ...props, theme });

  const { left, top, width, height } = React.useContext(DrawingContext);

  const tickSize = disableTicks ? 4 : tickSizeProp;

  const xTicks = useTicks({ scale: xScale, ticksNumber });
  const positionSigne = position === 'bottom' ? 1 : -1;

  return (
    <g
      transform={`translate(0, ${position === 'bottom' ? top + height : top})`}
      className={classes.root}
    >
      {!disableLine && (
        <Line x1={xScale.range()[0]} x2={xScale.range()[1]} className={classes.line} />
      )}
      {xTicks.map(({ value, offset }, index) => (
        <g key={index} transform={`translate(${offset}, 0)`} className={classes.tickContainer}>
          {!disableTicks && <Tick y2={positionSigne * tickSize} className={classes.tick} />}
          <TickLabel
            transform={`translate(0, ${positionSigne * (tickFontSize + tickSize + 2)})`}
            sx={{
              fontSize: tickFontSize,
            }}
            className={classes.tickLabel}
          >
            {value.toLocaleString()}
          </TickLabel>
        </g>
      ))}
      {label && (
        <Label
          transform={`translate(${left + width / 2}, ${
            positionSigne * (tickFontSize + tickSize + 20)
          })`}
          sx={{
            fontSize: labelFontSize,
          }}
          className={classes.label}
        >
          {label}
        </Label>
      )}
    </g>
  );
}
