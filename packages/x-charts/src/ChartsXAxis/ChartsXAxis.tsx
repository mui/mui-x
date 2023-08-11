import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme, Theme } from '@mui/material/styles';
import { CartesianContext } from '../context/CartesianContextProvider';
import { DrawingContext } from '../context/DrawingProvider';
import useTicks from '../hooks/useTicks';
import { ChartsXAxisProps } from '../models/axis';
import { getAxisUtilityClass } from '../ChartsAxis/axisClasses';
import {
  ChartsLine,
  ChartsTick,
  ChartsTickLabel,
  ChartsLabel,
  AxisRoot,
} from '../internals/components/AxisSharedComponents';

const useUtilityClasses = (ownerState: ChartsXAxisProps & { theme: Theme }) => {
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
  tickFontSize: 12,
  labelFontSize: 14,
  tickSize: 6,
} as const;

function ChartsXAxis(inProps: ChartsXAxisProps) {
  const props = useThemeProps({ props: { ...defaultProps, ...inProps }, name: 'MuiChartsXAxis' });
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
    valueFormatter,
    slots,
    slotProps,
  } = defaultizedProps;

  const theme = useTheme();
  const classes = useUtilityClasses({ ...defaultizedProps, theme });

  const { left, top, width, height } = React.useContext(DrawingContext);

  const tickSize = disableTicks ? 4 : tickSizeProp;

  const xTicks = useTicks({ scale: xScale, ticksNumber, valueFormatter });
  const positionSigne = position === 'bottom' ? 1 : -1;

  const labelRefPoint = {
    x: left + width / 2,
    y: positionSigne * (tickFontSize + tickSize + 10),
  };

  const Line = slots?.axisLine ?? ChartsLine;
  const Tick = slots?.axisTick ?? ChartsTick;
  const TickLabel = slots?.axisTickLabel ?? ChartsTickLabel;
  const Label = slots?.axisLabel ?? ChartsLabel;

  return (
    <AxisRoot
      transform={`translate(0, ${position === 'bottom' ? top + height : top})`}
      className={classes.root}
    >
      {!disableLine && (
        <Line
          x1={xScale.range()[0]}
          x2={xScale.range()[1]}
          className={classes.line}
          {...slotProps?.axisLine}
        />
      )}

      {xTicks.map(({ formattedValue, offset, labelOffset }, index) => {
        const xTickLabel = labelOffset ?? 0;
        const yTickLabel = positionSigne * (tickSize + 3);
        return (
          <g key={index} transform={`translate(${offset}, 0)`} className={classes.tickContainer}>
            {!disableTicks && (
              <Tick
                y2={positionSigne * tickSize}
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
                {formattedValue}
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

ChartsXAxis.propTypes = {
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
  position: PropTypes.oneOf(['bottom', 'top']),
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

export { ChartsXAxis };
