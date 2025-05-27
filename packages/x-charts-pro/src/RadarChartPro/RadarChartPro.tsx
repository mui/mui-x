import * as React from 'react';
import PropTypes from 'prop-types';
import {
  RadarAxisHighlight,
  RadarChartProps,
  RadarDataProvider,
  RadarDataProviderProps,
  RadarGrid,
  RadarMetricLabels,
  RadarSeriesArea,
  RadarSeriesMarks,
} from '@mui/x-charts/RadarChart';
import { useThemeProps } from '@mui/material/styles';
import { useRadarChartProps, ChartsWrapper } from '@mui/x-charts/internals';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsOverlay } from '@mui/x-charts/ChartsOverlay';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { RADAR_CHART_PRO_PLUGINS, RadarChartProPluginsSignatures } from './RadarChartPro.plugins';
import { ChartsToolbarPro } from '../ChartsToolbarPro';

export interface RadarChartProProps
  extends Omit<RadarChartProps, 'apiRef'>,
    Omit<
      RadarDataProviderProps<RadarChartProPluginsSignatures>,
      'plugins' | 'seriesConfig' | 'slots' | 'slotProps'
    > {}

/**
 * Demos:
 *
 * - [Radar Chart](https://mui.com/x/react-charts/radar/)
 *
 * API:
 *
 * - [RadarChart API](https://mui.com/x/api/charts/radar-chart/)
 */
const RadarChartPro = React.forwardRef(function RadarChartPro(
  inProps: RadarChartProProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiRadarChartPro' });
  const {
    chartsWrapperProps,
    chartsSurfaceProps,
    radarDataProviderProps,
    radarGrid,
    overlayProps,
    legendProps,
    highlight,
    children,
  } = useRadarChartProps(props);

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;
  const Toolbar = props.slots?.toolbar ?? ChartsToolbarPro;

  const radarDataProviderProProps: RadarDataProviderProps<RadarChartProPluginsSignatures> = {
    ...radarDataProviderProps,
    apiRef:
      radarDataProviderProps.apiRef as RadarDataProviderProps<RadarChartProPluginsSignatures>['apiRef'],
    plugins: RADAR_CHART_PRO_PLUGINS,
  };

  return (
    <RadarDataProvider<RadarChartProPluginsSignatures> {...radarDataProviderProProps}>
      <ChartsWrapper {...chartsWrapperProps}>
        {props.showToolbar ? <Toolbar /> : null}
        {!props.hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsSurface {...chartsSurfaceProps} ref={ref}>
          <RadarGrid {...radarGrid} />
          <RadarMetricLabels />
          <RadarSeriesArea />
          {highlight === 'axis' && <RadarAxisHighlight />}
          <RadarSeriesMarks />
          <ChartsOverlay {...overlayProps} />
          {children}
        </ChartsSurface>
        {!props.loading && <Tooltip {...props.slotProps?.tooltip} />}
      </ChartsWrapper>
    </RadarDataProvider>
  );
});

RadarChartPro.propTypes = {
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
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   * @default rainbowSurgePalette
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
  /**
   * The number of divisions in the radar grid.
   * @default 5
   */
  divisions: PropTypes.number,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * If `true`, the legend is not rendered.
   */
  hideLegend: PropTypes.bool,
  /**
   * Indicates if the chart should highlight items per axis or per series.
   * @default 'axis'
   */
  highlight: PropTypes.oneOf(['axis', 'none', 'series']),
  /**
   * The highlighted item.
   * Used when the highlight is controlled.
   */
  highlightedItem: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }),
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
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  /**
   * The configuration of the radar scales.
   */
  radar: PropTypes.shape({
    labelFormatter: PropTypes.func,
    labelGap: PropTypes.number,
    max: PropTypes.number,
    metrics: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(
        PropTypes.shape({
          max: PropTypes.number,
          min: PropTypes.number,
          name: PropTypes.string.isRequired,
        }),
      ),
    ]).isRequired,
    startAngle: PropTypes.number,
  }).isRequired,
  /**
   * The series to display in the bar chart.
   * An array of [[RadarSeriesType]] objects.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * The grid shape.
   * @default 'sharp'
   */
  shape: PropTypes.oneOf(['circular', 'sharp']),
  /**
   * If true, shows the default chart toolbar.
   * @default false
   */
  showToolbar: PropTypes.bool,
  /**
   * If `true`, animations are skipped.
   * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
   */
  skipAnimation: PropTypes.bool,
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
  /**
   * Get stripe fill color. Set it to `null` to remove stripes
   * @param {number} index The index of the stripe band.
   * @returns {string} The color to fill the stripe.
   * @default (index) => index % 2 === 1 ? (theme.vars || theme).palette.text.secondary : 'none'
   */
  stripeColor: PropTypes.func,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  theme: PropTypes.oneOf(['dark', 'light']),
  title: PropTypes.string,
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
} as any;

export { RadarChartPro };
