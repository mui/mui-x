'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled, useTheme } from '@mui/material/styles';
import type { ChartsXAxisProps, ComputedAxis, ScaleName } from '../models/axis';
import { ChartsSingleXAxisTicks } from './ChartsSingleXAxisTicks';
import { ChartsGroupedXAxisTicks } from './ChartsGroupedXAxisTicks';
import { ChartsText, type ChartsTextProps } from '../ChartsText';
import { isOrdinalScale } from '../internals/scaleGuards';
import { isInfinity } from '../internals/isInfinity';
import { defaultProps, useUtilityClasses } from './utilities';
import { useDrawingArea } from '../hooks';
import { getStringSize } from '../internals/domUtils';
import { AxisRoot } from '../internals/components/AxisSharedComponents';

const XAxisRoot = styled(AxisRoot, {
  name: 'MuiChartsXAxis',
  slot: 'Root',
})({});

interface ChartsXAxisImplProps extends Omit<ChartsXAxisProps, 'axis'> {
  axis: ComputedAxis<ScaleName, any, ChartsXAxisProps>;
}

/**
 * @ignore - internal component. Use `ChartsXAxis` instead.
 */
export function ChartsXAxisImpl({ axis, ...inProps }: ChartsXAxisImplProps) {
  // @ts-expect-error ordinalTimeTicks may not be present on all axis types
  // Should be set to never, but this causes other issues with proptypes generator.
  const { scale: xScale, tickNumber, reverse, ordinalTimeTicks, ...settings } = axis;

  const defaultizedProps = { ...defaultProps, ...settings, ...inProps };

  const {
    position,
    labelStyle,
    offset,
    slots,
    slotProps,
    sx,
    disableLine,
    label,
    height: axisHeight,
  } = defaultizedProps;

  const theme = useTheme();
  const classes = useUtilityClasses(defaultizedProps);
  const { left, top, width, height } = useDrawingArea();

  const positionSign = position === 'bottom' ? 1 : -1;
  const Line = slots?.axisLine ?? 'line';
  const Label = slots?.axisLabel ?? ChartsText;

  const axisLabelProps = useSlotProps({
    elementType: Label,
    // @ts-expect-error `useSlotProps` applies `WithCommonProps` with adds a `style: React.CSSProperties` prop automatically.
    externalSlotProps: slotProps?.axisLabel,
    // @ts-expect-error `useSlotProps` applies `WithCommonProps` with adds a `style: React.CSSProperties` prop automatically.
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

  if (position === 'none') {
    return null;
  }

  const labelHeight = label ? getStringSize(label, axisLabelProps.style).height : 0;

  const domain = xScale.domain();
  const isScaleOrdinal = isOrdinalScale(xScale);
  const skipTickRendering = isScaleOrdinal ? domain.length === 0 : domain.some(isInfinity);
  let children: React.ReactNode = null;

  if (!skipTickRendering) {
    children =
      'groups' in axis && Array.isArray(axis.groups) ? (
        <ChartsGroupedXAxisTicks {...inProps} />
      ) : (
        <ChartsSingleXAxisTicks
          {...inProps}
          axisLabelHeight={labelHeight}
          ordinalTimeTicks={ordinalTimeTicks}
        />
      );
  }

  const labelRefPoint = {
    x: left + width / 2,
    y: positionSign * axisHeight,
  };

  return (
    <XAxisRoot
      transform={`translate(0, ${position === 'bottom' ? top + height + offset : top - offset})`}
      className={classes.root}
      data-axis-id={defaultizedProps.id}
      sx={sx}
    >
      {!disableLine && (
        <Line x1={left} x2={left + width} className={classes.line} {...slotProps?.axisLine} />
      )}
      {children}
      {label && (
        <g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label} />
        </g>
      )}
    </XAxisRoot>
  );
}
