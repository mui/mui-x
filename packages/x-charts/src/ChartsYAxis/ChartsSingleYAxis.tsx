'use client';
import * as React from 'react';
import { useIsHydrated } from '../hooks/useIsHydrated';
import { getStringSize } from '../internals/domUtils';
import { useTicks } from '../hooks/useTicks';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { ChartsYAxisProps } from '../models/axis';
import { useChartContext } from '../context/ChartProvider';
import { shortenLabels } from './shortenLabels';
import { AXIS_LABEL_TICK_LABEL_GAP, TICK_LABEL_GAP, YAxisRoot } from './utilities';
import { useAxisProps } from './useAxisProps';

/**
 * @ignore - internal component.
 */
function ChartsSingleYAxis(inProps: ChartsYAxisProps) {
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
    isRtl,
  } = useAxisProps(inProps);

  const {
    position,
    disableLine,
    disableTicks,
    label,
    tickSize: tickSizeProp,
    valueFormatter,
    slotProps,
    tickPlacement,
    tickLabelPlacement,
    tickInterval,
    tickLabelInterval,
    sx,
    offset,
    width: axisWidth,
  } = defaultizedProps;

  const drawingArea = useDrawingArea();
  const { left, top, width, height } = drawingArea;
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
    direction: 'y',
  });

  // Skip axis rendering if no data is available
  // - The domain is an empty array for band/point scales.
  // - The domains contains Infinity for continuous scales.
  // - The position is set to 'none'.
  if (skipAxisRendering) {
    return null;
  }

  const labelRefPoint = {
    x: positionSign * axisWidth,
    y: top + height / 2,
  };
  /* If there's an axis title, the tick labels have less space to render  */
  const tickLabelsMaxWidth = Math.max(
    0,
    axisWidth -
      (label ? getStringSize(label, axisLabelProps.style).height + AXIS_LABEL_TICK_LABEL_GAP : 0) -
      tickSize -
      TICK_LABEL_GAP,
  );

  const tickLabels = isHydrated
    ? shortenLabels(yTicks, drawingArea, tickLabelsMaxWidth, isRtl, axisTickLabelProps.style)
    : new Map(Array.from(yTicks).map((item) => [item, item.formattedValue]));

  return (
    <YAxisRoot
      transform={`translate(${position === 'right' ? left + width + offset : left - offset}, 0)`}
      className={classes.root}
      sx={sx}
    >
      {!disableLine && <Line y1={top} y2={top + height} className={classes.line} {...lineProps} />}

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
      {label && isHydrated && (
        <g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label} />
        </g>
      )}
    </YAxisRoot>
  );
}

export { ChartsSingleYAxis };
