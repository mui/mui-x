'use client';
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { ChartsBrushOverlay } from '@mui/x-charts/ChartsBrushOverlay';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsSvgSurface } from '@mui/x-charts/ChartsSvgSurface';
import {
  FocusedHeatmapCell,
  HeatmapPlot,
  type HeatmapProps,
  HeatmapTooltip,
} from '@mui/x-charts-pro/Heatmap';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsToolbarPro } from '@mui/x-charts-pro/ChartsToolbarPro';
import { ChartsOverlay } from '@mui/x-charts/ChartsOverlay';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { useHeatmapPremiumProps } from './useHeatmapPremiumProps';
import { ChartDataProviderPremium } from '../ChartDataProviderPremium';
import { type HeatmapPremiumPluginSignatures } from './HeatmapPremium.plugins';

export interface HeatmapPremiumProps extends HeatmapProps {}

export const HeatmapPremium = React.forwardRef(function HeatmapPremium(
  inProps: HeatmapPremiumProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiHeatmapPremium' });
  const { sx, slots, slotProps, loading, hideLegend, showToolbar = false } = props;

  const {
    chartDataProviderPremiumProps,
    chartsWrapperProps,
    chartsAxisProps,
    clipPathProps,
    clipPathGroupProps,
    legendProps,
    heatmapPlotProps,
    overlayProps,
    children,
  } = useHeatmapPremiumProps(props);

  const Tooltip = slots?.tooltip ?? HeatmapTooltip;
  const Toolbar = slots?.toolbar ?? ChartsToolbarPro;

  return (
    <ChartDataProviderPremium<'heatmap', HeatmapPremiumPluginSignatures>
      {...chartDataProviderPremiumProps}
    >
      <ChartsWrapper {...chartsWrapperProps}>
        {showToolbar ? <Toolbar {...props.slotProps?.toolbar} /> : null}
        {!hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsSvgSurface ref={ref} sx={sx}>
          <g {...clipPathGroupProps}>
            <HeatmapPlot {...heatmapPlotProps} />
            <FocusedHeatmapCell />
            <ChartsOverlay {...overlayProps} />
          </g>
          <ChartsAxis {...chartsAxisProps} />
          <ChartsClipPath {...clipPathProps} />
          <ChartsBrushOverlay />
          {children}
        </ChartsSvgSurface>
        {!loading && <Tooltip {...slotProps?.tooltip} />}
      </ChartsWrapper>
    </ChartDataProviderPremium>
  );
});
