import { useTheme } from '@mui/material/styles';
import { DEFAULT_MARGINS } from '@mui/x-charts/constants';
import { defaultizeMargin, getStringSize } from '@mui/x-charts/internals';
import type { ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import type { ChartsWrapperProps } from '@mui/x-charts/ChartsWrapper';
import type { TreemapProps } from './Treemap';
import type { TreemapSeriesData } from './treemap.types';
import type { ChartsContainerProProps } from '../ChartsContainerPro';
import { TREEMAP_CHART_PLUGINS } from './Treemap.plugins';
import type { TreemapChartPluginSignatures } from './Treemap.plugins';
import { TREEMAP_LABEL_PADDING, DEFAULT_TILE_PADDING } from './utils';

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

  const theme = useTheme();

  const margin = defaultizeMargin(marginProps, DEFAULT_MARGINS);

  // The default top padding reserves a header band for the labels of nested group
  // tiles. It is derived from the measured label height so it fits any font size.
  const topLevelNodes: readonly TreemapSeriesData[] = Array.isArray(series.data)
    ? series.data
    : ((series.data as TreemapSeriesData)?.children ?? []);
  const hasRenderedGroups = topLevelNodes.some((node) => (node.children?.length ?? 0) > 0);
  const labelsEnabled = series.nodeOptions?.showLabels !== false;

  const measuredLabelHeight = getStringSize('Ag', {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: theme.typography.fontFamily,
  }).height;
  const headerHeight = Math.ceil(measuredLabelHeight || 16) + 2 * TREEMAP_LABEL_PADDING;

  const defaultTiling = {
    paddingInner: DEFAULT_TILE_PADDING,
    paddingOuter: DEFAULT_TILE_PADDING,
    paddingTop: hasRenderedGroups && labelsEnabled ? headerHeight : 0,
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
