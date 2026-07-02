import { DEFAULT_MARGINS } from '@mui/x-charts/constants';
import { defaultizeMargin } from '@mui/x-charts/internals';
import type { ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import type { ChartsWrapperProps } from '@mui/x-charts/ChartsWrapper';
import type { TreemapProps } from './Treemap';
import type { ChartsContainerProProps } from '../ChartsContainerPro';
import { TREEMAP_CHART_PLUGINS } from './Treemap.plugins';
import type { TreemapChartPluginSignatures } from './Treemap.plugins';
import { DEFAULT_TILE_PADDING } from './utils';

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

  const defaultTiling = {
    paddingInner: DEFAULT_TILE_PADDING,
    paddingOuter: DEFAULT_TILE_PADDING,
  };

  const chartsContainerProps: ChartsContainerProProps<'treemap', TreemapChartPluginSignatures> = {
    ...other,
    series: [
      {
        type: 'treemap' as const,
        ...series,
        tiling: { ...defaultTiling, ...series.tiling },
      },
    ],
    width,
    height,
    margin,
    colors,
    sx,
    highlightedItem,
    onHighlightChange,
    // The central item-click plugin types the item as the bare identifier, but at runtime
    // `getItemAtPosition` returns the identifier with its layout node, matching `onItemClick`.
    onItemClick: onItemClick as ChartsContainerProProps<
      'treemap',
      TreemapChartPluginSignatures
    >['onItemClick'],
    apiRef,
    plugins: TREEMAP_CHART_PLUGINS,
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
    overlayProps,
    chartsWrapperProps,
    children,
  };
};
