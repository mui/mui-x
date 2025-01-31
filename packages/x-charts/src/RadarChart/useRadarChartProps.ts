'use client';
import type { RadarChartProps } from './RadarChart';
import { ChartsOverlayProps } from '../ChartsOverlay';
import { ChartsLegendSlotExtension } from '../ChartsLegend';
import type { ChartsWrapperProps } from '../internals/components/ChartsWrapper';
import { RadarDataProviderProps } from './RadarDataProvider/RadarDataProvider';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { RadarGridProps } from './RadarGrid/RadarGrid';

/**
 * A helper function that extracts RadarChartProps from the input props
 * and returns an object with props for the children components of RadarChart.
 *
 * @param props The input props for RadarChart
 * @returns An object with props for the children components of RadarChart
 */
export const useRadarChartProps = (props: RadarChartProps) => {
  const {
    series,
    radar,
    width,
    height,
    margin,
    colors,
    dataset,
    sx,
    children,
    slots,
    slotProps,
    skipAnimation,
    loading,
    highlightedItem,
    onHighlightChange,
    hideLegend,
    divisionNumber,
    ...other
  } = props;

  const radarDataProviderProps: RadarDataProviderProps = {
    series,
    radar,
    width,
    height,
    margin,
    colors,
    dataset,
    highlightedItem,
    onHighlightChange,
    skipAnimation,
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
    // legendPosition: props.slotProps?.legend?.position,
    // legendDirection: props.slotProps?.legend?.direction,
  };

  const radarGrid: RadarGridProps = { divisionNumber };

  const chartsSurfaceProps: ChartsSurfaceProps = other;

  return {
    chartsWrapperProps,
    chartsSurfaceProps,
    radarDataProviderProps,
    radarGrid,
    overlayProps,
    legendProps,
    children,
  };
};
