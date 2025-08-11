'use client';
import * as React from 'react';
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
    lineProps,
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
      {!disableLine && <Line y1={top} y2={top + height} className={classes.line} {...lineProps} />}

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

export { ChartsGroupedYAxis };
