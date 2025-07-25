'use client';
import * as React from 'react';
import { ChartsXAxisProps, type AxisGrouping } from '../models/axis';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { isBandScale } from '../internals/isBandScale';
import { useChartContext } from '../context/ChartProvider/useChartContext';
import { TICK_LABEL_GAP, XAxisRoot } from './utilities';
import { useTicksGrouped } from '../hooks/useTicksGrouped';
import { useAxisProps } from './useAxisProps';

const DEFAULT_GROUPING_CONFIG = {
  tickSize: 6,
};

const calculateTickSize = (
  groupIndex: number,
  tickSize: number,
  isConfigArray: boolean = false,
): number => {
  // If the groupingConfig is an array we expect the user to provide a `tickSize` for each group.
  if (isConfigArray) {
    return tickSize;
  }

  // Else if it is an object, the provided `tickSize` applies to all groups incrementally.
  // The first tick will be at `tickSize`, while every subsequent group will be
  // multiplied by the group index times two and summed to the first tick size.
  // This allows for a consistent spacing between groups.
  return tickSize * groupIndex * 2 + tickSize;
};

const getGroupingConfig = (
  groupingConfig: AxisGrouping,
  groupIndex: number,
  tickSize: number | undefined,
) => {
  const config = groupingConfig?.config?.[groupIndex] ?? {};

  return {
    ...DEFAULT_GROUPING_CONFIG,
    ...groupingConfig,
    ...config,
    tickSize: calculateTickSize(
      groupIndex,
      config?.tickSize ?? tickSize ?? DEFAULT_GROUPING_CONFIG.tickSize,
      Array.isArray(groupingConfig.config),
    ),
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

  const groupingConfig = (defaultizedProps as { grouping: AxisGrouping }).grouping;

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
    getGrouping: groupingConfig.getGrouping,
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
        const groupConfig = getGroupingConfig(groupingConfig, groupIndex, tickSize);

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
                data-testid="ChartsXAxisTickLabel"
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

ChartsGroupedXAxis.propTypes = {} as any;

export { ChartsGroupedXAxis };
