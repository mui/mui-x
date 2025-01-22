'use client';
import { useThemeProps } from '@mui/material/styles';
import * as React from 'react';

import { ChartsAxis, ChartsAxisProps } from '@mui/x-charts/ChartsAxis';
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
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { FunnelPlot, FunnelPlotProps, FunnelPlotSlotProps, FunnelPlotSlots } from './FunnelPlot';
import { FunnelSeriesType } from './funnel.types';
import { useFunnelChartProps } from './useFunnelChartProps';
import { ChartContainerProProps } from '../ChartContainerPro';
import { plugin as funnelPlugin } from './plugin';
import { useChartContainerProProps } from '../ChartContainerPro/useChartContainerProProps';
import { ChartDataProviderPro } from '../ChartDataProviderPro';

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
  props: FunnelChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const { apiRef, ...themedProps } = useThemeProps({ props, name: 'MuiFunnelChart' });

  const {
    chartContainerProps,
    funnelPlotProps,
    overlayProps,
    legendProps,
    clipPathGroupProps,
    clipPathProps,
    chartsWrapperProps,
    children,
    chartsAxisProps,
  } = useFunnelChartProps(themedProps);
  const { chartDataProviderProProps, chartsSurfaceProps } = useChartContainerProProps(
    { ...chartContainerProps, apiRef },
    ref,
  );

  const Tooltip = themedProps.slots?.tooltip ?? ChartsTooltip;

  return (
    <ChartDataProviderPro {...chartDataProviderProProps} seriesConfig={seriesConfig}>
      <ChartsWrapper {...chartsWrapperProps}>
        {!themedProps.hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsSurface {...chartsSurfaceProps}>
          <g {...clipPathGroupProps}>
            <FunnelPlot {...funnelPlotProps} />
            <ChartsOverlay {...overlayProps} />
            {/* <ChartsAxisHighlight {...axisHighlightProps} /> */}
          </g>
          {!themedProps.loading && <Tooltip {...themedProps.slotProps?.tooltip} />}
          <ChartsClipPath {...clipPathProps} />
          <ChartsAxis {...chartsAxisProps} />
          {children}
        </ChartsSurface>
      </ChartsWrapper>
    </ChartDataProviderPro>
  );
});

export { FunnelChart };
