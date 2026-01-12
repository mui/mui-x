'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled, useTheme, useThemeProps } from '@mui/material/styles';
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
import type { ChartsAxisTicksProps } from '../ChartsAxis/ChartsAxis.types';

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

  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const themedProps = useThemeProps({ props: { ...settings, ...inProps }, name: 'MuiChartsXAxis' });
  const defaultizedProps = { ...defaultProps, ...themedProps };

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
  const AxisTicks = slots?.axisTicks ?? ChartsXAxisTicks;

  const labelRefPoint = {
    x: left + width / 2,
    y: positionSign * axisHeight,
  };

  return (
    <XAxisRoot
      transform={`translate(0, ${position === 'bottom' ? top + height + offset : top - offset})`}
      className={classes.root}
      sx={sx}
    >
      {!disableLine && (
        <Line x1={left} x2={left + width} className={classes.line} {...slotProps?.axisLine} />
      )}
      {!skipTickRendering && (
        <AxisTicks
          {...inProps}
          {...slotProps?.axisTicks}
          axis={axis}
          axisLabelHeight={labelHeight}
          ordinalTimeTicks={ordinalTimeTicks}
          direction="x"
        />
      )}
      {label && (
        <g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label} />
        </g>
      )}
    </XAxisRoot>
  );
}

/**
 * Render X Axis ticks, either grouped or single.
 */
export function ChartsXAxisTicks({
  axis,
  ordinalTimeTicks,
  axisLabelHeight,
  ...inProps
}: ChartsAxisTicksProps<'x'>) {
  if ('groups' in axis && Array.isArray(axis.groups)) {
    return <ChartsGroupedXAxisTicks {...inProps} />;
  }

  return (
    <ChartsSingleXAxisTicks
      {...inProps}
      axisLabelHeight={axisLabelHeight}
      ordinalTimeTicks={ordinalTimeTicks}
    />
  );
}
