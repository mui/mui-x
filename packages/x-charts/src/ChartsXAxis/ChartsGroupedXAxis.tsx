'use client';
import * as React from 'react';
import { ChartsXAxisProps, type AxisGroup } from '../models/axis';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { isBandScale } from '../internals/isBandScale';
import { useChartContext } from '../context/ChartProvider/useChartContext';
import { TICK_LABEL_GAP, XAxisRoot } from './utilities';
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
function ChartsGroupedXAxis(inProps: ChartsXAxisProps) {
  const {
    xScale,
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

  if (!isBandScale(xScale)) {
    throw new Error(
      'MUI X Charts: ChartsGroupedXAxis only supports the `band` and `point` scale types.',
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
    height: axisHeight,
  } = defaultizedProps;

  const groups = (defaultizedProps as { groups: AxisGroup[] }).groups;

  const drawingArea = useDrawingArea();
  const { left, top, width, height } = drawingArea;
  const { instance } = useChartContext();

  const labelRefPoint = {
    x: left + width / 2,
    y: positionSign * axisHeight,
  };

  const xTicks = useTicksGrouped({
    scale: xScale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement,
    tickLabelPlacement,
    direction: 'x',
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
    <XAxisRoot
      transform={`translate(0, ${position === 'bottom' ? top + height + offset : top - offset})`}
      className={classes.root}
      sx={sx}
    >
      {!disableLine && (
        <Line x1={left} x2={left + width} className={classes.line} {...slotProps?.axisLine} />
      )}

      {xTicks.map((item, index) => {
        const { offset: tickOffset, labelOffset } = item;
        const xTickLabel = labelOffset ?? 0;

        const showTick = instance.isXInside(tickOffset);
        const tickLabel = item.formattedValue;
        const ignoreTick = item.ignoreTick ?? false;
        const groupIndex = item.groupIndex ?? 0;
        const groupConfig = getGroupingConfig(groups, groupIndex, tickSize);

        const tickYSize = positionSign * groupConfig.tickSize;
        const labelPositionY = positionSign * (groupConfig.tickSize + TICK_LABEL_GAP);

        return (
          <g
            key={index}
            transform={`translate(${tickOffset}, 0)`}
            className={classes.tickContainer}
            data-group-index={groupIndex}
          >
            {!disableTicks && !ignoreTick && showTick && (
              <Tick y2={tickYSize} className={classes.tick} {...slotProps?.axisTick} />
            )}

            {tickLabel !== undefined && (
              <TickLabel
                x={xTickLabel}
                y={labelPositionY}
                {...axisTickLabelProps}
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
    </XAxisRoot>
  );
}

export { ChartsGroupedXAxis };
