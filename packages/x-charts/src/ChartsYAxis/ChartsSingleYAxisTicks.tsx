'use client';
import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import { useIsHydrated } from '@mui/x-internals/useIsHydrated';
import { useTicks } from '../hooks/useTicks';
import { useDrawingArea } from '../hooks/useDrawingArea';
import type { ChartsYAxisProps } from '../models/axis';
import type { OrdinalTimeTicks } from '../models/timeTicks';
import { useChartsContext } from '../context/ChartsProvider';
import { shortenLabels } from './shortenLabels';
import { AXIS_LABEL_TICK_LABEL_GAP, TICK_LABEL_GAP } from './utilities';
import { useAxisTicksProps } from './useAxisTicksProps';
import { getVisibleLabels } from './getVisibleLabels';
import { useMounted } from '../hooks/useMounted';

interface ChartsSingleYAxisProps extends ChartsYAxisProps {
  axisLabelHeight: number;
  ordinalTimeTicks?: OrdinalTimeTicks;
}

/**
 * @ignore - internal component.
 */
function ChartsSingleYAxisTicks(inProps: ChartsSingleYAxisProps) {
  const { axisLabelHeight, ordinalTimeTicks } = inProps;
  const {
    yScale,
    defaultizedProps,
    tickNumber,
    positionSign,
    classes,
    Tick,
    TickLabel,
    axisTickLabelProps,
    reverse,
  } = useAxisTicksProps(inProps);
  const isRtl = useRtl();

  const {
    disableTicks,
    tickSize: tickSizeProp,
    valueFormatter,
    slotProps,
    tickPlacement,
    tickLabelPlacement,
    tickInterval,
    tickLabelInterval,
    tickSpacing,
    tickLabelMinGap,
    width: axisWidth,
  } = defaultizedProps;

  const drawingArea = useDrawingArea();
  const { instance } = useChartsContext();
  const isHydrated = useIsHydrated();
  const isMounted = useMounted();

  const tickSize = disableTicks ? 4 : tickSizeProp;

  const yTicks = useTicks({
    scale: yScale,
    tickNumber,
    valueFormatter,
    tickPlacement,
    tickLabelPlacement,
    tickInterval,
    tickSpacing,
    direction: 'y',
    ordinalTimeTicks,
  });

  /* If there's an axis title, the tick labels have less space to render  */
  const tickLabelsMaxWidth = Math.max(
    0,
    axisWidth -
      (axisLabelHeight > 0 ? axisLabelHeight + AXIS_LABEL_TICK_LABEL_GAP : 0) -
      tickSize -
      TICK_LABEL_GAP,
  );

  const visibleLabels = getVisibleLabels(yTicks, {
    tickLabelStyle: axisTickLabelProps.style,
    tickLabelInterval,
    tickLabelMinGap,
    reverse,
    isMounted,
    isInside: instance.isYInside,
  });

  const tickLabels = isHydrated
    ? shortenLabels(visibleLabels, drawingArea, tickLabelsMaxWidth, isRtl, axisTickLabelProps.style)
    : new Map(Array.from(visibleLabels).map((item) => [item, item.formattedValue]));

  return (
    <React.Fragment>
      {yTicks.map((item, index) => {
        const { offset: tickOffset, labelOffset } = item;
        const xTickLabel = positionSign * (tickSize + TICK_LABEL_GAP);
        const yTickLabel = labelOffset;

        const showTick = instance.isYInside(tickOffset);
        const tickLabel = tickLabels.get(item);
        const showTickLabel = visibleLabels.has(item);

        return (
          <g
            key={index}
            transform={`translate(0, ${tickOffset})`}
            className={classes.tickContainer}
          >
            {!disableTicks && showTick && (
              <Tick
                x2={positionSign * tickSize}
                className={classes.tick}
                {...slotProps?.axisTick}
              />
            )}

            {tickLabel !== undefined && showTickLabel && (
              <TickLabel
                x={xTickLabel}
                y={yTickLabel}
                data-testid="ChartsYAxisTickLabel"
                text={tickLabel}
                {...axisTickLabelProps}
              />
            )}
          </g>
        );
      })}
    </React.Fragment>
  );
}

export { ChartsSingleYAxisTicks };
