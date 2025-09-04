'use client';
import type { RadarChartProps } from './RadarChart';
import { ChartsOverlayProps } from '../ChartsOverlay';
import { ChartsLegendSlotExtension } from '../ChartsLegend';
import type { ChartsWrapperProps } from '../ChartsWrapper';
import { RadarDataProviderProps } from './RadarDataProvider/RadarDataProvider';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { RadarGridProps } from './RadarGrid';
import { RadarChartPluginsSignatures } from './RadarChart.plugins';
import { RadarSeriesAreaProps, RadarSeriesMarksProps } from './RadarSeriesPlot';

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
    ...other
  } = props;

  const radarDataProviderProps: RadarDataProviderProps<RadarChartPluginsSignatures> = {
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
