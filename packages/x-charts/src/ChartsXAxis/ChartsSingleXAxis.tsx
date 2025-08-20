'use client';
import * as React from 'react';
import { useIsHydrated } from '../hooks/useIsHydrated';
import { getStringSize } from '../internals/domUtils';
import { useTicks } from '../hooks/useTicks';
import { ChartsXAxisProps } from '../models/axis';
import { useMounted } from '../hooks/useMounted';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { useChartContext } from '../context/ChartProvider/useChartContext';
import { shortenLabels } from './shortenLabels';
import { getVisibleLabels } from './getVisibleLabels';
import { AXIS_LABEL_TICK_LABEL_GAP, TICK_LABEL_GAP, XAxisRoot } from './utilities';
import { useAxisProps } from './useAxisProps';

/**
 * @ignore - internal component.
 */
function ChartsSingleXAxis(inProps: ChartsXAxisProps) {
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
    reverse,
    isRtl,
  } = useAxisProps(inProps);

  const isMounted = useMounted();

  const {
    position,
    disableLine,
    disableTicks,
    label,
    tickSize: tickSizeProp,
    valueFormatter,
    slotProps,
    tickInterval,
    tickLabelInterval,
    tickPlacement,
    tickLabelPlacement,
    tickLabelMinGap,
    sx,
    offset,
    height: axisHeight,
  } = defaultizedProps;

  const drawingArea = useDrawingArea();
  const { left, top, width, height } = drawingArea;
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
    direction: 'x',
  });

  const visibleLabels = getVisibleLabels(xTicks, {
    tickLabelStyle: axisTickLabelProps.style,
    tickLabelInterval,
    tickLabelMinGap,
    reverse,
    isMounted,
    isXInside: instance.isXInside,
  });

  // Skip axis rendering if no data is available
  // - The domain is an empty array for band/point scales.
  // - The domains contains Infinity for continuous scales.
  // - The position is set to 'none'.
  if (skipAxisRendering) {
    return null;
  }

  const labelHeight = label ? getStringSize(label, axisLabelProps.style).height : 0;
  const labelRefPoint = {
    x: left + width / 2,
    y: positionSign * axisHeight,
  };

  /* If there's an axis title, the tick labels have less space to render  */
  const tickLabelsMaxHeight = Math.max(
    0,
    axisHeight - (label ? labelHeight + AXIS_LABEL_TICK_LABEL_GAP : 0) - tickSize - TICK_LABEL_GAP,
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

      {label && (
        <g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label} />
        </g>
      )}
    </XAxisRoot>
  );
}

export { ChartsSingleXAxis };
