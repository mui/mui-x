import { DEFAULT_MARGINS } from '@mui/x-charts/constants';
import { defaultizeMargin } from '@mui/x-charts/internals';
import type { ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import type { ChartsWrapperProps } from '@mui/x-charts/ChartsWrapper';
import type { SankeyChartProps } from './SankeyChart';
import type { ChartContainerProProps } from '../ChartContainerPro';
import { SANKEY_CHART_PLUGINS, type SankeyChartPluginSignatures } from './SankeyChart.plugins';

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
    loading,
    highlightedItem,
    onHighlightChange,
    className,
    apiRef,
    onNodeClick,
    onLinkClick,
    ...other
  } = props;

  const margin = defaultizeMargin(marginProps, DEFAULT_MARGINS);

  const chartContainerProps: ChartContainerProProps<'sankey', SankeyChartPluginSignatures> = {
    ...other,
    series: [
      {
        type: 'sankey' as const,
        ...series,
      },
    ],
    width,
    height,
    margin,
    colors,
    sx,
    highlightedItem,
    onHighlightChange,
    className,
    apiRef,
    plugins: SANKEY_CHART_PLUGINS,
  };

  const sankeyPlotProps = {
    onNodeClick,
    onLinkClick,
  };

  const overlayProps: ChartsOverlayProps = {
    slots,
    slotProps,
    loading,
  };

  const chartsWrapperProps: Omit<ChartsWrapperProps, 'children'> = {
    sx,
    hideLegend: false,
  };

  return {
    chartContainerProps,
    sankeyPlotProps,
    overlayProps,
    chartsWrapperProps,
    children,
  };
};
