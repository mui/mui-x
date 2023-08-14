import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme, Theme } from '@mui/material/styles';
import { CartesianContext } from '../context/CartesianContextProvider';
import { DrawingContext } from '../context/DrawingProvider';
import useTicks from '../hooks/useTicks';
import { ChartsYAxisProps } from '../models/axis';
import {
  ChartsLine,
  ChartsTick,
  ChartsTickLabel,
  ChartsLabel,
  AxisRoot,
} from '../internals/components/AxisSharedComponents';
import { getAxisUtilityClass } from '../ChartsAxis/axisClasses';

const useUtilityClasses = (ownerState: ChartsYAxisProps & { theme: Theme }) => {
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
  tickFontSize: 12,
  labelFontSize: 14,
  tickSize: 6,
} as const;

function ChartsYAxis(inProps: ChartsYAxisProps) {
  const props = useThemeProps({ props: { ...defaultProps, ...inProps }, name: 'MuiChartsYAxis' });
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
    valueFormatter,
    slots,
    slotProps,
  } = defaultizedProps;

  const theme = useTheme();
  const classes = useUtilityClasses({ ...defaultizedProps, theme });

  const { left, top, width, height } = React.useContext(DrawingContext);

  const tickSize = disableTicks ? 4 : tickSizeProp;

  const yTicks = useTicks({ scale: yScale, ticksNumber, valueFormatter });

  const positionSigne = position === 'right' ? 1 : -1;

  const labelRefPoint = {
    x: positionSigne * (tickFontSize + tickSize + 10),
    y: top + height / 2,
  };

  const Line = slots?.axisLine ?? ChartsLine;
  const Tick = slots?.axisTick ?? ChartsTick;
  const TickLabel = slots?.axisTickLabel ?? ChartsTickLabel;
  const Label = slots?.axisLabel ?? ChartsLabel;

  return (
    <AxisRoot
      transform={`translate(${position === 'right' ? left + width : left}, 0)`}
      className={classes.root}
    >
      {!disableLine && (
        <Line
          y1={yScale.range()[0]}
          y2={yScale.range()[1]}
          className={classes.line}
          {...slotProps?.axisLine}
        />
      )}

      {yTicks.map(({ formattedValue, offset, labelOffset }, index) => {
        const xTickLabel = positionSigne * (tickSize + 2);
        const yTickLabel = labelOffset;
        return (
          <g key={index} transform={`translate(0, ${offset})`} className={classes.tickContainer}>
            {!disableTicks && (
              <Tick
                x2={positionSigne * tickSize}
                className={classes.tick}
                {...slotProps?.axisTick}
              />
            )}

            {formattedValue !== undefined && (
              <TickLabel
                x={xTickLabel}
                y={yTickLabel}
                transform-origin={`${xTickLabel}px ${yTickLabel}px`}
                sx={{
                  fontSize: tickFontSize,
                }}
                className={classes.tickLabel}
                {...slotProps?.axisTickLabel}
              >
                {formattedValue.toLocaleString()}
              </TickLabel>
            )}
          </g>
        );
      })}

      {label && (
        <Label
          {...labelRefPoint}
          sx={{
            fontSize: labelFontSize,
            transform: `rotate(${positionSigne * 90}deg)`,
            transformOrigin: `${labelRefPoint.x}px ${labelRefPoint.y}px`,
          }}
          className={classes.label}
          {...slotProps?.axisLabel}
        >
          {label}
        </Label>
      )}
    </AxisRoot>
  );
}

ChartsYAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Id of the axis to render.
   */
  axisId: PropTypes.string.isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * If true, the axis line is disabled.
   * @default false
   */
  disableLine: PropTypes.bool,
  /**
   * If true, the ticks are disabled.
   * @default false
   */
  disableTicks: PropTypes.bool,
  /**
   * The fill color of the axis text.
   * @default 'currentColor'
   */
  fill: PropTypes.string,
  /**
   * The label of the axis.
   */
  label: PropTypes.string,
  /**
   * The font size of the axis label.
   * @default 14
   */
  labelFontSize: PropTypes.number,
  /**
   * Position of the axis.
   */
  position: PropTypes.oneOf(['left', 'right']),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * The stroke color of the axis line.
   * @default 'currentColor'
   */
  stroke: PropTypes.string,
  /**
   * The font size of the axis ticks text.
   * @default 12
   */
  tickFontSize: PropTypes.number,
  /**
   * Maximal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMaxStep: PropTypes.number,
  /**
   * Maximal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMinStep: PropTypes.number,
  /**
   * The number of ticks. This number is not guaranted.
   * Not supported by categorical axis (band, points).
   */
  tickNumber: PropTypes.number,
  /**
   * The size of the ticks.
   * @default 6
   */
  tickSize: PropTypes.number,
} as any;

export { ChartsYAxis };
