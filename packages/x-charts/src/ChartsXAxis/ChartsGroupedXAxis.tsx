'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { useThemeProps, useTheme } from '@mui/material/styles';
import { useRtl } from '@mui/system/RtlProvider';
import { useIsHydrated } from '../hooks/useIsHydrated';
import { getStringSize } from '../internals/domUtils';
import { useTicks, type TickItemType } from '../hooks/useTicks';
import { ChartsXAxisProps } from '../models/axis';
import { ChartsText, ChartsTextProps } from '../ChartsText';
import { useMounted } from '../hooks/useMounted';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { isInfinity } from '../internals/isInfinity';
import { isBandScale } from '../internals/isBandScale';
import { useChartContext } from '../context/ChartProvider/useChartContext';
import { useXAxes } from '../hooks/useAxis';
import { getDefaultBaseline, getDefaultTextAnchor } from '../ChartsText/defaultTextPlacement';
import { invertTextAnchor } from '../internals/invertTextAnchor';
import { shortenLabels } from './shortenLabels';
import { getVisibleLabels } from './getVisibleLabels';
import {
  defaultProps,
  AXIS_LABEL_TICK_LABEL_GAP,
  TICK_LABEL_GAP,
  XAxisRoot,
  useUtilityClasses,
} from './utilities';

/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsXAxis API](https://mui.com/x/api/charts/charts-x-axis/)
 */
function ChartsGroupedXAxis(inProps: ChartsXAxisProps) {
  const { xAxis, xAxisIds } = useXAxes();
  const { scale: xScale, tickNumber, reverse, ...settings } = xAxis[inProps.axisId ?? xAxisIds[0]];

  const isMounted = useMounted();

  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const themedProps = useThemeProps({ props: { ...settings, ...inProps }, name: 'MuiChartsXAxis' });

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  const {
    position,
    disableLine,
    disableTicks,
    tickLabelStyle,
    label,
    labelStyle,
    tickSize: tickSizeProp,
    valueFormatter,
    slots,
    slotProps,
    tickInterval,
    tickLabelInterval,
    tickPlacement,
    tickLabelPlacement,
    tickLabelMinGap,
    sx,
    offset,
    height: axisHeight,
    getGrouping,
  } = defaultizedProps;

  const theme = useTheme();
  const isRtl = useRtl();
  const classes = useUtilityClasses(defaultizedProps);
  const drawingArea = useDrawingArea();
  const { left, top, width, height } = drawingArea;
  const { instance } = useChartContext();
  const isHydrated = useIsHydrated();

  const tickSize = disableTicks ? 4 : tickSizeProp;

  const positionSign = position === 'bottom' ? 1 : -1;

  const Line = slots?.axisLine ?? 'line';
  const Tick = slots?.axisTick ?? 'line';
  const TickLabel = slots?.axisTickLabel ?? ChartsText;
  const Label = slots?.axisLabel ?? ChartsText;

  const defaultTextAnchor = getDefaultTextAnchor(
    (position === 'bottom' ? 0 : 180) - (tickLabelStyle?.angle ?? 0),
  );
  const defaultDominantBaseline = getDefaultBaseline(
    (position === 'bottom' ? 0 : 180) - (tickLabelStyle?.angle ?? 0),
  );

  const axisTickLabelProps = useSlotProps({
    elementType: TickLabel,
    externalSlotProps: slotProps?.axisTickLabel,
    additionalProps: {
      style: {
        ...theme.typography.caption,
        fontSize: 12,
        lineHeight: 1.25,
        textAnchor: isRtl ? invertTextAnchor(defaultTextAnchor) : defaultTextAnchor,
        dominantBaseline: defaultDominantBaseline,
        ...tickLabelStyle,
      },
    } as Partial<ChartsTextProps>,
    className: classes.tickLabel,
    ownerState: {},
  });

  const xTicks = useTicks({
    scale: xScale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement,
    tickLabelPlacement,
    direction: 'x',
  })
    .map((item, index, arr) => ({
      original: item,
      grouping:
        index !== arr.length - 1
          ? (getGrouping?.(item.value, index) ?? [item.value])
          : [item.value],
    }))
    .flatMap((grouped) => {
      return grouped.grouping.map((groupValue, groupIndex) => {
        return {
          ...grouped.original,
          value: groupValue,
          formattedValue: `${groupValue}`,
          groupIndex,
        } as TickItemType;
      });
    })
    .filter(
      (item, i, arr) =>
        arr.findIndex((v) => v.value === item.value && v.groupIndex === item.groupIndex) === i,
    );

  const groupedXTicks = xTicks.reduce((acc, item) => {
    if (!acc[item.groupIndex ?? 0]) {
      acc[item.groupIndex ?? 0] = [];
    }
    acc[item.groupIndex ?? 0].push(item);
    return acc;
  }, [] as TickItemType[][]);

  const visibleLabels = new Set(
    groupedXTicks.reduce((acc, v) => {
      const set = getVisibleLabels(v, {
        tickLabelStyle: axisTickLabelProps.style,
        tickLabelInterval,
        tickLabelMinGap,
        reverse,
        isMounted,
        isXInside: instance.isXInside,
      });

      acc.push(...set);
      return acc;
    }, [] as TickItemType[]),
  );

  const axisLabelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps?.axisLabel,
    additionalProps: {
      style: {
        ...theme.typography.body1,
        lineHeight: 1,
        fontSize: 14,
        textAnchor: 'middle',
        dominantBaseline: position === 'bottom' ? 'text-after-edge' : 'text-before-edge',
        ...labelStyle,
      },
    } as Partial<ChartsTextProps>,
    ownerState: {},
  });

  const domain = xScale.domain();
  const ordinalAxis = isBandScale(xScale);
  // Skip axis rendering if no data is available
  // - The domain is an empty array for band/point scales.
  // - The domains contains Infinity for continuous scales.
  // - The position is set to 'none'.
  if (
    (ordinalAxis && domain.length === 0) ||
    (!ordinalAxis && domain.some(isInfinity)) ||
    position === 'none'
  ) {
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
            transform={`translate(${tickOffset}, ${tickSize * (item.groupIndex ?? 0)})`}
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

ChartsGroupedXAxis.propTypes = {} as any;

export { ChartsGroupedXAxis };
