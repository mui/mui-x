'use client';
import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import { useIsHydrated } from '../hooks/useIsHydrated';
import { useTicks } from '../hooks/useTicks';
import { useDrawingArea } from '../hooks/useDrawingArea';
import type { ChartsYAxisProps } from '../models/axis';
import type { OrdinalTimeTicks } from '../models/timeTicks';
import { useChartContext } from '../context/ChartProvider';
import { shortenLabels } from './shortenLabels';
import { AXIS_LABEL_TICK_LABEL_GAP, TICK_LABEL_GAP } from './utilities';
import { useAxisTicksProps } from './useAxisTicksProps';

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
    width: axisWidth,
  } = defaultizedProps;

  const drawingArea = useDrawingArea();
  const { instance } = useChartContext();
  const isHydrated = useIsHydrated();

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

  const tickLabels = isHydrated
    ? shortenLabels(yTicks, drawingArea, tickLabelsMaxWidth, isRtl, axisTickLabelProps.style)
    : new Map(Array.from(yTicks).map((item) => [item, item.formattedValue]));

  return (
    <React.Fragment>
      {yTicks.map((item, index) => {
        const { offset: tickOffset, labelOffset, value } = item;
        const xTickLabel = positionSign * (tickSize + TICK_LABEL_GAP);
        const yTickLabel = labelOffset;
        const skipLabel =
          typeof tickLabelInterval === 'function' && !tickLabelInterval?.(value, index);

        const showLabel = instance.isYInside(tickOffset);
        const tickLabel = tickLabels.get(item);

        if (!showLabel) {
          return null;
        }

        return (
          <g
            key={index}
            transform={`translate(0, ${tickOffset})`}
            className={classes.tickContainer}
          >
            {!disableTicks && (
              <Tick
                x2={positionSign * tickSize}
                className={classes.tick}
                {...slotProps?.axisTick}
              />
            )}

            {tickLabel !== undefined && !skipLabel && (
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
