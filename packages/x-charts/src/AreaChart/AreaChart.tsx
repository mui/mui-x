'use client';
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { MakeOptional } from '@mui/x-internals/types';
import {
  LineHighlightPlot,
  LineHighlightPlotSlotProps,
  LineHighlightPlotSlots,
} from '../LineChart/LineHighlightPlot';
import { ChartsSlots, ChartsSlotProps } from '../internals/material';
import { AreaPlot, AreaPlotProps, AreaPlotSlotProps, AreaPlotSlots } from './AreaPlot';
import { LinePlot, LinePlotProps, LinePlotSlotProps, LinePlotSlots } from '../LineChart/LinePlot';
import { ChartContainerProps } from '../ChartContainer';
import { MarkPlot, MarkPlotProps, MarkPlotSlotProps, MarkPlotSlots } from '../LineChart/MarkPlot';
import { ChartsAxis, ChartsAxisProps } from '../ChartsAxis/ChartsAxis';
import { ChartsTooltip } from '../ChartsTooltip';
import { ChartsTooltipSlots, ChartsTooltipSlotProps } from '../ChartsTooltip/ChartTooltip.types';
import { ChartsLegend, ChartsLegendSlotProps, ChartsLegendSlots } from '../ChartsLegend';
import { ChartsAxisHighlight, ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsClipPath } from '../ChartsClipPath';
import { ChartsAxisSlotProps, ChartsAxisSlots } from '../models/axis';
import { ChartsGrid, ChartsGridProps } from '../ChartsGrid';
import {
  ChartsOverlay,
  ChartsOverlayProps,
  ChartsOverlaySlotProps,
  ChartsOverlaySlots,
} from '../ChartsOverlay';
import { useChartContainerProps } from '../ChartContainer/useChartContainerProps';
import { ChartDataProvider } from '../ChartDataProvider';
import { ChartsSurface } from '../ChartsSurface';
import { ChartsWrapper } from '../ChartsWrapper';
import { ChartsToolbarSlots, ChartsToolbarSlotProps } from '../Toolbar';
import { FocusedMark } from '../LineChart/FocusedMark';
import { useAreaChartProps } from './useAreaChartProps';
import { AreaChartPluginSignatures } from './AreaChart.plugins';
import { AreaRangeSeriesType } from '../models/seriesType/area-range';

export interface LineChartSlots
  extends ChartsAxisSlots,
    AreaPlotSlots,
    LinePlotSlots,
    MarkPlotSlots,
    LineHighlightPlotSlots,
    ChartsLegendSlots,
    ChartsOverlaySlots,
    ChartsTooltipSlots,
    ChartsToolbarSlots,
    Partial<ChartsSlots> {}
export interface LineChartSlotProps
  extends ChartsAxisSlotProps,
    AreaPlotSlotProps,
    LinePlotSlotProps,
    MarkPlotSlotProps,
    LineHighlightPlotSlotProps,
    ChartsLegendSlotProps,
    ChartsOverlaySlotProps,
    ChartsTooltipSlotProps,
    ChartsToolbarSlotProps,
    Partial<ChartsSlotProps> {}

export type AreaRangeSeries = MakeOptional<AreaRangeSeriesType, 'type'>;
export interface AreaChartProps
  extends Omit<
      ChartContainerProps<'areaRange', AreaChartPluginSignatures>,
      'series' | 'plugins' | 'zAxis'
    >,
    Omit<ChartsAxisProps, 'slots' | 'slotProps'>,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'> {
  /**
   * The series to display in the line chart.
   * An array of [[LineSeries]] objects.
   */
  series: Readonly<AreaRangeSeries[]>;
  /**
   * Option to display a cartesian grid in the background.
   */
  grid?: Pick<ChartsGridProps, 'vertical' | 'horizontal'>;
  /**
   * The configuration of axes highlight.
   * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
   * @default { x: 'line' }
   */
  axisHighlight?: ChartsAxisHighlightProps;
  /**
   * If `true`, the legend is not rendered.
   */
  hideLegend?: boolean;
  /**
   * If `true`, render the line highlight item.
   */
  disableLineItemHighlight?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: LineChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: LineChartSlotProps;
  /**
   * Callback fired when an area element is clicked.
   */
  onAreaClick?: AreaPlotProps['onItemClick'];
  /**
   * Callback fired when a line element is clicked.
   */
  onLineClick?: LinePlotProps['onItemClick'];
  /**
   * Callback fired when a mark element is clicked.
   */
  onMarkClick?: MarkPlotProps['onItemClick'];
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
  /**
   * If true, shows the default chart toolbar.
   * @default false
   */
  showToolbar?: boolean;
}

/**
 * Demos:
 *
 * TODO: Handle this
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Area demonstration](https://mui.com/x/react-charts/area-demo/)
 *
 * API:
 *
 * - [AreaChart API](https://mui.com/x/api/charts/area-chart/)
 */
const AreaChart = React.forwardRef(function LineChart(
  inProps: AreaChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiLineChart' });
  const {
    chartsWrapperProps,
    chartContainerProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    areaPlotProps,
    linePlotProps,
    markPlotProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    lineHighlightPlotProps,
    legendProps,
    children,
  } = useAreaChartProps(props);
  const { chartDataProviderProps, chartsSurfaceProps } = useChartContainerProps(
    chartContainerProps,
    ref,
  );

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;
  const Toolbar = props.slots?.toolbar;

  return (
    <ChartDataProvider<'areaRange', AreaChartPluginSignatures> {...chartDataProviderProps}>
      <ChartsWrapper {...chartsWrapperProps}>
        {props.showToolbar && Toolbar ? <Toolbar {...props.slotProps?.toolbar} /> : null}
        {!props.hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsSurface {...chartsSurfaceProps}>
          <ChartsGrid {...gridProps} />
          <g {...clipPathGroupProps}>
            <AreaPlot {...areaPlotProps} />
            <LinePlot {...linePlotProps} />
            <ChartsOverlay {...overlayProps} />
            <ChartsAxisHighlight {...axisHighlightProps} />
          </g>
          <FocusedMark />
          <ChartsAxis {...chartsAxisProps} />
          <g data-drawing-container>
            {/* The `data-drawing-container` indicates that children are part of the drawing area. Ref: https://github.com/mui/mui-x/issues/13659 */}
            <MarkPlot {...markPlotProps} />
          </g>
          <LineHighlightPlot {...lineHighlightPlotProps} />
          <ChartsClipPath {...clipPathProps} />
          {children}
        </ChartsSurface>
        {!props.loading && <Tooltip {...props.slotProps?.tooltip} />}
      </ChartsWrapper>
    </ChartDataProvider>
  );
});

export { AreaChart };
