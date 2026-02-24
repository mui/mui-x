'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsOverlay, type ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import type { MakeOptional } from '@mui/x-internals/types';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { useChartContainerProProps } from '../ChartContainerPro/useChartContainerProProps';
import { SankeyPlot, type SankeyPlotProps } from './SankeyPlot';
import { useSankeyChartProps } from './useSankeyChartProps';
import type { SankeySeriesType } from './sankey.types';
import { SankeyTooltip } from './SankeyTooltip';
import type { SankeyChartSlotExtension } from './sankeySlots.types';
import { FocusedSankeyNode } from './FocusedSankeyNode';
import { FocusedSankeyLink } from './FocusedSankeyLink';
import { SankeyDataProvider } from './SankeyDataProvider';
import type { ChartContainerProProps } from '../ChartContainerPro';
import type { SankeyChartPluginSignatures } from './SankeyChart.plugins';

export type SankeySeries = MakeOptional<SankeySeriesType, 'type'>;

export interface SankeyChartProps
  extends
    Omit<
      ChartContainerProProps<'sankey', SankeyChartPluginSignatures>,
      'plugins' | 'series' | 'slotProps' | 'slots' | 'dataset' | 'hideLegend' | 'skipAnimation'
    >,
    Omit<SankeyPlotProps, 'data'>,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'>,
    SankeyChartSlotExtension {
  /**
   * The series to display in the Sankey chart.
   * A single object is expected.
   */
  series: SankeySeries;
}

/**
 * Sankey Chart component
 *
 * Displays a Sankey diagram, visualizing flows between nodes where the width
 * of the links is proportional to the flow quantity.
 *
 * Demos:
 *
 * - [Sankey Chart](https://mui.com/x/react-charts/sankey/)
 *
 * API:
 *
 * - [SankeyChart API](https://mui.com/x/api/charts/sankey-chart/)
 */
const SankeyChart = React.forwardRef(function SankeyChart(
  props: SankeyChartProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const themedProps = useThemeProps({ props, name: 'MuiSankeyChart' });

  const { chartContainerProps, sankeyPlotProps, overlayProps, chartsWrapperProps, children } =
    useSankeyChartProps(themedProps);
  const {
    chartDataProviderProProps: { series, ...chartDataProviderProProps },
    chartsSurfaceProps,
  } = useChartContainerProProps<'sankey', SankeyChartPluginSignatures>(chartContainerProps);

  const Tooltip = themedProps.slots?.tooltip ?? SankeyTooltip;

  return (
    <SankeyDataProvider series={series as SankeySeriesType[]} {...chartDataProviderProProps}>
      <ChartsWrapper {...chartsWrapperProps} ref={ref}>
        <ChartsSurface {...chartsSurfaceProps}>
          <SankeyPlot {...sankeyPlotProps} />
          <ChartsOverlay {...overlayProps} />
          <FocusedSankeyNode />
          <FocusedSankeyLink />
          {children}
        </ChartsSurface>
        {!themedProps.loading && <Tooltip trigger="item" {...themedProps.slotProps?.tooltip} />}
      </ChartsWrapper>
    </SankeyDataProvider>
  );
});

SankeyChart.propTypes = {
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
  desc: PropTypes.string,
  enableKeyboardNavigation: PropTypes.bool,
  /**
   * Options to enable features planned for the next major.
   */
  experimentalFeatures: PropTypes.shape({
    preferStrictDomainInLineCharts: PropTypes.bool,
  }),
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
      subType: PropTypes.oneOf([
        /**
         * Subtype to differentiate between node and link
         */
        'node',
      ]).isRequired,
      type: PropTypes.oneOf(['sankey']).isRequired,
    }),
    PropTypes.shape({
      seriesId: PropTypes.string.isRequired,
      sourceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      subType: PropTypes.oneOf([
        /**
         * Subtype to differentiate between node and link
         */
        'link',
      ]).isRequired,
      targetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      type: PropTypes.oneOf(['sankey']).isRequired,
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
   * @param {SankeyHighlightItemData | null} highlightedItem The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  /**
   * Callback fired when a sankey item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {SankeyLinkIdentifierWithData} link The sankey link identifier.
   */
  onLinkClick: PropTypes.func,
  /**
   * Callback fired when a sankey item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {SankeyNodeIdentifierWithData} node The sankey node identifier.
   */
  onNodeClick: PropTypes.func,
  /**
   * The callback fired when the tooltip item changes.
   *
   * @param {SeriesItemIdentifier<TSeries> | null} tooltipItem  The newly highlighted item.
   */
  onTooltipItemChange: PropTypes.func,
  /**
   * The series to display in the Sankey chart.
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
  title: PropTypes.string,
  /**
   * The tooltip item.
   * Used when the tooltip is controlled.
   */
  tooltipItem: PropTypes.shape({
    seriesId: PropTypes.string.isRequired,
    subType: PropTypes.oneOf(['link', 'node']).isRequired,
    type: PropTypes.oneOf(['sankey']),
  }),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
} as any;

export { SankeyChart };
