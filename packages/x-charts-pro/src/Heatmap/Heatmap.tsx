'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { type MakeOptional } from '@mui/x-internals/types';
import { ChartsAxis, type ChartsAxisProps } from '@mui/x-charts/ChartsAxis';
import { type ChartsTooltipProps } from '@mui/x-charts/ChartsTooltip';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import {
  type ChartsAxisSlots,
  type ChartsAxisSlotProps,
  type XAxis,
  type YAxis,
} from '@mui/x-charts/internals';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import {
  ChartsOverlay,
  type ChartsOverlayProps,
  type ChartsOverlaySlotProps,
  type ChartsOverlaySlots,
} from '@mui/x-charts/ChartsOverlay';
import {
  ChartsLegend,
  type ChartsLegendSlotProps,
  type ChartsLegendSlots,
} from '@mui/x-charts/ChartsLegend';
import { ChartsBrushOverlay } from '@mui/x-charts/ChartsBrushOverlay';
import { type ChartsSlotPropsPro, type ChartsSlotsPro } from '../internals/material';
import { type ChartContainerProProps } from '../ChartContainerPro';
import { type HeatmapSeriesType } from '../models/seriesType/heatmap';
import { HeatmapPlot } from './HeatmapPlot';
import { HeatmapTooltip, type HeatmapTooltipProps } from './HeatmapTooltip';
import { type HeatmapItemSlotProps, type HeatmapItemSlots } from './HeatmapItem';
import { type HeatmapPluginSignatures } from './Heatmap.plugins';
import { ChartDataProviderPro } from '../ChartDataProviderPro';
import { ChartsToolbarPro } from '../ChartsToolbarPro';
import {
  type ChartsToolbarProSlotProps,
  type ChartsToolbarProSlots,
} from '../ChartsToolbarPro/Toolbar.types';
import { FocusedHeatmapCell } from './FocusedHeatmapCell';
import { useHeatmapProps } from './useHeatmapProps';

export interface HeatmapSlots
  extends
    ChartsAxisSlots,
    ChartsOverlaySlots,
    HeatmapItemSlots,
    ChartsToolbarProSlots,
    Partial<ChartsSlotsPro> {
  /**
   * Custom component for the tooltip.
   * @default ChartsTooltipRoot
   */
  tooltip?: React.ElementType<HeatmapTooltipProps>;
  /**
   * Custom component for the legend.
   * @default ContinuousColorLegendProps
   */
  legend?: ChartsLegendSlots['legend'];
}
export interface HeatmapSlotProps
  extends
    ChartsAxisSlotProps,
    ChartsOverlaySlotProps,
    HeatmapItemSlotProps,
    ChartsLegendSlotProps,
    ChartsToolbarProSlotProps,
    Partial<ChartsSlotPropsPro> {
  tooltip?: Partial<HeatmapTooltipProps>;
}

export type HeatmapSeries = MakeOptional<HeatmapSeriesType, 'type'>;

export interface HeatmapProps
  extends
    Omit<
      ChartContainerProProps<'heatmap', HeatmapPluginSignatures>,
      | 'series'
      | 'plugins'
      | 'xAxis'
      | 'yAxis'
      | 'axesGap'
      | 'skipAnimation'
      | 'slots'
      | 'slotProps'
      | 'experimentalFeatures'
      | 'highlightedAxis'
      | 'onHighlightedAxisChange'
      | 'seriesConfig'
      | 'onAxisClick'
    >,
    Omit<ChartsAxisProps, 'slots' | 'slotProps'>,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'> {
  /**
   * The function called for onClick events.
   * The second argument contains information about all line/bar elements at the current mouse position.
   * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
   * @param {null | ChartsAxisData} data The data about the clicked axis and items associated with it.
   *
   * @deprecated Use `onItemClick` instead to get access to both x- and y-axis values.
   */
  onAxisClick?: ChartContainerProProps<'heatmap', HeatmapPluginSignatures>['onAxisClick'];
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis: Readonly<MakeOptional<XAxis<'band'>, 'scaleType'>[]>;
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: Readonly<MakeOptional<YAxis<'band'>, 'scaleType'>[]>;
  /**
   * The series to display in the bar chart.
   * An array of [[HeatmapSeries]] objects.
   */
  series: Readonly<HeatmapSeries[]>;
  /**
   * The configuration of the tooltip.
   * @see See {@link https://mui.com/x/react-charts/tooltip/ tooltip docs} for more details.
   */
  tooltip?: ChartsTooltipProps;
  /**
   * If `true`, the legend is not rendered.
   */
  hideLegend?: boolean;
  /**
   * If true, shows the default chart toolbar.
   * @default false
   */
  showToolbar?: boolean;
  /**
   * The border radius of the heatmap cells in pixels.
   */
  borderRadius?: number;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: HeatmapSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: HeatmapSlotProps;
}

