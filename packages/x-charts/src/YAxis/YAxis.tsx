import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme, Theme } from '@mui/material/styles';
import { CartesianContext } from '../context/CartesianContextProvider';
import { DrawingContext } from '../context/DrawingProvider';
import useTicks from '../hooks/useTicks';
import { YAxisProps } from '../models/axis';
import { Line, Tick, TickLabel, Label } from '../internals/components/AxisSharedComponents';
import { getAxisUtilityClass } from '../Axis/axisClasses';

const useUtilityClasses = (ownerState: YAxisProps & { theme: Theme }) => {
  const { classes, position } = ownerState;
  const slots = {
    root: ['root', 'directionY', position],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel'],
    label: ['label'],
  };

  return composeClasses(slots, getAxisUtilityClass, classes);
};

const defaultProps = {
  position: 'left',
  disableLine: false,
  disableTicks: false,
  tickFontSize: 10,
  labelFontSize: 14,
  tickSize: 6,
} as const;

export function YAxis(inProps: YAxisProps) {
  const props = useThemeProps({ props: { ...defaultProps, ...inProps }, name: 'MuiYAxis' });
  const {
    yAxis: {
      [props.axisId]: { scale: yScale, ticksNumber, ...settings },
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

  const yTicks = useTicks({ scale: yScale, ticksNumber });

  const positionSigne = position === 'right' ? 1 : -1;

  return (
    <g
      transform={`translate(${position === 'right' ? left + width : left}, 0)`}
      className={classes.root}
    >
      {!disableLine && (
        <Line y1={yScale.range()[0]} y2={yScale.range()[1]} className={classes.line} />
      )}
      {yTicks.map(({ value, offset }, index) => (
        <g key={index} transform={`translate(0, ${offset})`} className={classes.tickContainer}>
          {!disableTicks && <Tick x2={positionSigne * tickSize} className={classes.tick} />}
          <TickLabel
            transform={`translate(${positionSigne * (tickFontSize + tickSize + 2)}, 0)`}
            sx={{
              fontSize: tickFontSize,
            }}
            className={classes.tickLabel}
          >
            {value}
          </TickLabel>
        </g>
      ))}
      {label && (
        <Label
          transform={`translate(${positionSigne * (tickFontSize + tickSize + 20)}, ${
            top + height / 2
          }) rotate(${positionSigne * 90})`}
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
