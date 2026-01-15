'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { useThemeProps, useTheme, styled } from '@mui/material/styles';
import type { ChartsYAxisProps, ComputedAxis, ScaleName } from '../models/axis';
import { ChartsSingleYAxisTicks } from './ChartsSingleYAxisTicks';
import { ChartsGroupedYAxisTicks } from './ChartsGroupedYAxisTicks';
import { ChartsText, type ChartsTextProps } from '../ChartsText';
import { defaultProps, useUtilityClasses } from './utilities';
import { isInfinity } from '../internals/isInfinity';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { useIsHydrated } from '../hooks/useIsHydrated';
import { isOrdinalScale } from '../internals/scaleGuards';
import { getStringSize } from '../internals/domUtils';
import { AxisRoot } from '../internals/components/AxisSharedComponents';
import type { ChartsAxisTicksProps } from '../ChartsAxis/ChartsAxis.types';

const YAxisRoot = styled(AxisRoot, {
  name: 'MuiChartsYAxis',
  slot: 'Root',
})({});

interface ChartsYAxisImplProps extends Omit<ChartsYAxisProps, 'axis'> {
  axis: ComputedAxis<ScaleName, any, ChartsYAxisProps>;
}

/**
 * @ignore - internal component. Use `ChartsYAxis` instead.
 */
export function ChartsYAxisImpl({ axis, ...inProps }: ChartsYAxisImplProps) {
  // @ts-expect-error ordinalTimeTicks may not be present on all axis types
  // Should be set to never, but this causes other issues with proptypes generator.
  const { scale: yScale, tickNumber, reverse, ordinalTimeTicks, ...settings } = axis;
  const isHydrated = useIsHydrated();

  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const themedProps = useThemeProps({ props: { ...settings, ...inProps }, name: 'MuiChartsYAxis' });
  const defaultizedProps = { ...defaultProps, ...themedProps };

  const {
    position,
    disableLine,
    label,
    labelStyle,
    offset,
    width: axisWidth,
    sx,
    slots,
    slotProps,
  } = defaultizedProps;

  const theme = useTheme();
  const classes = useUtilityClasses(defaultizedProps);
  const { left, top, width, height } = useDrawingArea();

  const positionSign = position === 'right' ? 1 : -1;
  const Line = slots?.axisLine ?? 'line';
  const Label = slots?.axisLabel ?? ChartsText;

  const lineProps = useSlotProps({
    elementType: Line,
    externalSlotProps: slotProps?.axisLine,
    additionalProps: {
      strokeLinecap: 'square' as const,
    },
    ownerState: {},
  });
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
        angle: positionSign * 90,
        textAnchor: 'middle',
        dominantBaseline: 'text-before-edge',
        ...labelStyle,
      },
    } as Partial<ChartsTextProps>,
    ownerState: {},
  });

  // Skip axis rendering if no data is available
  // - The domain is an empty array for band/point scales.
  // - The domains contains Infinity for continuous scales.
  // - The position is set to 'none'.
  if (position === 'none') {
    return null;
  }

  const labelRefPoint = {
    x: positionSign * axisWidth,
    y: top + height / 2,
  };

  const axisLabelHeight = label == null ? 0 : getStringSize(label, axisLabelProps.style).height;

  const domain = yScale.domain();
  const isScaleOrdinal = isOrdinalScale(yScale);
  const skipTickRendering = isScaleOrdinal ? domain.length === 0 : domain.some(isInfinity);
  const AxisTicks = slots?.axisTicks ?? ChartsYAxisTicks;

  return (
    <YAxisRoot
      transform={`translate(${position === 'right' ? left + width + offset : left - offset}, 0)`}
      className={classes.root}
      sx={sx}
    >
      {!disableLine && <Line y1={top} y2={top + height} className={classes.line} {...lineProps} />}
      {!skipTickRendering && (
        <AxisTicks
          {...inProps}
          {...slotProps?.axisTicks}
          axisId={axis.id}
          axis={axis}
          axisLabelHeight={axisLabelHeight}
          ordinalTimeTicks={ordinalTimeTicks}
          direction="y"
        />
      )}
      {label && isHydrated && (
        <g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label} />
        </g>
      )}
    </YAxisRoot>
  );
}

/**
 * Renders the ticks for a Y axis, either grouped or single.
 */
export function ChartsYAxisTicks({
  axis,
  ordinalTimeTicks,
  axisLabelHeight,
  ...inProps
}: ChartsAxisTicksProps<'y'>) {
  if ('groups' in axis && Array.isArray(axis.groups)) {
    return <ChartsGroupedYAxisTicks {...inProps} />;
  }

  return (
    <ChartsSingleYAxisTicks
      {...inProps}
      axisLabelHeight={axisLabelHeight}
      ordinalTimeTicks={ordinalTimeTicks}
    />
  );
}
