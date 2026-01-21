'use client';
import type { RadarChartProps } from './RadarChart';
import { type ChartsOverlayProps } from '../ChartsOverlay';
import { type ChartsLegendSlotExtension } from '../ChartsLegend';
import type { ChartsWrapperProps } from '../ChartsWrapper';
import { type RadarDataProviderProps } from './RadarDataProvider/RadarDataProvider';
import { type ChartsSurfaceProps } from '../ChartsSurface';
import { type RadarGridProps } from './RadarGrid';
import { RADAR_PLUGINS, type RadarChartPluginSignatures } from './RadarChart.plugins';
import { type RadarSeriesAreaProps, type RadarSeriesMarksProps } from './RadarSeriesPlot';

/**
 * A helper function that extracts RadarChartProps from the input props
 * and returns an object with props for the children components of RadarChart.
 *
 * @param props The input props for RadarChart
 * @returns An object with props for the children components of RadarChart
 */
export const useRadarChartProps = (props: RadarChartProps) => {
  const {
    apiRef,
    series,
    radar,
    width,
    height,
    margin,
    colors,
    sx,
    children,
    slots,
    slotProps,
    skipAnimation,
    loading,
    highlightedItem,
    onHighlightChange,
    hideLegend,
    divisions,
    shape,
    stripeColor,
    highlight = 'axis',
    showToolbar,
    onAxisClick,
    onAreaClick,
    onMarkClick,
    enableKeyboardNavigation,
    ...other
  } = props;

  const radarDataProviderProps: RadarDataProviderProps<RadarChartPluginSignatures> = {
    apiRef,
    series,
    radar,
    highlight,
    width,
    height,
    margin,
    colors,
    highlightedItem,
    onHighlightChange,
    skipAnimation,
    onAxisClick,
    enableKeyboardNavigation,
    plugins: RADAR_PLUGINS,
  };

  const overlayProps: ChartsOverlayProps = {
    slots,
    slotProps,
    loading,
  };

  const legendProps: ChartsLegendSlotExtension = {
    slots,
    slotProps,
  };

  const chartsWrapperProps: Omit<ChartsWrapperProps, 'children'> = {
    sx,
    hideLegend: props.hideLegend ?? false,
  };

  const radarGrid: RadarGridProps = { divisions, shape, stripeColor };

  const radarSeriesAreaProps: RadarSeriesAreaProps = { onItemClick: onAreaClick };
  const radarSeriesMarksProps: RadarSeriesMarksProps = { onItemClick: onMarkClick };
  const chartsSurfaceProps: ChartsSurfaceProps = other;

  return {
    highlight,
    chartsWrapperProps,
    chartsSurfaceProps,
    radarDataProviderProps,
    radarGrid,
    radarSeriesAreaProps,
    radarSeriesMarksProps,
    overlayProps,
    legendProps,
    children,
  };
};
