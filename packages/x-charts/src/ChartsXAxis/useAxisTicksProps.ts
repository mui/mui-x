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

export function useAxisTicksProps(inProps: ChartsXAxisProps) {
  const { xAxis, xAxisIds } = useXAxes();
  const { scale: xScale, tickNumber, reverse, ...settings } = xAxis[inProps.axisId ?? xAxisIds[0]];

  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const themedProps = useThemeProps({ props: { ...settings, ...inProps }, name: 'MuiChartsXAxis' });

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  const { position, tickLabelStyle, slots, slotProps } = defaultizedProps;

  const theme = useTheme();
  const isRtl = useRtl();
  const classes = useUtilityClasses(defaultizedProps);

  const positionSign = position === 'bottom' ? 1 : -1;

  const Tick = slots?.axisTick ?? 'line';
  const TickLabel = slots?.axisTickLabel ?? ChartsText;

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

  return {
    xScale,
    defaultizedProps,
    tickNumber,
    positionSign,
    classes,
    Tick,
    TickLabel,
    axisTickLabelProps,
    reverse,
  };
}
