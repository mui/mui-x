'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import { useThemeProps, useTheme, styled } from '@mui/material/styles';
import { useTicks, TickItemType } from '../hooks/useTicks';
import { AxisConfig, AxisDefaultized, ChartsXAxisProps, ScaleName } from '../models/axis';
import { getAxisUtilityClass } from '../ChartsAxis/axisClasses';
import { AxisRoot } from '../internals/components/AxisSharedComponents';
import { ChartsText, ChartsTextProps } from '../ChartsText';
import { getMinXTranslation } from '../internals/geometry';
import { useMounted } from '../hooks/useMounted';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { getWordsByLines } from '../internals/getWordsByLines';
import { isInfinity } from '../internals/isInfinity';
import { isBandScale } from '../internals/isBandScale';
import { useChartContext } from '../context/ChartProvider/useChartContext';
import { useXAxes } from '../hooks/useAxis';

const useUtilityClasses = (ownerState: AxisConfig<any, any, ChartsXAxisProps>) => {
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
    // FIXME: Define the default value in the correct place
    minTickLabelGap = 8,
    reverse,
    isMounted,
  }: Pick<ChartsXAxisProps, 'tickLabelInterval' | 'tickLabelStyle'> &
    Pick<AxisDefaultized<ScaleName, any, ChartsXAxisProps>, 'reverse' | 'minTickLabelGap'> & {
      isMounted: boolean;
    },
): (TickItemType & LabelExtraData)[] {
  const withDimension = xTicks.map((tick) => {
    if (!isMounted || tick.formattedValue === undefined) {
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

  // Filter label to avoid overlap
  let previousTextLimit = 0;
  const direction = reverse ? -1 : 1;
  return withDimension.map((item, labelIndex) => {
    const { width, offset, labelOffset, height } = item;

    const distance = getMinXTranslation(width, height, style?.angle);
    const textPosition = offset + labelOffset;

    const currentTextLimit = textPosition - (direction * distance) / 2;
    if (
      labelIndex > 0 &&
      direction * currentTextLimit < direction * (previousTextLimit + minTickLabelGap)
    ) {
      // Except for the first label, we skip all label that overlap with the last accepted.
      // Notice that the early return prevents `previousTextLimit` from being updated.
      return { ...item, skipLabel: true };
    }
    previousTextLimit = textPosition + (direction * distance) / 2;
    return item;
  });
}

const XAxisRoot = styled(AxisRoot, {
  name: 'MuiChartsXAxis',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({});

const defaultProps = {
  disableLine: false,
  disableTicks: false,
  tickSize: 6,
} as const;

/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsXAxis API](https://mui.com/x/api/charts/charts-x-axis/)
 */
function ChartsXAxis(inProps: ChartsXAxisProps) {
  const { xAxis, xAxisIds } = useXAxes();
  const { scale: xScale, tickNumber, reverse, ...settings } = xAxis[inProps.axisId ?? xAxisIds[0]];

  const isMounted = useMounted();

  const themedProps = useThemeProps({ props: { ...settings, ...inProps }, name: 'MuiChartsXAxis' });

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  const {
    position,
    disableLine,
    disableTicks,
    tickLabelStyle,
    label,
    labelStyle,
    tickSize: tickSizeProp,
    valueFormatter,
    slots,
    slotProps,
    tickInterval,
    tickLabelInterval,
    tickPlacement,
    tickLabelPlacement,
    sx,
    offset,
  } = defaultizedProps;

  const theme = useTheme();
  const classes = useUtilityClasses(defaultizedProps);
  const { left, top, width, height } = useDrawingArea();
  const { instance } = useChartContext();

  const tickSize = disableTicks ? 4 : tickSizeProp;

  const positionSign = position === 'bottom' ? 1 : -1;

  const Line = slots?.axisLine ?? 'line';
  const Tick = slots?.axisTick ?? 'line';
  const TickLabel = slots?.axisTickLabel ?? ChartsText;
  const Label = slots?.axisLabel ?? ChartsText;

  const axisTickLabelProps = useSlotProps({
    elementType: TickLabel,
    externalSlotProps: slotProps?.axisTickLabel,
    additionalProps: {
      style: {
        ...theme.typography.caption,
        fontSize: 12,
        textAnchor: 'middle',
        dominantBaseline: position === 'bottom' ? 'hanging' : 'auto',
        ...tickLabelStyle,
      },
    } as Partial<ChartsTextProps>,
    className: classes.tickLabel,
    ownerState: {},
  });

  const xTicks = useTicks({
    scale: xScale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement,
    tickLabelPlacement,
  });

  const xTicksWithDimension = addLabelDimension(xTicks, {
    tickLabelStyle: axisTickLabelProps.style,
    tickLabelInterval,
    reverse,
    isMounted,
  });

  const labelRefPoint = {
    x: left + width / 2,
    y: positionSign * (tickSize + 22),
  };

  const axisLabelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps?.axisLabel,
    additionalProps: {
      style: {
        fontSize: 14,
        textAnchor: 'middle',
        dominantBaseline: position === 'bottom' ? 'hanging' : 'auto',
        ...labelStyle,
      },
    } as Partial<ChartsTextProps>,
    ownerState: {},
  });

  const domain = xScale.domain();
  const ordinalAxis = isBandScale(xScale);
  // Skip axis rendering if no data is available
  // - The domain is an empty array for band/point scales.
  // - The domains contains Infinity for continuous scales.
  if ((ordinalAxis && domain.length === 0) || (!ordinalAxis && domain.some(isInfinity))) {
    return null;
  }
  return (
    <XAxisRoot
      transform={`translate(0, ${position === 'bottom' ? top + height + offset : top - offset})`}
      className={classes.root}
      sx={sx}
    >
      {!disableLine && (
        <Line x1={left} x2={left + width} className={classes.line} {...slotProps?.axisLine} />
      )}

      {xTicksWithDimension.map(
        ({ formattedValue, offset: tickOffset, labelOffset, skipLabel }, index) => {
          const xTickLabel = labelOffset ?? 0;
          const yTickLabel = positionSign * (tickSize + 3);

          const showTick = instance.isPointInside({ x: tickOffset, y: -1 }, { direction: 'x' });
          const showTickLabel = instance.isPointInside(
            { x: tickOffset + xTickLabel, y: -1 },
            { direction: 'x' },
          );
          return (
            <g
              key={index}
              transform={`translate(${tickOffset}, 0)`}
              className={classes.tickContainer}
            >
              {!disableTicks && showTick && (
                <Tick
                  y2={positionSign * tickSize}
                  className={classes.tick}
                  {...slotProps?.axisTick}
                />
              )}

              {formattedValue !== undefined && !skipLabel && showTickLabel && (
                <TickLabel
                  x={xTickLabel}
                  y={yTickLabel}
                  {...axisTickLabelProps}
                  text={formattedValue.toString()}
                />
              )}
            </g>
          );
        },
      )}

      {label && (
        <g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label} />
        </g>
      )}
    </XAxisRoot>
  );
}

ChartsXAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  axis: PropTypes.oneOf(['x']),
  /**
   * The id of the axis to render.
   * If undefined, it will be the first defined axis.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
   * The style applied to the axis label.
   */
  labelStyle: PropTypes.object,
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
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Defines which ticks are displayed.
   * Its value can be:
   * - 'auto' In such case the ticks are computed based on axis scale and other parameters.
   * - a filtering function of the form `(value, index) => boolean` which is available only if the axis has "point" scale.
   * - an array containing the values where ticks should be displayed.
   * @see See {@link https://mui.com/x/react-charts/axis/#fixed-tick-positions}
   * @default 'auto'
   */
  tickInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.array, PropTypes.func]),
  /**
   * Defines which ticks get its label displayed. Its value can be:
   * - 'auto' In such case, labels are displayed if they do not overlap with the previous one.
   * - a filtering function of the form (value, index) => boolean. Warning: the index is tick index, not data ones.
   * @default 'auto'
   */
  tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
  /**
   * The placement of ticks label. Can be the middle of the band, or the tick position.
   * Only used if scale is 'band'.
   * @default 'middle'
   */
  tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
  /**
   * The style applied to ticks text.
   */
  tickLabelStyle: PropTypes.object,
  /**
   * Maximal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMaxStep: PropTypes.number,
  /**
   * Minimal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMinStep: PropTypes.number,
  /**
   * The number of ticks. This number is not guaranteed.
   * Not supported by categorical axis (band, points).
   */
  tickNumber: PropTypes.number,
  /**
   * The placement of ticks in regard to the band interval.
   * Only used if scale is 'band'.
   * @default 'extremities'
   */
  tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
  /**
   * The size of the ticks.
   * @default 6
   */
  tickSize: PropTypes.number,
} as any;

export { ChartsXAxis };
