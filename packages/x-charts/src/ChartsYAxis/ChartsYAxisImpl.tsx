'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { useThemeProps, useTheme, styled } from '@mui/material/styles';
import { AxisScaleConfig, ChartsYAxisProps, ComputedAxis } from '../models/axis';
import { ChartsSingleYAxisTicks } from './ChartsSingleYAxisTicks';
import { ChartsGroupedYAxisTicks } from './ChartsGroupedYAxisTicks';
import { ChartsText, ChartsTextProps } from '../ChartsText';
import { defaultProps, useUtilityClasses } from './utilities';
import { isInfinity } from '../internals/isInfinity';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { useIsHydrated } from '../hooks/useIsHydrated';
import { isBandScale } from '../internals/isBandScale';
import { getStringSize } from '../internals/domUtils';
import { AxisRoot } from '../internals/components/AxisSharedComponents';

const YAxisRoot = styled(AxisRoot, {
  name: 'MuiChartsYAxis',
  slot: 'Root',
})({});

interface ChartsYAxisImplProps extends Omit<ChartsYAxisProps, 'axis'> {
  axis: ComputedAxis<keyof AxisScaleConfig, any, ChartsYAxisProps>;
}

/**
 * @ignore - internal component. Use `ChartsYAxis` instead.
 */
export function ChartsYAxisImpl({ axis, ...inProps }: ChartsYAxisImplProps) {
  const { scale: yScale, tickNumber, reverse, ...settings } = axis;
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
  const isScaleBand = isBandScale(yScale);
  const skipTickRendering =
    (isScaleBand && domain.length === 0) || (!isScaleBand && domain.some(isInfinity));
  let children: React.ReactNode = null;

  if (!skipTickRendering) {
    children =
      'groups' in axis && Array.isArray(axis.groups) ? (
        <ChartsGroupedYAxisTicks {...inProps} />
      ) : (
        <ChartsSingleYAxisTicks {...inProps} axisLabelHeight={axisLabelHeight} />
      );
  }

  return (
    <YAxisRoot
      transform={`translate(${position === 'right' ? left + width + offset : left - offset}, 0)`}
      className={classes.root}
      sx={sx}
    >
      {!disableLine && <Line y1={top} y2={top + height} className={classes.line} {...lineProps} />}
      {children}
      {label && isHydrated && (
        <g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label} />
        </g>
      )}
    </YAxisRoot>
  );
}
