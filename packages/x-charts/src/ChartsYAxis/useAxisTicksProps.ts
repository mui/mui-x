'use client';
import useSlotProps from '@mui/utils/useSlotProps';
import { useThemeProps, useTheme } from '@mui/material/styles';
import { useRtl } from '@mui/system/RtlProvider';
import { ChartsYAxisProps } from '../models/axis';
import { ChartsText, ChartsTextProps } from '../ChartsText';
import { useYAxes } from '../hooks/useAxis';
import { getDefaultBaseline, getDefaultTextAnchor } from '../ChartsText/defaultTextPlacement';
import { invertTextAnchor } from '../internals/invertTextAnchor';
import { defaultProps, useUtilityClasses } from './utilities';

export function useAxisTicksProps(inProps: ChartsYAxisProps) {
  const { yAxis, yAxisIds } = useYAxes();
  const { scale: yScale, tickNumber, reverse, ...settings } = yAxis[inProps.axisId ?? yAxisIds[0]];

  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const themedProps = useThemeProps({ props: { ...settings, ...inProps }, name: 'MuiChartsYAxis' });

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  const { position, tickLabelStyle, slots, slotProps } = defaultizedProps;

  const theme = useTheme();
  const isRtl = useRtl();
  const classes = useUtilityClasses(defaultizedProps);

  const positionSign = position === 'right' ? 1 : -1;

  const tickFontSize = typeof tickLabelStyle?.fontSize === 'number' ? tickLabelStyle.fontSize : 12;

  const Tick = slots?.axisTick ?? 'line';
  const TickLabel = slots?.axisTickLabel ?? ChartsText;

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

  return {
    yScale,
    defaultizedProps,
    tickNumber,
    positionSign,
    classes,
    Tick,
    TickLabel,
    axisTickLabelProps,
  };
}
