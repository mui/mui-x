'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsOverlay } from '@mui/x-charts/ChartsOverlay';
import type { ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import type { MakeOptional } from '@mui/x-internals/types';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { useChartsContainerPremiumProps } from '../ChartsContainerPremium/useChartsContainerPremiumProps';
import { TreemapPlot } from './TreemapPlot';
import { useTreemapProps } from './useTreemapProps';
import type { TreemapSeriesType, TreemapItemIdentifierWithData } from './treemap.types';
import type { TreemapClasses } from './treemapClasses';
import type { TreemapSlotExtension } from './treemapSlots.types';
import { FocusedTreemapRect } from './FocusedTreemapRect';
import { TreemapDataProvider } from './TreemapDataProvider';
import type { ChartsContainerPremiumProps } from '../ChartsContainerPremium';
import type { TreemapChartPluginSignatures } from './Treemap.plugins';

export type TreemapSeries = MakeOptional<TreemapSeriesType, 'type'>;

export interface TreemapProps
  extends
    Omit<
      ChartsContainerPremiumProps<'treemap', TreemapChartPluginSignatures>,
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
    chartsDataProviderPremiumProps: { series, ...chartsDataProviderPremiumProps },
    chartsSurfaceProps,
  } = useChartsContainerPremiumProps<'treemap', TreemapChartPluginSignatures>(chartsContainerProps);

  const Tooltip = themedProps.slots?.tooltip ?? ChartsTooltip;

  return (
    <TreemapDataProvider series={series as TreemapSeriesType[]} {...chartsDataProviderPremiumProps}>
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
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      exportAsImage: PropTypes.func.isRequired,
      exportAsPrint: PropTypes.func.isRequired,
    }),
  }),
  /**
   * Classes applied to the various elements.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   * @default rainbowSurgePalette
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  /**
   * The description of the chart.
   * Used to provide an accessible description for the chart.
   */
  desc: PropTypes.string,
  /**
   * If `true`, disables keyboard navigation for the chart.
   */
  disableKeyboardNavigation: PropTypes.bool,
  /**
   * Options to enable features planned for the next major.
   */
  experimentalFeatures: PropTypes.object,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * The highlighted item.
   * Used when the highlight is controlled.
   */
  highlightedItem: PropTypes.oneOfType([
    PropTypes.shape({
      nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      seriesId: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['treemap']).isRequired,
    }),
  ]),
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
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
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   *
   * Accepts a `number` to be used on all sides or an object with the optional properties: `top`, `bottom`, `left`, and `right`.
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
   *
   * @param {HighlightItemIdentifierWithType<SeriesType> | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  /**
   * Callback fired when a treemap tile is clicked.
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event The event source of the callback.
   * @param {TreemapItemIdentifierWithData} item The treemap item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * The callback fired when the tooltip item changes.
   *
   * @param {SeriesItemIdentifier<SeriesType> | null} tooltipItem  The newly highlighted item.
   */
  onTooltipItemChange: PropTypes.func,
  /**
   * The series to display in the treemap.
   * A single object is expected.
   */
  series: PropTypes.object.isRequired,
  /**
   * The configuration for the series types.
   * This is used to define how each series type should be processed, colored, and displayed.
   */
  seriesConfig: PropTypes.object,
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
   * Used to provide an accessible label for the chart.
   */
  title: PropTypes.string,
  /**
   * The tooltip item.
   * Used when the tooltip is controlled.
   */
  tooltipItem: PropTypes.oneOfType([
    PropTypes.shape({
      nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      seriesId: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['treemap']).isRequired,
    }),
  ]),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
} as any;

export { Treemap };
