import type { RadarChartProps } from './RadarChart';
import { ResponsiveRadarChartContainerProps } from './ResponsiveRadarChartContainer';
import { ChartsOverlayProps } from '../ChartsOverlay';
import { ChartsLegendProps } from '../ChartsLegend';

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
    width,
    height,
    margin,
    colors,
    dataset,
    sx,
    children,
    slots,
    slotProps,
    loading,
    highlightedItem,
    onHighlightChange,
    className,
    radar,
    ...other
  } = props;

  const radarChartContainerProps: ResponsiveRadarChartContainerProps = {
    ...other,
    series: series.map((s) => ({
      type: 'radar' as const,
      ...s,
    })),
    width,
    height,
    margin: { left: 5, top: 50, right: 5, bottom: 5, ...margin },
    colors,
    sx,
    radar,
    className,
  };

  const overlayProps: ChartsOverlayProps = {
    slots,
    slotProps,
    loading,
  };

  const legendProps: ChartsLegendProps = {
    slots,
    slotProps,
  };

  return {
    radarChartContainerProps,
    overlayProps,
    legendProps,
    children,
  };
};
