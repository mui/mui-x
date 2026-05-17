'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { ChartsBrushOverlay } from '@mui/x-charts/ChartsBrushOverlay';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import {
  FocusedHeatmapCell,
  HeatmapTooltip,
  type HeatmapProps,
  type HeatmapSlots,
  type HeatmapSlotProps,
} from '@mui/x-charts-pro/Heatmap';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsToolbarPro } from '@mui/x-charts-pro/ChartsToolbarPro';
import { ChartsOverlay } from '@mui/x-charts/ChartsOverlay';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts/ChartsSvgLayer';
import { ChartsWebGLLayer } from '../ChartsWebGLLayer';
import { useHeatmapPremiumProps } from './useHeatmapPremiumProps';
import { ChartsDataProviderPremium } from '../ChartsDataProviderPremium';
import { type HeatmapPremiumPluginSignatures } from './HeatmapPremium.plugins';
import { HeatmapPlotPremium } from './HeatmapPlotPremium';

export interface HeatmapPremiumSlots extends HeatmapSlots {}
export interface HeatmapPremiumSlotProps extends HeatmapSlotProps {}

export interface HeatmapPremiumProps extends HeatmapProps {
  /**
   * The type of renderer to use for the heatmap plot.
   * - `svg-single`: Renders every scatter item in a `<rect />` element.
   * - `webgl`: Renders heatmap cells using WebGL for better performance, at the cost of some limitations.
   *                Read more: https://mui.com/x/react-charts/heatmap/#performance
   */
  renderer?: 'svg-single' | 'webgl';
}

