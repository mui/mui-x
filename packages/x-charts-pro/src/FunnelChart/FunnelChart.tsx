'use client';
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { ChartsOverlay, ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartSeriesConfig, ChartsWrapper } from '@mui/x-charts/internals';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { MakeOptional } from '@mui/x-internals/types';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsAxisHighlight, ChartsAxisHighlightProps } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import { FunnelPlot, FunnelPlotProps } from './FunnelPlot';
import { FunnelSeriesType } from './funnel.types';
import { useFunnelChartProps } from './useFunnelChartProps';
import { ChartContainerProProps } from '../ChartContainerPro';
import { seriesConfig as funnelSeriesConfig } from './seriesConfig';
import { useChartContainerProProps } from '../ChartContainerPro/useChartContainerProProps';
import { ChartDataProviderPro } from '../ChartDataProviderPro';
import { FunnelChartSlotExtension } from './funnelSlots.types';
import { CategoryAxis } from './categoryAxis.types';

export interface FunnelChartProps
  extends Omit<
      ChartContainerProProps<'funnel'>,
      | 'series'
      | 'plugins'
      | 'zAxis'
      | 'zoom'
      | 'onZoomChange'
      | 'dataset'
      | 'yAxis'
      | 'xAxis'
      | 'rotationAxis'
      | 'radiusAxis'
    >,
    Omit<FunnelPlotProps, 'slots' | 'slotProps'>,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'>,
    FunnelChartSlotExtension {
  /**
   * The series to display in the funnel chart.
   * An array of [[FunnelSeriesType]] objects.
   */
  series: Readonly<MakeOptional<FunnelSeriesType, 'type'>[]>;
  /**
   * The configuration of the category axis.
   *
   * @default { position: 'none' }
   */
  categoryAxis?: CategoryAxis;
  /**
   * If `true`, the legend is not rendered.
   * @default false
   */
  hideLegend?: boolean;
  /**
   * The configuration of axes highlight.
   * Default is set to 'band' in the bar direction.
   * Depends on `layout` prop.
   * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
   *
   */
  axisHighlight?: ChartsAxisHighlightProps;
}

const seriesConfig: ChartSeriesConfig<'funnel'> = { funnel: funnelSeriesConfig };

