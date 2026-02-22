'use client';
import * as React from 'react';
import { type ChartsXAxisProps, type AxisGroup } from '../models/axis';
import { isOrdinalScale } from '../internals/scaleGuards';
import { useChartContext } from '../context/ChartProvider/useChartContext';
import { TICK_LABEL_GAP } from './utilities';
import { useTicksGrouped } from '../hooks/useTicksGrouped';
import { useAxisTicksProps } from './useAxisTicksProps';
import { useStore } from '../internals/store/useStore';
import { selectorChartXAxisAutoSizeResults } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartAxisAutoSize.selectors';
import { isGroupedAxisAutoSizeResult } from '../internals/plugins/featurePlugins/useChartCartesianAxis/computeAxisAutoSize';
import type { UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis';

const DEFAULT_GROUPING_CONFIG = {
  tickSize: 6,
};

const getGroupingConfig = (
  groups: AxisGroup[],
  groupIndex: number,
  tickSize: number | undefined,
  computedGroupTickSizes?: number[],
) => {
  const config = groups[groupIndex] ?? ({} as AxisGroup);

  // Use computed tick size if available (from auto-sizing)
  if (computedGroupTickSizes && computedGroupTickSizes[groupIndex] !== undefined) {
    return {
      ...DEFAULT_GROUPING_CONFIG,
      ...config,
      tickSize: computedGroupTickSizes[groupIndex],
    };
  }

  const defaultTickSize = tickSize ?? DEFAULT_GROUPING_CONFIG.tickSize;
  const calculatedTickSize = defaultTickSize * groupIndex * 2 + defaultTickSize;

  return {
    ...DEFAULT_GROUPING_CONFIG,
    ...config,
    tickSize: config.tickSize ?? calculatedTickSize,
  };
};

interface ChartsGroupedXAxisProps extends ChartsXAxisProps {}

/**
 * @ignore - internal component.
 */
function ChartsGroupedXAxisTicks(inProps: ChartsGroupedXAxisProps) {
  const {
    xScale,
    defaultizedProps,
    tickNumber,
    positionSign,
    classes,
    Tick,
    TickLabel,
    axisTickLabelProps,
  } = useAxisTicksProps(inProps);

  if (!isOrdinalScale(xScale)) {
    throw new Error(
      'MUI X Charts: ChartsGroupedXAxis only supports the `band` and `point` scale types.',
    );
  }

  const {
    disableTicks,
    tickSize,
    valueFormatter,
    slotProps,
    tickInterval,
    tickPlacement,
    tickLabelPlacement,
  } = defaultizedProps;

  const groups = (defaultizedProps as { groups: AxisGroup[] }).groups;
  const axisId = defaultizedProps.id;

  const { instance } = useChartContext();
  const store = useStore<[UseChartCartesianAxisSignature]>();

  // Get computed group tick sizes from auto-sizing (if available)
  const autoSizeResults = store.use(selectorChartXAxisAutoSizeResults);
  const axisAutoSizeResult = axisId ? autoSizeResults[axisId] : undefined;
  const computedGroupTickSizes = isGroupedAxisAutoSizeResult(axisAutoSizeResult)
    ? axisAutoSizeResult.groupTickSizes
    : undefined;

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

  return (
    <React.Fragment>
      {xTicks.map((item, index) => {
        const { offset: tickOffset, labelOffset } = item;
        const xTickLabel = labelOffset ?? 0;

        const showTick = instance.isXInside(tickOffset);
        const tickLabel = item.formattedValue;
        const ignoreTick = item.ignoreTick ?? false;
        const groupIndex = item.groupIndex ?? 0;
        const groupConfig = getGroupingConfig(groups, groupIndex, tickSize, computedGroupTickSizes);

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
    </React.Fragment>
  );
}

export { ChartsGroupedXAxisTicks };
