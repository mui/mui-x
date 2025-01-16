'use client';
import { useThemeProps } from '@mui/material/styles';
import * as React from 'react';

import { ChartsAxisProps } from '@mui/x-charts/ChartsAxis';
import {
  ChartsOverlay,
  ChartsOverlayProps,
  ChartsOverlaySlotProps,
  ChartsOverlaySlots,
} from '@mui/x-charts/ChartsOverlay';
import {
  ChartsTooltip,
  ChartsTooltipSlotProps,
  ChartsTooltipSlots,
} from '@mui/x-charts/ChartsTooltip';
import {
  ChartsAxisSlotProps,
  ChartsAxisSlots,
  ChartSeriesConfig,
  ChartsWrapper,
} from '@mui/x-charts/internals';
import { ChartsLegend, ChartsLegendSlotProps, ChartsLegendSlots } from '@mui/x-charts/ChartsLegend';
import { MakeOptional } from '@mui/x-internals/types';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { FunnelPlot, FunnelPlotProps, FunnelPlotSlotProps, FunnelPlotSlots } from './FunnelPlot';
import { FunnelSeriesType } from './funnel.types';
import { useFunnelChartProps } from './useFunnelChartProps';
import { ChartContainerPro, ChartContainerProProps } from '../ChartContainerPro';
import { plugin as funnelPlugin } from './plugin';

export interface FunnelChartSlots
  extends ChartsAxisSlots,
    FunnelPlotSlots,
    ChartsLegendSlots,
    ChartsTooltipSlots,
    ChartsOverlaySlots {}
export interface FunnelChartSlotProps
  extends ChartsAxisSlotProps,
    FunnelPlotSlotProps,
    ChartsLegendSlotProps,
    ChartsTooltipSlotProps,
    ChartsOverlaySlotProps {}

export interface FunnelChartProps
  extends Omit<ChartContainerProProps, 'series' | 'plugins' | 'zAxis' | 'zoom' | 'onZoomChange'>,
    Omit<FunnelPlotProps, 'slots' | 'slotProps'>,
    Omit<ChartsAxisProps, 'slots' | 'slotProps'>,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'> {
  /**
   * The series to display in the funnel chart.
   * An array of [[FunnelSeriesType]] objects.
   */
  series: MakeOptional<FunnelSeriesType, 'type'>[];
  /**
   * If `true`, the legend is not rendered.
   * @default false
   */
  hideLegend?: boolean;
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

const seriesConfig: ChartSeriesConfig<'funnel'> = { funnel: funnelPlugin };

const FunnelChart = React.forwardRef(function FunnelChart(
  inProps: FunnelChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiFunnelChart' });

  const {
    chartContainerProps,
    funnelPlotProps,
    overlayProps,
    legendProps,
    clipPathGroupProps,
    clipPathProps,
    // chartsWrapperProps,
    children,
  } = useFunnelChartProps(props);

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;

  return (
    <ChartContainerPro<'funnel'> ref={ref} {...chartContainerProps} seriesConfig={seriesConfig}>
      {/* <ChartsWrapper {...chartsWrapperProps}> */}
      {!props.hideLegend && <ChartsLegend {...legendProps} />}
      <g {...clipPathGroupProps}>
        <FunnelPlot {...funnelPlotProps} />
        <ChartsOverlay {...overlayProps} />
        {/* <ChartsAxisHighlight {...axisHighlightProps} /> */}
      </g>
      {!props.loading && <Tooltip {...props.slotProps?.tooltip} />}
      <ChartsClipPath {...clipPathProps} />
      {children}
      {/* </ChartsWrapper> */}
    </ChartContainerPro>
  );
});

export { FunnelChart };
