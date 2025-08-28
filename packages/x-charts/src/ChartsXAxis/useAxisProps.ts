'use client';
import useSlotProps from '@mui/utils/useSlotProps';
import { useThemeProps, useTheme } from '@mui/material/styles';
import { useRtl } from '@mui/system/RtlProvider';
import { ChartsXAxisProps } from '../models/axis';
import { ChartsText, ChartsTextProps } from '../ChartsText';
import { useXAxes } from '../hooks/useAxis';
import { getDefaultBaseline, getDefaultTextAnchor } from '../ChartsText/defaultTextPlacement';
import { invertTextAnchor } from '../internals/invertTextAnchor';
import { defaultProps, useUtilityClasses } from './utilities';
import { isBandScale } from '../internals/isBandScale';
import { isInfinity } from '../internals/isInfinity';
import { filterAttributeSafeProperties } from '../internals/filterAttributeSafeProperties';

export const useAxisProps = (inProps: ChartsXAxisProps) => {
  const { xAxis, xAxisIds } = useXAxes();
  const { scale: xScale, tickNumber, reverse, ...settings } = xAxis[inProps.axisId ?? xAxisIds[0]];

  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const themedProps = useThemeProps({ props: { ...settings, ...inProps }, name: 'MuiChartsXAxis' });

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  const { position, tickLabelStyle, labelStyle, slots, slotProps } = defaultizedProps;

  const theme = useTheme();
  const isRtl = useRtl();
  const classes = useUtilityClasses(defaultizedProps);

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

  const { safe: axisTickLabelSafeProps, unsafe: axisTickLabelUnsafeProps } =
    filterAttributeSafeProperties({
      ...theme.typography.caption,
      fontSize: 12,
      lineHeight: 1.25,
      textAnchor: isRtl ? invertTextAnchor(defaultTextAnchor) : defaultTextAnchor,
      dominantBaseline: defaultDominantBaseline,
      ...tickLabelStyle,
    });

  const axisTickLabelProps = useSlotProps({
    elementType: TickLabel,
    externalSlotProps: slotProps?.axisTickLabel,
    additionalProps: {
      ...axisTickLabelSafeProps,
      style: axisTickLabelUnsafeProps,
    } as Partial<ChartsTextProps>,
    className: classes.tickLabel,
    ownerState: {},
  });

  const { safe: axisLabelSafeProps, unsafe: axisLabelUnsafeProps } = filterAttributeSafeProperties({
    ...theme.typography.body1,
    lineHeight: 1,
    fontSize: 14,
    textAnchor: 'middle',
    dominantBaseline: position === 'bottom' ? 'text-after-edge' : 'text-before-edge',
    ...labelStyle,
  });

  const axisLabelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps?.axisLabel,
    additionalProps: {
      ...axisLabelSafeProps,
      style: axisLabelUnsafeProps,
    } as Partial<ChartsTextProps>,
    ownerState: {},
  });

  const domain = xScale.domain();
  const isScaleBand = isBandScale(xScale);

  const skipAxisRendering =
    (isScaleBand && domain.length === 0) ||
    (!isScaleBand && domain.some(isInfinity)) ||
    position === 'none';

  const axisLineProps = useSlotProps({
    elementType: Line,
    externalSlotProps: slotProps?.axisLine,
    additionalProps: {
      strokeLinecap: 'square' as const,
      stroke: (theme.vars || theme).palette.text.primary,
      strokeWidth: 1,
      shapeRendering: 'crispEdges',
      className: classes.line,
    },
    ownerState: {},
  });

  const axisTickProps = useSlotProps({
    elementType: Tick,
    externalSlotProps: slotProps?.axisTick,
    additionalProps: {
      stroke: (theme.vars || theme).palette.text.primary,
      strokeWidth: 1,
      shapeRendering: 'crispEdges',
      className: classes.tick,
    },
    ownerState: {},
  });

  return {
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
    axisLineProps,
    axisTickProps,
    reverse,
    isRtl,
  };
};