const FunnelChart = React.forwardRef(function FunnelChart(
  props: FunnelChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const themedProps = useThemeProps({ props, name: 'MuiFunnelChart' });

  const {
    chartContainerProps,
    funnelPlotProps,
    overlayProps,
    legendProps,
    clipPathGroupProps,
    chartsAxisProps,
    clipPathProps,
    chartsWrapperProps,
    axisHighlightProps,
    children,
  } = useFunnelChartProps(themedProps);
  const { chartDataProviderProProps, chartsSurfaceProps } = useChartContainerProProps(
    chartContainerProps,
    ref,
  );

  const Tooltip = themedProps.slots?.tooltip ?? ChartsTooltip;

  return (
    <ChartDataProviderPro {...chartDataProviderProProps} seriesConfig={seriesConfig}>
      <ChartsWrapper {...chartsWrapperProps}>
        {!themedProps.hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsSurface {...chartsSurfaceProps}>
          <g {...clipPathGroupProps}>
            <FunnelPlot {...funnelPlotProps} />
            <ChartsOverlay {...overlayProps} />
            <ChartsAxisHighlight {...axisHighlightProps} />
          </g>
          {!themedProps.loading && <Tooltip {...themedProps.slotProps?.tooltip} trigger="item" />}
          <ChartsAxis {...chartsAxisProps} />
          <ChartsClipPath {...clipPathProps} />
          {children}
        </ChartsSurface>
      </ChartsWrapper>
    </ChartDataProviderPro>
  );
});

FunnelChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      exportAsPrint: PropTypes.func.isRequired,
      setZoomData: PropTypes.func.isRequired,
    }),
  }),
  /**
   * The configuration of axes highlight.
   * Default is set to 'band' in the bar direction.
   * Depends on `layout` prop.
   * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
   */
  axisHighlight: PropTypes.shape({
    x: PropTypes.oneOf(['band', 'line', 'none']),
    y: PropTypes.oneOf(['band', 'line', 'none']),
  }),
  /**
   * The configuration of the category axis.
   *
   * @default { position: 'none' }
   */
  categoryAxis: PropTypes.oneOfType([
    PropTypes.shape({
      categories: PropTypes.arrayOf(PropTypes.string),
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      position: PropTypes.oneOf(['bottom', 'left', 'none', 'right', 'top']),
      scaleType: PropTypes.oneOf(['band']),
      size: PropTypes.number,
      tickLabelStyle: PropTypes.object,
      tickSize: PropTypes.number,
    }),
    PropTypes.shape({
      categories: PropTypes.arrayOf(PropTypes.string),
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      position: PropTypes.oneOf(['bottom', 'left', 'none', 'right', 'top']),
      scaleType: PropTypes.oneOf(['point']),
      size: PropTypes.number,
      tickLabelStyle: PropTypes.object,
      tickSize: PropTypes.number,
    }),
    PropTypes.shape({
      categories: PropTypes.arrayOf(PropTypes.string),
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      position: PropTypes.oneOf(['bottom', 'left', 'none', 'right', 'top']),
      scaleType: PropTypes.oneOf(['log']),
      size: PropTypes.number,
      tickLabelStyle: PropTypes.object,
      tickSize: PropTypes.number,
    }),
    PropTypes.shape({
      categories: PropTypes.arrayOf(PropTypes.string),
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      position: PropTypes.oneOf(['bottom', 'left', 'none', 'right', 'top']),
      scaleType: PropTypes.oneOf(['pow']),
      size: PropTypes.number,
      tickLabelStyle: PropTypes.object,
      tickSize: PropTypes.number,
    }),
    PropTypes.shape({
      categories: PropTypes.arrayOf(PropTypes.string),
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      position: PropTypes.oneOf(['bottom', 'left', 'none', 'right', 'top']),
      scaleType: PropTypes.oneOf(['sqrt']),
      size: PropTypes.number,
      tickLabelStyle: PropTypes.object,
      tickSize: PropTypes.number,
    }),
    PropTypes.shape({
      categories: PropTypes.arrayOf(PropTypes.string),
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      position: PropTypes.oneOf(['bottom', 'left', 'none', 'right', 'top']),
      scaleType: PropTypes.oneOf(['time']),
      size: PropTypes.number,
      tickLabelStyle: PropTypes.object,
      tickSize: PropTypes.number,
    }),
    PropTypes.shape({
      categories: PropTypes.arrayOf(PropTypes.string),
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      position: PropTypes.oneOf(['bottom', 'left', 'none', 'right', 'top']),
      scaleType: PropTypes.oneOf(['utc']),
      size: PropTypes.number,
      tickLabelStyle: PropTypes.object,
      tickSize: PropTypes.number,
    }),
    PropTypes.shape({
      categories: PropTypes.arrayOf(PropTypes.string),
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      position: PropTypes.oneOf(['bottom', 'left', 'none', 'right', 'top']),
      scaleType: PropTypes.oneOf(['linear']),
      size: PropTypes.number,
      tickLabelStyle: PropTypes.object,
      tickSize: PropTypes.number,
    }),
  ]),
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
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * If `true`, the legend is not rendered.
   * @default false
   */
  hideLegend: PropTypes.bool,
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
   * @param {null | AxisData} data The data about the clicked axis and items associated with it.
   */
  onAxisClick: PropTypes.func,
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  /**
   * Callback fired when a funnel item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {FunnelItemIdentifier} funnelItemIdentifier The funnel item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * The series to display in the funnel chart.
   * An array of [[FunnelSeriesType]] objects.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
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
} as any;

export { FunnelChart };
