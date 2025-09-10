'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled, useTheme, useThemeProps } from '@mui/material/styles';
import { AxisScaleConfig, ChartsXAxisProps, ComputedAxis } from '../models/axis';
import { ChartsSingleXAxisTicks } from './ChartsSingleXAxisTicks';
import { ChartsGroupedXAxisTicks } from './ChartsGroupedXAxisTicks';
import { ChartsText, ChartsTextProps } from '../ChartsText';
import { isDiscreteScale } from '../internals/scaleGuards';
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
  axis: ComputedAxis<keyof AxisScaleConfig, any, ChartsXAxisProps>;
}

/**
 * @ignore - internal component. Use `ChartsXAxis` instead.
 */
export function ChartsXAxisImpl({ axis, ...inProps }: ChartsXAxisImplProps) {
  const { scale: xScale, tickNumber, reverse, ...settings } = axis;

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

  if (position === 'none') {
    return null;
  }

  const labelHeight = label ? getStringSize(label, axisLabelProps.style).height : 0;

  const domain = xScale.domain();
  const isScaleDiscrete = isDiscreteScale(xScale);
  const skipTickRendering = isScaleDiscrete ? domain.length === 0 : domain.some(isInfinity);
  let children: React.ReactNode = null;

  if (!skipTickRendering) {
    children =
      'groups' in axis && Array.isArray(axis.groups) ? (
        <ChartsGroupedXAxisTicks {...inProps} />
      ) : (
        <ChartsSingleXAxisTicks {...inProps} axisLabelHeight={labelHeight} />
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
