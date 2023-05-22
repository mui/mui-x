import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme, Theme } from '@mui/material/styles';
import { CartesianContext } from '../context/CartesianContextProvider';
import { DrawingContext } from '../context/DrawingProvider';
import useTicks from '../hooks/useTicks';
import { XAxisProps } from '../models/axis';
import { getAxisUtilityClass } from '../Axis/axisClasses';
import { Line, Tick, TickLabel, Label } from '../internals/components/AxisSharedComponents';

const useUtilityClasses = (ownerState: XAxisProps & { theme: Theme }) => {
  const { classes, position } = ownerState;
  const slots = {
    root: ['root', 'directionX', position],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel'],
    label: ['label'],
  };

  return composeClasses(slots, getAxisUtilityClass, classes);
};
const defaultProps = {
  position: 'bottom',
  disableLine: false,
  disableTicks: false,
  tickFontSize: 10,
  labelFontSize: 14,
  tickSize: 6,
} as const;

export function XAxis(inProps: XAxisProps) {
  const props = useThemeProps({ props: { ...defaultProps, ...inProps }, name: 'MuiXAxis' });
  const {
    xAxis: {
      [props.axisId]: { scale: xScale, ticksNumber, ...settings },
    },
  } = React.useContext(CartesianContext);

  const defaultizedProps = { ...defaultProps, ...settings, ...props };
  const {
    position,
    disableLine,
    disableTicks,
    tickFontSize,
    label,
    labelFontSize,
    tickSize: tickSizeProp,
  } = defaultizedProps;

  const theme = useTheme();
  const classes = useUtilityClasses({ ...defaultizedProps, theme });

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
