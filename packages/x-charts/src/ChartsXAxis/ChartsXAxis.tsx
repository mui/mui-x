import * as React from 'react';
import PropTypes from 'prop-types';
import { useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme, Theme } from '@mui/material/styles';
import { CartesianContext } from '../context/CartesianContextProvider';
import { DrawingContext } from '../context/DrawingProvider';
import useTicks, { TickItemType } from '../hooks/useTicks';
import { ChartsXAxisProps } from '../models/axis';
import { getAxisUtilityClass } from '../ChartsAxis/axisClasses';
import { AxisRoot } from '../internals/components/AxisSharedComponents';
import { ChartsText, ChartsTextProps, getWordsByLines } from '../internals/components/ChartsText';

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

type LabelExtraData = { width: number; height: number; skipLabel?: boolean };

function addLabelDimension(
  xTicks: TickItemType[],
  {
    tickLabelStyle: style,
    tickLabelInterval,
  }: Pick<ChartsXAxisProps, 'tickLabelInterval' | 'tickLabelStyle'>,
): (TickItemType & LabelExtraData)[] {
  const withDimension = xTicks.map((tick) => {
    if (tick.formattedValue === undefined) {
      return { ...tick, width: 0, height: 0 };
    }
    const tickSizes = getWordsByLines({ style, needsComputation: true, text: tick.formattedValue });
    return {
      ...tick,
      width: Math.max(...tickSizes.map((size) => size.width)),
      height: Math.max(tickSizes.length * tickSizes[0].height),
    };
  });

  if (typeof tickLabelInterval === 'function') {
    return withDimension.map((item, index) => ({
      ...item,
      skipLabel: !tickLabelInterval(item.value, index),
    }));
  }
  // TODO: add the filetering logic
  let textStart = 0;
  let textEnd = 0;
  return withDimension.map((item, labelIndex) => {
    const { width, offset, labelOffset } = item;
    textStart = offset + labelOffset - (1.5 * width) / 2;
    if (labelIndex > 0 && textStart < textEnd) {
      // Except for the first label, we skip all label that overlap with the last accepted.
      // Notice that the early return prevent textEnd to be updated.
      return { ...item, skipLabel: true };
    }
    textEnd = offset + labelOffset + width / 2;
    return item;
  });
}

const defaultProps = {
  position: 'bottom',
  disableLine: false,
  disableTicks: false,
  tickSize: 6,
} as const;

function ChartsXAxis(inProps: ChartsXAxisProps) {
  const props = useThemeProps({ props: { ...defaultProps, ...inProps }, name: 'MuiChartsXAxis' });
  const {
    xAxis: {
      [props.axisId]: { scale: xScale, tickNumber, ...settings },
    },
  } = React.useContext(CartesianContext);

  const defaultizedProps = { ...defaultProps, ...settings, ...props };
  const {
    position,
    disableLine,
    disableTicks,
    tickLabelStyle,
    label,
    labelStyle,
    tickFontSize,
    labelFontSize,
    tickSize: tickSizeProp,
    valueFormatter,
    slots,
    slotProps,
    tickInterval,
    tickLabelInterval,
  } = defaultizedProps;

  const theme = useTheme();
  const classes = useUtilityClasses({ ...defaultizedProps, theme });

  const { left, top, width, height } = React.useContext(DrawingContext);

  const tickSize = disableTicks ? 4 : tickSizeProp;

  const positionSigne = position === 'bottom' ? 1 : -1;

  const Line = slots?.axisLine ?? 'line';
  const Tick = slots?.axisTick ?? 'line';
  const TickLabel = slots?.axisTickLabel ?? ChartsText;
  const Label = slots?.axisLabel ?? ChartsText;

  const axisTickLabelProps = useSlotProps({
    elementType: TickLabel,
    externalSlotProps: slotProps?.axisTickLabel,
    additionalProps: {
      textAnchor: 'middle',
      dominantBaseline: position === 'bottom' ? 'hanging' : 'auto',
      style: { fontSize: tickFontSize ?? 12, ...tickLabelStyle },
      className: classes.tickLabel,
    } as Partial<ChartsTextProps>,
    className: classes.tickLabel,
    ownerState: {},
  });

  const xTicks = useTicks({ scale: xScale, tickNumber, valueFormatter, tickInterval });

  const xTicksWithDimension = addLabelDimension(xTicks, {
    tickLabelStyle: axisTickLabelProps.style,
    tickLabelInterval,
  });

  const labelRefPoint = {
    x: left + width / 2,
    y: positionSigne * (tickSize + 22),
  };

  const axisLabelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps?.axisLabel,
    additionalProps: {
      textAnchor: 'middle',
      dominantBaseline: position === 'bottom' ? 'hanging' : 'auto',
      style: {
        fontSize: labelFontSize ?? 14,
        transformOrigin: `${labelRefPoint.x}px ${labelRefPoint.y}px`,
        ...labelStyle,
      },
      className: classes.label,
    } as Partial<ChartsTextProps>,
    ownerState: {},
  });

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

      {xTicksWithDimension.map(({ formattedValue, offset, labelOffset, skipLabel }, index) => {
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

            {formattedValue !== undefined && !skipLabel && (
              <TickLabel
                x={xTickLabel}
                y={yTickLabel}
                transform-origin={`${xTickLabel}px ${yTickLabel}px`}
                {...axisTickLabelProps}
                text={formattedValue.toString()}
              />
            )}
          </g>
        );
      })}

      {label && (
        <g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label} />
        </g>
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
