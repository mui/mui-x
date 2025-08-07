'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { ChartsYAxisProps, type AxisGroup } from '../models/axis';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { isBandScale } from '../internals/isBandScale';
import { useChartContext } from '../context/ChartProvider/useChartContext';
import { TICK_LABEL_GAP, YAxisRoot } from './utilities';
import { useTicksGrouped } from '../hooks/useTicksGrouped';
import { useAxisProps } from './useAxisProps';

const DEFAULT_GROUPING_CONFIG = {
  tickSize: 6,
};

const getGroupingConfig = (
  groups: AxisGroup[],
  groupIndex: number,
  tickSize: number | undefined,
) => {
  const config = groups[groupIndex] ?? ({} as AxisGroup);

  const defaultTickSize = tickSize ?? DEFAULT_GROUPING_CONFIG.tickSize;
  const calculatedTickSize = defaultTickSize * groupIndex * 2 + defaultTickSize;

  return {
    ...DEFAULT_GROUPING_CONFIG,
    ...config,
    tickSize: config.tickSize ?? calculatedTickSize,
  };
};

/**
 * @ignore - internal component.
 */
function ChartsGroupedYAxis(inProps: ChartsYAxisProps) {
  const {
    yScale,
    defaultizedProps,
    tickNumber,
    positionSign,
    skipAxisRendering,
    classes,
    Line,
    Tick,
    TickLabel,
    Label,
    axisTickLabelProps,
    axisLabelProps,
  } = useAxisProps(inProps);

  if (!isBandScale(yScale)) {
    throw new Error(
      'MUI X Charts: ChartsGroupedYAxis only supports the `band` and `point` scale types.',
    );
  }

  const {
    position,
    disableLine,
    disableTicks,
    label,
    tickSize,
    valueFormatter,
    slotProps,
    tickInterval,
    tickPlacement,
    tickLabelPlacement,
    sx,
    offset,
    width: axisWidth,
  } = defaultizedProps;

  const groups = (defaultizedProps as { groups: AxisGroup[] }).groups;

  const drawingArea = useDrawingArea();
  const { left, top, width, height } = drawingArea;
  const { instance } = useChartContext();

  const labelRefPoint = {
    x: positionSign * axisWidth,
    y: top + height / 2,
  };

  const yTicks = useTicksGrouped({
    scale: yScale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement,
    tickLabelPlacement,
    direction: 'y',
    groups,
  });

  // Skip axis rendering if no data is available
  // - The domain is an empty array for band/point scales.
  // - The domains contains Infinity for continuous scales.
  // - The position is set to 'none'.
  if (skipAxisRendering) {
    return null;
  }

  return (
    <YAxisRoot
      transform={`translate(${position === 'right' ? left + width + offset : left - offset}, 0)`}
      className={classes.root}
      sx={sx}
    >
      {!disableLine && (
        <Line y1={top} y2={top + height} className={classes.line} {...slotProps?.axisLine} />
      )}

      {yTicks.map((item, index) => {
        const { offset: tickOffset, labelOffset } = item;
        const yTickLabel = labelOffset ?? 0;

        const showTick = instance.isYInside(tickOffset);
        const tickLabel = item.formattedValue;
        const ignoreTick = item.ignoreTick ?? false;
        const groupIndex = item.groupIndex ?? 0;
        const groupConfig = getGroupingConfig(groups, groupIndex, tickSize);

        const tickXSize = positionSign * groupConfig.tickSize;
        const labelPositionX = positionSign * (groupConfig.tickSize + TICK_LABEL_GAP);

        return (
          <g
            key={index}
            transform={`translate(0, ${tickOffset})`}
            className={classes.tickContainer}
            data-group-index={groupIndex}
          >
            {!disableTicks && !ignoreTick && showTick && (
              <Tick x2={tickXSize} className={classes.tick} {...slotProps?.axisTick} />
            )}

            {tickLabel !== undefined && (
              <TickLabel
                x={labelPositionX}
                y={yTickLabel}
                {...axisTickLabelProps}
                style={{
                  ...axisTickLabelProps.style,
                  ...groupConfig.tickLabelStyle,
                }}
                text={tickLabel}
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
    </YAxisRoot>
  );
}

ChartsGroupedYAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  axis: PropTypes.oneOf(['y']),
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

export { ChartsGroupedYAxis };
