import { DEFAULT_MARGINS } from '@mui/x-charts/constants';
import { defaultizeMargin } from '@mui/x-charts/internals';
import type { ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import type { ChartsWrapperProps } from '@mui/x-charts/ChartsWrapper';
import type { TreemapProps } from './Treemap';
import type { ChartsContainerProProps } from '../ChartsContainerPro';
import { TREEMAP_CHART_PLUGINS } from './Treemap.plugins';
import type { TreemapChartPluginSignatures } from './Treemap.plugins';

/**
 * Extracts the props for the child components of `Treemap` from its input props.
 */
export const useTreemapProps = (props: TreemapProps) => {
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
    onItemClick,
    ...other
  } = props;

  const margin = defaultizeMargin(marginProps, DEFAULT_MARGINS);

  const chartsContainerProps: ChartsContainerProProps<'treemap', TreemapChartPluginSignatures> = {
    ...other,
    series: [
      {
        type: 'treemap' as const,
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
    apiRef,
    plugins: TREEMAP_CHART_PLUGINS,
  };

  const treemapPlotProps = {
    onItemClick,
  };

  const overlayProps: ChartsOverlayProps = {
    slots,
    slotProps,
    loading,
  };

  const chartsWrapperProps: Omit<ChartsWrapperProps, 'children'> = {
    sx,
    hideLegend: true,
    className,
  };

  return {
    chartsContainerProps,
    treemapPlotProps,
    overlayProps,
    chartsWrapperProps,
    children,
  };
};
