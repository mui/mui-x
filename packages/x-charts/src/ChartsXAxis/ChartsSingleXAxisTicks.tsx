'use client';
import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import { useIsHydrated } from '../hooks/useIsHydrated';
import { useTicks } from '../hooks/useTicks';
import type { ChartsXAxisProps } from '../models/axis';
import type { OrdinalTimeTicks } from '../models/timeTicks';
import { useMounted } from '../hooks/useMounted';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { useChartContext } from '../context/ChartProvider/useChartContext';
import { shortenLabels } from './shortenLabels';
import { getVisibleLabels } from './getVisibleLabels';
import { AXIS_LABEL_TICK_LABEL_GAP, TICK_LABEL_GAP } from './utilities';
import { useAxisTicksProps } from './useAxisTicksProps';

interface ChartsSingleXAxisProps extends ChartsXAxisProps {
  axisLabelHeight: number;
  ordinalTimeTicks?: OrdinalTimeTicks;
}

/**
 * @ignore - internal component.
 */
function ChartsSingleXAxisTicks(inProps: ChartsSingleXAxisProps) {
  const { axisLabelHeight, ordinalTimeTicks } = inProps;
  const {
    xScale,
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
  const isMounted = useMounted();

  const {
    disableTicks,
    tickSize: tickSizeProp,
    valueFormatter,
    slotProps,
    tickInterval,
    tickLabelInterval,
    tickPlacement,
    tickLabelPlacement,
    tickLabelMinGap,
    tickSpacing,
    height: axisHeight,
  } = defaultizedProps;

  const drawingArea = useDrawingArea();
  const { instance } = useChartContext();
  const isHydrated = useIsHydrated();

  const tickSize = disableTicks ? 4 : tickSizeProp;

  const xTicks = useTicks({
    scale: xScale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement,
    tickLabelPlacement,
    tickSpacing,
    direction: 'x',
    ordinalTimeTicks,
  });

  const visibleLabels = getVisibleLabels(xTicks, {
    tickLabelStyle: axisTickLabelProps.style,
    tickLabelInterval,
    tickLabelMinGap,
    reverse,
    isMounted,
    isXInside: instance.isXInside,
  });

  /* If there's an axis title, the tick labels have less space to render  */
  const tickLabelsMaxHeight = Math.max(
    0,
    axisHeight -
      (axisLabelHeight > 0 ? axisLabelHeight + AXIS_LABEL_TICK_LABEL_GAP : 0) -
      tickSize -
      TICK_LABEL_GAP,
  );

  const tickLabels = isHydrated
    ? shortenLabels(
        visibleLabels,
        drawingArea,
        tickLabelsMaxHeight,
        isRtl,
        axisTickLabelProps.style,
      )
    : new Map(Array.from(visibleLabels).map((item) => [item, item.formattedValue]));

  return (
    <React.Fragment>
      {xTicks.map((item, index) => {
        const { offset: tickOffset, labelOffset } = item;
        const xTickLabel = labelOffset ?? 0;
        const yTickLabel = positionSign * (tickSize + TICK_LABEL_GAP);

        const showTick = instance.isXInside(tickOffset);
        const tickLabel = tickLabels.get(item);
        const showTickLabel = visibleLabels.has(item);

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

            {tickLabel !== undefined && showTickLabel && (
              <TickLabel
                x={xTickLabel}
                y={yTickLabel}
                data-testid="ChartsXAxisTickLabel"
                {...axisTickLabelProps}
                text={tickLabel}
              />
            )}
          </g>
        );
      })}
    </React.Fragment>
  );
}

export { ChartsSingleXAxisTicks };
