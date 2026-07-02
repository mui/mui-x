'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsOverlay } from '@mui/x-charts/ChartsOverlay';
import type { ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import type { MakeOptional } from '@mui/x-internals/types';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { useChartsContainerProProps } from '../ChartsContainerPro/useChartsContainerProProps';
import { TreemapPlot } from './TreemapPlot';
import { useTreemapProps } from './useTreemapProps';
import type { TreemapSeriesType, TreemapItemIdentifierWithData } from './treemap.types';
import type { TreemapClasses } from './treemapClasses';
import { TreemapTooltip } from './TreemapTooltip';
import type { TreemapSlotExtension } from './treemapSlots.types';
import { FocusedTreemapRect } from './FocusedTreemapRect';
import { TreemapDataProvider } from './TreemapDataProvider';
import type { ChartsContainerProProps } from '../ChartsContainerPro';
import type { TreemapChartPluginSignatures } from './Treemap.plugins';

export type TreemapSeries = MakeOptional<TreemapSeriesType, 'type'>;

export interface TreemapProps
  extends
    Omit<
      ChartsContainerProProps<'treemap', TreemapChartPluginSignatures>,
      | 'plugins'
      | 'series'
      | 'slotProps'
      | 'slots'
      | 'dataset'
      | 'hideLegend'
      | 'skipAnimation'
      | 'onItemClick'
    >,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'>,
    TreemapSlotExtension {
  /**
   * The series to display in the treemap.
   * A single object is expected.
   */
  series: TreemapSeries;
  /**
   * Classes applied to the various elements.
   */
  classes?: Partial<TreemapClasses>;
  /**
   * Callback fired when a treemap tile is clicked.
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event The event source of the callback.
   * @param {TreemapItemIdentifierWithData} item The treemap item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: TreemapItemIdentifierWithData,
  ) => void;
}

/**
 * Treemap Chart component.
 *
 * Displays hierarchical data as a set of nested rectangles whose area is
 * proportional to each node's value.
 *
 * Demos:
 *
 * - [Treemap](https://mui.com/x/react-charts/treemap/)
 *
 * API:
 *
 * - [Treemap API](https://mui.com/x/api/charts/treemap/)
 */
const Treemap = React.forwardRef(function Treemap(
  props: TreemapProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const themedProps = useThemeProps({ props, name: 'MuiTreemap' });

  const { chartsContainerProps, overlayProps, chartsWrapperProps, children } =
    useTreemapProps(themedProps);
  const {
    chartsDataProviderProProps: { series, ...chartsDataProviderProProps },
    chartsSurfaceProps,
  } = useChartsContainerProProps<'treemap', TreemapChartPluginSignatures>(chartsContainerProps);

  const Tooltip = themedProps.slots?.tooltip ?? TreemapTooltip;

  return (
    <TreemapDataProvider series={series as TreemapSeriesType[]} {...chartsDataProviderProProps}>
      <ChartsWrapper {...chartsWrapperProps} ref={ref}>
        <ChartsSurface {...chartsSurfaceProps}>
          <TreemapPlot classes={themedProps.classes} />
          <ChartsOverlay {...overlayProps} />
          <FocusedTreemapRect />
          {children}
        </ChartsSurface>
        {!themedProps.loading && <Tooltip trigger="item" {...themedProps.slotProps?.tooltip} />}
      </ChartsWrapper>
    </TreemapDataProvider>
  );
});

Treemap.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Classes applied to the various elements.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  /**
   * The description of the chart.
   */
  desc: PropTypes.string,
  /**
   * If `true`, disables keyboard navigation for the chart.
   */
  disableKeyboardNavigation: PropTypes.bool,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * The highlighted item.
   * Used when the highlight is controlled.
   */
  highlightedItem: PropTypes.shape({
    nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    seriesId: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['treemap']),
  }),
  /**
   * This prop is used to help implement the accessibility logic.
   */
  id: PropTypes.string,
  /**
   * If `true`, a loading overlay is displayed.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Localized text for chart components.
   */
  localeText: PropTypes.object,
  /**
   * The margin between the SVG and the drawing area.
   */
  margin: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number,
    }),
  ]),
  /**
   * The callback fired when the highlighted item changes.
   */
  onHighlightChange: PropTypes.func,
  /**
   * Callback fired when a treemap tile is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {TreemapItemIdentifierWithData} item The treemap item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * The series to display in the treemap.
   * A single object is expected.
   */
  series: PropTypes.object.isRequired,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  theme: PropTypes.oneOf(['dark', 'light']),
  /**
   * The title of the chart.
   */
  title: PropTypes.string,
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
} as any;

export { Treemap };
