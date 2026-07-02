'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { ChartsContainerProProps } from '../ChartsContainerPro';
import type { TreemapSeriesType } from './treemap.types';
import { TREEMAP_CHART_PLUGINS } from './Treemap.plugins';
import type { TreemapChartPluginSignatures } from './Treemap.plugins';
import { ChartsDataProviderPro } from '../ChartsDataProviderPro';
import { treemapSeriesConfig } from './seriesConfig';

const seriesConfig = { treemap: treemapSeriesConfig };

export interface TreemapDataProviderProps extends Omit<
  ChartsContainerProProps<'treemap', TreemapChartPluginSignatures>,
  'plugins' | 'series' | 'slotProps' | 'slots' | 'dataset' | 'hideLegend' | 'skipAnimation'
> {
  children?: React.ReactNode;
  series: readonly TreemapSeriesType[];
}

/**
 * Orchestrates the data providers for the treemap chart components and hooks.
 *
 * Use this component if you have custom HTML components that need to access the chart data.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 */
function TreemapDataProvider(props: TreemapDataProviderProps) {
  return (
    <ChartsDataProviderPro<'treemap', TreemapChartPluginSignatures>
      {...props}
      seriesConfig={seriesConfig}
      plugins={TREEMAP_CHART_PLUGINS}
    />
  );
}

TreemapDataProvider.propTypes /* remove-proptypes */ = {
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
  children: PropTypes.node,
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
   * The callback fired when an item is clicked.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event The click event.
   * @param {SeriesItemIdentifierWithType<SeriesType>} item The clicked item.
   */
  onItemClick: PropTypes.func,
  /**
   * The callback fired when the tooltip item changes.
   *
   * @param {SeriesItemIdentifier<SeriesType> | null} tooltipItem  The newly highlighted item.
   */
  onTooltipItemChange: PropTypes.func,
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * The configuration for the series types.
   * This is used to define how each series type should be processed, colored, and displayed.
   */
  seriesConfig: PropTypes.object,
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

export { TreemapDataProvider };
