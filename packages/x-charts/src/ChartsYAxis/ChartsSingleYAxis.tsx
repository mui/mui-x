'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { useThemeProps, useTheme } from '@mui/material/styles';
import { useRtl } from '@mui/system/RtlProvider';
import { useIsHydrated } from '../hooks/useIsHydrated';
import { getDefaultBaseline, getDefaultTextAnchor } from '../ChartsText/defaultTextPlacement';
import { getStringSize } from '../internals/domUtils';
import { useTicks } from '../hooks/useTicks';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { ChartsYAxisProps } from '../models/axis';
import { ChartsText, ChartsTextProps } from '../ChartsText';
import { isInfinity } from '../internals/isInfinity';
import { isBandScale } from '../internals/isBandScale';
import { useChartContext } from '../context/ChartProvider';
import { useYAxes } from '../hooks';
import { invertTextAnchor } from '../internals/invertTextAnchor';
import { shortenLabels } from './shortenLabels';
import {
  AXIS_LABEL_TICK_LABEL_GAP,
  defaultProps,
  TICK_LABEL_GAP,
  useUtilityClasses,
  YAxisRoot,
} from './utilities';

/**
 * @ignore - internal component.
 */
function ChartsSingleYAxis(inProps: ChartsYAxisProps) {
  const { yAxisIds, yAxis } = useYAxes();
  const { scale: yScale, tickNumber, ...settings } = yAxis[inProps.axisId ?? yAxisIds[0]];

  const themedProps = useThemeProps({
    props: { ...settings, ...inProps },
    name: 'MuiChartsSingleYAxis',
  });

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  const {
    position,
    disableLine,
    disableTicks,
    label,
    labelStyle,
    tickLabelStyle,
    tickSize: tickSizeProp,
    valueFormatter,
    slots,
    slotProps,
    tickPlacement,
    tickLabelPlacement,
    tickInterval,
    tickLabelInterval,
    sx,
    offset,
    width: axisWidth,
  } = defaultizedProps;

  const theme = useTheme();
  const isRtl = useRtl();
  const isHydrated = useIsHydrated();

  const classes = useUtilityClasses(defaultizedProps);

  const { instance } = useChartContext();
  const drawingArea = useDrawingArea();
  const { left, top, width, height } = drawingArea;

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

  const positionSign = position === 'right' ? 1 : -1;

  const tickFontSize = typeof tickLabelStyle?.fontSize === 'number' ? tickLabelStyle.fontSize : 12;

  const Line = slots?.axisLine ?? 'line';
  const Tick = slots?.axisTick ?? 'line';
  const TickLabel = slots?.axisTickLabel ?? ChartsText;
  const Label = slots?.axisLabel ?? ChartsText;

  const defaultTextAnchor = getDefaultTextAnchor(
    (position === 'right' ? -90 : 90) - (tickLabelStyle?.angle ?? 0),
  );
  const defaultDominantBaseline = getDefaultBaseline(
    (position === 'right' ? -90 : 90) - (tickLabelStyle?.angle ?? 0),
  );

  const axisTickLabelProps = useSlotProps({
    elementType: TickLabel,
    externalSlotProps: slotProps?.axisTickLabel,
    additionalProps: {
      style: {
        ...theme.typography.caption,
        fontSize: tickFontSize,
        textAnchor: isRtl ? invertTextAnchor(defaultTextAnchor) : defaultTextAnchor,
        dominantBaseline: defaultDominantBaseline,
        ...tickLabelStyle,
      },
    } as Partial<ChartsTextProps>,
    className: classes.tickLabel,
    ownerState: {},
  });

  const axisLabelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps?.axisLabel,
    additionalProps: {
      style: {
        ...theme.typography.body1,
        lineHeight: 1,
        fontSize: 14,
        angle: positionSign * 90,
        textAnchor: 'middle',
        dominantBaseline: 'text-before-edge',
        ...labelStyle,
      } as Partial<ChartsTextProps>['style'],
    } as Partial<ChartsTextProps>,
    ownerState: {},
  });

  const lineSlotProps = useSlotProps({
    elementType: Line,
    externalSlotProps: slotProps?.axisLine,
    additionalProps: {
      strokeLinecap: 'square' as const,
    },
    ownerState: {},
  });

  const domain = yScale.domain();
  const ordinalAxis = isBandScale(yScale);

  // Skip axis rendering if no data is available
  // - The domain is an empty array for band/point scales.
  // - The domains contains Infinity for continuous scales.
  // - The position is 'none'.
  if (
    (ordinalAxis && domain.length === 0) ||
    (!ordinalAxis && domain.some(isInfinity)) ||
    position === 'none'
  ) {
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
      {!disableLine && (
        <Line y1={top} y2={top + height} className={classes.line} {...lineSlotProps} />
      )}

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
