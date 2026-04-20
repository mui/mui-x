'use client';
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  type ScatterChartProps,
  type ScatterChartSlots,
  type ScatterChartSlotProps,
  ScatterPlot,
} from '@mui/x-charts/ScatterChart';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsOverlay } from '@mui/x-charts/ChartsOverlay';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsTooltip, type ChartsTooltipProps } from '@mui/x-charts/ChartsTooltip';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsBrushOverlay } from '@mui/x-charts/ChartsBrushOverlay';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts/ChartsSvgLayer';
import { useScatterChartProps } from '@mui/x-charts/internals';
import {
  type ChartsToolbarProSlotProps,
  type ChartsToolbarProSlots,
} from '@mui/x-charts-pro/ChartsToolbarPro';
import { ChartsZoomSlider } from '@mui/x-charts-pro/ChartsZoomSlider';
import { type ChartsSlotPropsPro, type ChartsSlotsPro } from '@mui/x-charts-pro/internals';
import { ChartsWebGLLayer } from '../ChartsWebGLLayer';
import { ChartsDataProviderPremium } from '../ChartsDataProviderPremium';
import { useChartsContainerPremiumProps } from '../ChartsContainerPremium/useChartsContainerPremiumProps';
import { type ChartsContainerPremiumProps } from '../ChartsContainerPremium';
import { ChartsToolbarPro } from '../ChartsToolbarPro';
import { ScatterWebGLPlot } from './webgl/ScatterWebGLPlot';
import {
  SCATTER_CHART_PREMIUM_PLUGINS,
  type ScatterChartPremiumPluginSignatures,
} from './ScatterChartPremium.plugins';

export interface ScatterChartPremiumSlots
  extends Omit<ScatterChartSlots, 'toolbar'>,
    ChartsToolbarProSlots,
    Partial<ChartsSlotsPro> {}

export interface ScatterChartPremiumSlotProps
  extends Omit<ScatterChartSlotProps, 'toolbar' | 'tooltip'>,
    ChartsToolbarProSlotProps,
    Partial<ChartsSlotPropsPro> {
  tooltip?: Partial<ChartsTooltipProps<'item' | 'none'>>;
}

export interface ScatterChartPremiumProps
  extends Omit<
      ScatterChartProps,
      'apiRef' | 'slots' | 'slotProps' | 'plugins' | 'seriesConfig' | 'renderer'
    >,
    Omit<
      ChartsContainerPremiumProps<'scatter', ScatterChartPremiumPluginSignatures>,
      | 'series'
      | 'onItemClick'
      | 'slots'
      | 'slotProps'
      | 'highlightedAxis'
      | 'onHighlightedAxisChange'
    > {
  /**
   * The renderer to use for drawing the scatter points.
   * - `svg-single`: Renders each point as its own SVG element (full interactivity).
   * - `svg-batch`: Renders points in a batched SVG path (faster, reduced interactivity).
   * - `webgl`: Renders points into a WebGL canvas (fastest, no per-item SVG interactivity).
   * @default 'svg-single'
   */
  renderer?: 'svg-single' | 'svg-batch' | 'webgl';
  slots?: ScatterChartPremiumSlots;
  slotProps?: ScatterChartPremiumSlotProps;
}

const ScatterChartPremium = React.forwardRef(function ScatterChartPremium(
  inProps: ScatterChartPremiumProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiScatterChartPremium' });
  const {
    initialZoom,
    zoomData,
    onZoomChange,
    apiRef,
    showToolbar,
    renderer = 'svg-single',
    ...other
  } = props;

  const {
    chartsWrapperProps,
    chartsContainerProps,
    chartsAxisProps,
    gridProps,
    scatterPlotProps,
    overlayProps,
    legendProps,
    axisHighlightProps,
    children,
  } = useScatterChartProps({
    ...other,
    renderer: renderer === 'webgl' ? 'svg-single' : renderer,
  });

  const { chartsDataProviderPremiumProps, chartsSurfaceProps } =
    useChartsContainerPremiumProps<'scatter', ScatterChartPremiumPluginSignatures>({
      ...chartsContainerProps,
      initialZoom,
      zoomData,
      onZoomChange,
      apiRef,
      plugins: SCATTER_CHART_PREMIUM_PLUGINS,
    });

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;
  const Toolbar = props.slots?.toolbar ?? ChartsToolbarPro;
  const { className: chartsLayerContainerClassName, ...chartsSvgLayerProps } = chartsSurfaceProps;

  return (
    <ChartsDataProviderPremium<'scatter', ScatterChartPremiumPluginSignatures>
      {...chartsDataProviderPremiumProps}
    >
      <ChartsWrapper {...chartsWrapperProps} ref={ref}>
        {showToolbar ? <Toolbar {...props.slotProps?.toolbar} /> : null}
        {!props.hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsLayerContainer className={chartsLayerContainerClassName}>
          <ChartsSvgLayer>
            <ChartsGrid {...gridProps} />
          </ChartsSvgLayer>
          {renderer === 'webgl' && (
            <ChartsWebGLLayer>
              <ScatterWebGLPlot />
            </ChartsWebGLLayer>
          )}
          <ChartsSvgLayer {...chartsSvgLayerProps}>
            <ChartsAxis {...chartsAxisProps} />
            <ChartsZoomSlider />
            {renderer !== 'webgl' && (
              <g data-drawing-container>
                <ScatterPlot {...scatterPlotProps} />
              </g>
            )}
            <ChartsOverlay {...overlayProps} />
            <ChartsAxisHighlight {...axisHighlightProps} />
            <ChartsBrushOverlay />
            {children}
          </ChartsSvgLayer>
        </ChartsLayerContainer>
        {!props.loading && <Tooltip trigger="item" {...props.slotProps?.tooltip} />}
      </ChartsWrapper>
    </ChartsDataProviderPremium>
  );
});

export { ScatterChartPremium };
