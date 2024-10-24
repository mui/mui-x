'use client';
import { useThemeProps } from '@mui/material/styles';
import * as React from 'react';
import {
  ResponsiveChartContainer,
  ResponsiveChartContainerProps,
} from '../ResponsiveChartContainer';
import { ChartsAxisProps } from '../ChartsAxis';
import {
  ChartsOverlay,
  ChartsOverlayProps,
  ChartsOverlaySlotProps,
  ChartsOverlaySlots,
} from '../ChartsOverlay';
import {
  ChartsTooltip,
  ChartsTooltipProps,
  ChartsTooltipSlotProps,
  ChartsTooltipSlots,
} from '../ChartsTooltip';
import { FunnelPlot, FunnelPlotProps, FunnelPlotSlotProps, FunnelPlotSlots } from './FunnelPlot';
import { FunnelSeriesType } from './funnel.types';
import { MakeOptional } from '../models/helpers';
import { ChartsAxisSlotProps, ChartsAxisSlots } from '../models/axis';
import { ChartsLegend, ChartsLegendSlotProps, ChartsLegendSlots } from '../ChartsLegend';
import { useFunnelChartProps } from './useFunnelChartProps';

export interface FunnelChartSlots
  extends ChartsAxisSlots,
    FunnelPlotSlots,
    ChartsLegendSlots,
    ChartsTooltipSlots<'funnel'>,
    ChartsOverlaySlots {}
export interface FunnelChartSlotProps
  extends ChartsAxisSlotProps,
    FunnelPlotSlotProps,
    ChartsLegendSlotProps,
    ChartsTooltipSlotProps<'funnel'>,
    ChartsOverlaySlotProps {}

export interface FunnelChartProps
  extends Omit<ResponsiveChartContainerProps, 'series' | 'plugins' | 'zAxis'>,
    Omit<FunnelPlotProps, 'slots' | 'slotProps'>,
    Omit<ChartsAxisProps, 'slots' | 'slotProps'>,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'> {
  /**
   * The series to display in the funnel chart.
   * An array of [[FunnelSeriesType]] objects.
   */
  series: MakeOptional<FunnelSeriesType, 'type'>[];
  /**
   * The configuration of the tooltip.
   * @see See {@link https://mui.com/x/react-charts/tooltip/ tooltip docs} for more details.
   */
  tooltip?: ChartsTooltipProps<'funnel'>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: FunnelChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: FunnelChartSlotProps;
  /**
   * The direction of the funnel elements.
   * @default 'vertical'
   */
  layout?: FunnelSeriesType['layout'];
}

const FunnelChart = React.forwardRef(function FunnelChart(inProps: FunnelChartProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiFunnelChart' });

  const {
    chartContainerProps,
    funnelPlotProps,
    overlayProps,
    tooltipProps,
    legendProps,
    children,
  } = useFunnelChartProps(props);

  return (
    <ResponsiveChartContainer ref={ref} {...chartContainerProps}>
      <ChartsOverlay {...overlayProps} />
      <FunnelPlot {...funnelPlotProps} />
      <ChartsLegend {...legendProps} />
      {!props.loading && <ChartsTooltip {...tooltipProps} />}
      {children}
    </ResponsiveChartContainer>
  );
});

export { FunnelChart };
