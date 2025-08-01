import { DEFAULT_MARGINS } from '@mui/x-charts/constants';
import { defaultizeMargin, type ChartsWrapperProps } from '@mui/x-charts/internals';
import { strawberrySkyPalette } from '@mui/x-charts/colorPalettes';
import type { ChartsLegendSlotExtension } from '@mui/x-charts/ChartsLegend';
import type { ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import type { SankeyChartProps } from './SankeyChart';
import type { ChartContainerProProps } from '../ChartContainerPro';
import { SANKEY_CHART_PLUGINS, type SankeyChartPluginsSignatures } from './SankeyChart.plugins';

/**
 * A helper function that extracts SankeyChartProps from the input props
 * and returns an object with props for the children components of SankeyChart.
 *
 * @param props The input props for SankeyChart
 * @returns An object with props for the children components of SankeyChart
 */
export const useSankeyChartProps = (props: SankeyChartProps) => {
  const {
    series,
    width,
    height,
    margin: marginProps,
    colors,
    sx,
    children,
    slots,
    slotProps,
    skipAnimation,
    loading,
    highlightedItem,
    onHighlightChange,
    className,
    hideLegend,
    apiRef,
    onItemClick,
    ...rest
  } = props;

  const margin = defaultizeMargin(marginProps, DEFAULT_MARGINS);

  const isHorizontal = series.layout === 'horizontal';

  const chartContainerProps: ChartContainerProProps<'sankey', SankeyChartPluginsSignatures> = {
    ...rest,
    series: [
      {
        type: 'sankey' as const,
        layout: isHorizontal ? 'horizontal' : 'vertical',
        ...series,
      },
    ],
    width,
    height,
    margin,
    colors: colors ?? strawberrySkyPalette,
    sx,
    highlightedItem,
    onHighlightChange,
    className,
    apiRef,
    plugins: SANKEY_CHART_PLUGINS,
  };

  const sankeyPlotProps = {
    onItemClick,
  };

  const overlayProps: ChartsOverlayProps = {
    // slots,
    // slotProps,
    loading,
  };

  const legendProps: ChartsLegendSlotExtension = {
    // slots,
    // slotProps,
  };

  const chartsWrapperProps: Omit<ChartsWrapperProps, 'children'> = {
    sx,
    // legendPosition: props.slotProps?.legend?.position,
    // legendDirection: props.slotProps?.legend?.direction,
  };

  return {
    chartContainerProps,
    sankeyPlotProps,
    overlayProps,
    legendProps,
    chartsWrapperProps,
    children,
  };
};