const HeatmapPremium = React.forwardRef(function HeatmapPremium(
  inProps: HeatmapPremiumProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiHeatmapPremium' });
  const { sx, slots, slotProps, loading, hideLegend, showToolbar = false } = props;

  const {
    chartsDataProviderPremiumProps,
    chartsWrapperProps,
    chartsAxisProps,
    clipPathProps,
    clipPathGroupProps,
    legendProps,
    heatmapPlotPremiumProps,
    overlayProps,
    children,
  } = useHeatmapPremiumProps(props);

  const Tooltip = slots?.tooltip ?? HeatmapTooltip;
  const Toolbar = slots?.toolbar ?? ChartsToolbarPro;
  const renderer = heatmapPlotPremiumProps.renderer;

  return (
    <ChartsDataProviderPremium<'heatmap', HeatmapPremiumPluginSignatures>
      {...chartsDataProviderPremiumProps}
    >
      <ChartsWrapper {...chartsWrapperProps} ref={ref}>
        {showToolbar ? <Toolbar {...props.slotProps?.toolbar} /> : null}
        {!hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsLayerContainer>
          {renderer === 'webgl' && (
            <ChartsWebGLLayer>
              <HeatmapPlotPremium {...heatmapPlotPremiumProps} />
            </ChartsWebGLLayer>
          )}
          <ChartsSvgLayer sx={sx}>
            <g {...clipPathGroupProps}>
              {renderer !== 'webgl' && <HeatmapPlotPremium {...heatmapPlotPremiumProps} />}
              <FocusedHeatmapCell />
              <ChartsOverlay {...overlayProps} />
            </g>
            <ChartsAxis {...chartsAxisProps} />
            <ChartsClipPath {...clipPathProps} />
            <ChartsBrushOverlay />
            {children}
          </ChartsSvgLayer>
        </ChartsLayerContainer>
        {!loading && <Tooltip {...slotProps?.tooltip} />}
      </ChartsWrapper>
    </ChartsDataProviderPremium>
  );
});

HeatmapPremium.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      exportAsImage: PropTypes.func.isRequired,
      exportAsPrint: PropTypes.func.isRequired,
      setAxisZoomData: PropTypes.func.isRequired,
      setZoomData: PropTypes.func.isRequired,
    }),
  }),
  /**
   * The border radius of the heatmap cells in pixels.
   */
  borderRadius: PropTypes.number,
  /**
   * Configuration for the brush interaction.
   */
  brushConfig: PropTypes.shape({
    enabled: PropTypes.bool,
    preventHighlight: PropTypes.bool,
    preventTooltip: PropTypes.bool,
  }),
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   * @default rainbowSurgePalette
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset: PropTypes.arrayOf(PropTypes.object),
  /**
   * The description of the chart.
   * Used to provide an accessible description for the chart.
   */
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
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
   * If `true`, the legend is not rendered.
   */
  hideLegend: PropTypes.bool,
  /**
   * The highlighted item.
   * Used when the highlight is controlled.
   */
  highlightedItem: PropTypes.oneOfType([
    PropTypes.shape({
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['heatmap']).isRequired,
      xIndex: PropTypes.number.isRequired,
      yIndex: PropTypes.number.isRequired,
    }),
    PropTypes.shape({
      seriesId: PropTypes.string.isRequired,
      xIndex: PropTypes.number.isRequired,
      yIndex: PropTypes.number.isRequired,
    }),
  ]),
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.string,
  /**
   * The list of zoom data related to each axis.
   * Used to initialize the zoom in a specific configuration without controlling it.
   */
  initialZoom: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      end: PropTypes.number.isRequired,
      start: PropTypes.number.isRequired,
    }),
  ),
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
   * The callback fired when an item is clicked.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event The click event.
   * @param {SeriesItemIdentifierWithType<SeriesType>} item The clicked item.
   */
  onItemClick: PropTypes.func,
  /**
   * The function called when the pointer position corresponds to a new axis data item.
   * This update can either be caused by a pointer movement, or an axis update.
   * In case of multiple axes, the function is called if at least one axis is updated.
   * The argument contains the identifier for all axes with a `data` property.
   * @param {AxisItemIdentifier[]} axisItems The array of axes item identifiers.
   */
  onTooltipAxisChange: PropTypes.func,
  /**
   * The callback fired when the tooltip item changes.
   *
   * @param {SeriesItemIdentifier<SeriesType> | null} tooltipItem  The newly highlighted item.
   */
  onTooltipItemChange: PropTypes.func,
  /**
   * Callback fired when the zoom has changed.
   *
   * @param {ZoomData[]} zoomData Updated zoom data.
   */
  onZoomChange: PropTypes.func,
  /**
   * The type of renderer to use for the heatmap plot.
   * - `svg-single`: Renders every scatter item in a `<rect />` element.
   * - `webgl`: Renders heatmap cells using WebGL for better performance, at the cost of some limitations.
   *                Read more: https://mui.com/x/react-charts/heatmap/#performance
   */
  renderer: PropTypes.oneOf(['svg-single', 'webgl']),
  /**
   * The series to display in the bar chart.
   * An array of [[HeatmapSeries]] objects.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * If true, shows the default chart toolbar.
   * @default false
   */
  showToolbar: PropTypes.bool,
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
   * The configuration of the tooltip.
   * @see See {@link https://mui.com/x/react-charts/tooltip/ tooltip docs} for more details.
   */
  tooltip: PropTypes.object,
  /**
   * The controlled axis tooltip.
   * Identified by the axis id, and data index.
   */
  tooltipAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      dataIndex: PropTypes.number.isRequired,
    }),
  ),
  /**
   * The tooltip item.
   * Used when the tooltip is controlled.
   */
  tooltipItem: PropTypes.oneOfType([
    PropTypes.shape({
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['heatmap']).isRequired,
      xIndex: PropTypes.number.isRequired,
      yIndex: PropTypes.number.isRequired,
    }),
    PropTypes.shape({
      seriesId: PropTypes.string.isRequired,
      xIndex: PropTypes.number.isRequired,
      yIndex: PropTypes.number.isRequired,
    }),
  ]),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * The configuration of the z-axes.
   */
  zAxis: PropTypes.arrayOf(
    PropTypes.shape({
      colorMap: PropTypes.oneOfType([
        PropTypes.shape({
          colors: PropTypes.arrayOf(PropTypes.string).isRequired,
          type: PropTypes.oneOf(['ordinal']).isRequired,
          unknownColor: PropTypes.string,
          values: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
              .isRequired,
          ),
        }),
        PropTypes.shape({
          color: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string.isRequired),
            PropTypes.func,
          ]).isRequired,
          max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
          min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
          type: PropTypes.oneOf(['continuous']).isRequired,
        }),
        PropTypes.shape({
          colors: PropTypes.arrayOf(PropTypes.string).isRequired,
          thresholds: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
          ).isRequired,
          type: PropTypes.oneOf(['piecewise']).isRequired,
        }),
      ]),
      data: PropTypes.array,
      dataKey: PropTypes.string,
      id: PropTypes.string,
      max: PropTypes.number,
      min: PropTypes.number,
      valueGetter: PropTypes.func,
    }),
  ),
  /**
   * The list of zoom data related to each axis.
   */
  zoomData: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      end: PropTypes.number.isRequired,
      start: PropTypes.number.isRequired,
    }),
  ),
  /**
   * Configuration for zoom interactions.
   */
  zoomInteractionConfig: PropTypes.shape({
    pan: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.oneOf(['drag', 'pressAndDrag', 'wheel']),
        PropTypes.shape({
          pointerMode: PropTypes.oneOf(['mouse', 'touch']),
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['drag']).isRequired,
        }),
        PropTypes.shape({
          pointerMode: PropTypes.oneOf(['mouse', 'touch']),
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['pressAndDrag']).isRequired,
        }),
        PropTypes.shape({
          allowedDirection: PropTypes.oneOf(['x', 'xy', 'y']),
          pointerMode: PropTypes.any,
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['wheel']).isRequired,
        }),
      ]).isRequired,
    ),
    zoom: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.oneOf(['brush', 'doubleTapReset', 'pinch', 'tapAndDrag', 'wheel']),
        PropTypes.shape({
          pointerMode: PropTypes.any,
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['wheel']).isRequired,
        }),
        PropTypes.shape({
          pointerMode: PropTypes.any,
          requiredKeys: PropTypes.array,
          type: PropTypes.oneOf(['pinch']).isRequired,
        }),
        PropTypes.shape({
          pointerMode: PropTypes.oneOf(['mouse', 'touch']),
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['tapAndDrag']).isRequired,
        }),
        PropTypes.shape({
          pointerMode: PropTypes.oneOf(['mouse', 'touch']),
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['doubleTapReset']).isRequired,
        }),
        PropTypes.shape({
          pointerMode: PropTypes.oneOf(['mouse', 'touch']),
          requiredKeys: PropTypes.arrayOf(PropTypes.string),
          type: PropTypes.oneOf(['brush']).isRequired,
        }),
      ]).isRequired,
    ),
  }),
} as any;

export { HeatmapPremium };