const Heatmap = React.forwardRef(function Heatmap(
  inProps: HeatmapProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiHeatmap' });
  const { sx, slots, slotProps, loading, hideLegend, showToolbar = false } = props;

  const {
    chartDataProviderProProps,
    chartsWrapperProps,
    chartsAxisProps,
    clipPathProps,
    clipPathGroupProps,
    legendProps,
    heatmapPlotProps,
    overlayProps,
    children,
  } = useHeatmapProps(props);

  const Tooltip = slots?.tooltip ?? HeatmapTooltip;
  const Toolbar = slots?.toolbar ?? ChartsToolbarPro;

  return (
    <ChartDataProviderPro<'heatmap', HeatmapPluginSignatures> {...chartDataProviderProProps}>
      <ChartsWrapper {...chartsWrapperProps}>
        {showToolbar ? <Toolbar {...props.slotProps?.toolbar} /> : null}
        {!hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsSurface ref={ref} sx={sx}>
          <g {...clipPathGroupProps}>
            <HeatmapPlot {...heatmapPlotProps} />
            <FocusedHeatmapCell />
            <ChartsOverlay {...overlayProps} />
          </g>
          <ChartsAxis {...chartsAxisProps} />
          <ChartsClipPath {...clipPathProps} />
          <ChartsBrushOverlay />
          {children}
        </ChartsSurface>
        {!loading && <Tooltip {...slotProps?.tooltip} />}
      </ChartsWrapper>
    </ChartDataProviderPro>
  );
});

Heatmap.propTypes = {
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
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
  enableKeyboardNavigation: PropTypes.bool,
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
  highlightedItem: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.string.isRequired,
  }),
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
   * The function called for onClick events.
   * The second argument contains information about all line/bar elements at the current mouse position.
   * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
   * @param {null | ChartsAxisData} data The data about the clicked axis and items associated with it.
   *
   * @deprecated Use `onItemClick` instead to get access to both x- and y-axis values.
   */
  onAxisClick: PropTypes.func,
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  /**
   * The callback fired when an item is clicked.
   *
   * @param {React.MouseEvent<SVGSVGElement, MouseEvent>} event The click event.
   * @param {SeriesItemIdentifier<SeriesType>} item The clicked item.
   */
  onItemClick: PropTypes.func,
  /**
   * The callback fired when the tooltip item changes.
   *
   * @param {SeriesItemIdentifier<TSeries> | null} tooltipItem  The newly highlighted item.
   */
  onTooltipItemChange: PropTypes.func,
  /**
   * Callback fired when the zoom has changed.
   *
   * @param {ZoomData[]} zoomData Updated zoom data.
   */
  onZoomChange: PropTypes.func,
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
  title: PropTypes.string,
  /**
   * The configuration of the tooltip.
   * @see See {@link https://mui.com/x/react-charts/tooltip/ tooltip docs} for more details.
   */
  tooltip: PropTypes.object,
  /**
   * The tooltip item.
   * Used when the tooltip is controlled.
   */
  tooltipItem: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['heatmap']).isRequired,
    xIndex: PropTypes.number,
    yIndex: PropTypes.number,
  }),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axis: PropTypes.oneOf(['x']),
      barGapRatio: PropTypes.number,
      categoryGapRatio: PropTypes.number,
      classes: PropTypes.object,
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
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      domainLimit: PropTypes.oneOfType([PropTypes.oneOf(['nice', 'strict']), PropTypes.func]),
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          getValue: PropTypes.func.isRequired,
          tickLabelStyle: PropTypes.object,
          tickSize: PropTypes.number,
        }),
      ),
      height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      offset: PropTypes.number,
      ordinalTimeTicks: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.oneOf(['biweekly', 'days', 'hours', 'months', 'quarterly', 'weeks', 'years']),
          PropTypes.shape({
            format: PropTypes.func.isRequired,
            getTickNumber: PropTypes.func.isRequired,
            isTick: PropTypes.func.isRequired,
          }),
        ]).isRequired,
      ),
      position: PropTypes.oneOf(['bottom', 'none', 'top']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['band']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      sx: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
        PropTypes.func,
        PropTypes.object,
      ]),
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelMinGap: PropTypes.number,
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
      zoom: PropTypes.oneOfType([
        PropTypes.shape({
          filterMode: PropTypes.oneOf(['discard', 'keep']),
          maxEnd: PropTypes.number,
          maxSpan: PropTypes.number,
          minSpan: PropTypes.number,
          minStart: PropTypes.number,
          panning: PropTypes.bool,
          slider: PropTypes.shape({
            enabled: PropTypes.bool,
            preview: PropTypes.bool,
            showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
            size: PropTypes.number,
          }),
          step: PropTypes.number,
        }),
        PropTypes.bool,
      ]),
    }),
  ).isRequired,
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axis: PropTypes.oneOf(['y']),
      barGapRatio: PropTypes.number,
      categoryGapRatio: PropTypes.number,
      classes: PropTypes.object,
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
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      domainLimit: PropTypes.oneOfType([PropTypes.oneOf(['nice', 'strict']), PropTypes.func]),
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          getValue: PropTypes.func.isRequired,
          tickLabelStyle: PropTypes.object,
          tickSize: PropTypes.number,
        }),
      ),
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ignoreTooltip: PropTypes.bool,
      label: PropTypes.string,
      labelStyle: PropTypes.object,
      offset: PropTypes.number,
      ordinalTimeTicks: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.oneOf(['biweekly', 'days', 'hours', 'months', 'quarterly', 'weeks', 'years']),
          PropTypes.shape({
            format: PropTypes.func.isRequired,
            getTickNumber: PropTypes.func.isRequired,
            isTick: PropTypes.func.isRequired,
          }),
        ]).isRequired,
      ),
      position: PropTypes.oneOf(['left', 'none', 'right']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['band']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      sx: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
        PropTypes.func,
        PropTypes.object,
      ]),
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
      tickSize: PropTypes.number,
      tickSpacing: PropTypes.number,
      valueFormatter: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
      zoom: PropTypes.oneOfType([
        PropTypes.shape({
          filterMode: PropTypes.oneOf(['discard', 'keep']),
          maxEnd: PropTypes.number,
          maxSpan: PropTypes.number,
          minSpan: PropTypes.number,
          minStart: PropTypes.number,
          panning: PropTypes.bool,
          slider: PropTypes.shape({
            enabled: PropTypes.bool,
            preview: PropTypes.bool,
            showTooltip: PropTypes.oneOf(['always', 'hover', 'never']),
            size: PropTypes.number,
          }),
          step: PropTypes.number,
        }),
        PropTypes.bool,
      ]),
    }),
  ).isRequired,
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
          pointerMode: PropTypes.any,
          requiredKeys: PropTypes.array,
          type: PropTypes.oneOf(['brush']).isRequired,
        }),
      ]).isRequired,
    ),
  }),
} as any;

export { Heatmap };
