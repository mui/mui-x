import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  useChartsContainerProps,
  type ChartsSlots,
  type ChartsSlotProps,
} from '@mui/x-charts/internals';
import {
  Unstable_ChartsRadialDataProvider as ChartsRadialDataProvider,
  type ChartsRadialDataProviderProps,
} from '@mui/x-charts/ChartsRadialDataProvider';
import {
  Unstable_ChartsRadialGrid as ChartsRadialGrid,
  type ChartsRadialGridProps,
} from '@mui/x-charts/ChartsRadialGrid';
import { ChartsLegend, type ChartsLegendSlots, type ChartsLegendSlotProps } from '../ChartsLegend';
import { ChartsSurface } from '../ChartsSurface';
import {
  ChartsTooltip,
  type ChartsTooltipSlots,
  type ChartsTooltipSlotProps,
} from '../ChartsTooltip';
import { ChartsWrapper } from '../ChartsWrapper';
import { type RadialLineChartPluginSignatures } from './RadialLineChart.plugins';
// import { RadialLinePlot } from './RadialLinePlot';
import { RadialMarkPlot } from './RadialMarkPlot';
// import { RadialAreaPlot } from './RadialAreaPlot';
import { ChartsClipPath } from '../ChartsClipPath';
import {
  ChartsOverlay,
  type ChartsOverlayProps,
  type ChartsOverlaySlots,
  type ChartsOverlaySlotProps,
} from '../ChartsOverlay';
import type { LinePlotSlots, LinePlotSlotProps, LineSeries } from '../LineChart';
import { type ChartsToolbarSlots, type ChartsToolbarSlotProps } from '../Toolbar';
import { useRadialLineChartProps } from './useRadialLineChartProps';
import { radialLineSeriesConfig } from './seriesConfig';

export interface RadialLineChartSlots
  extends
    LinePlotSlots,
    ChartsLegendSlots,
    ChartsOverlaySlots,
    ChartsTooltipSlots,
    ChartsToolbarSlots,
    Partial<ChartsSlots> {}
export interface RadialLineChartSlotProps
  extends
    LinePlotSlotProps,
    ChartsLegendSlotProps,
    ChartsOverlaySlotProps,
    ChartsTooltipSlotProps,
    ChartsToolbarSlotProps,
    Partial<ChartsSlotProps> {}

export interface RadialLineChartProps
  extends
    Omit<
      ChartsRadialDataProviderProps<'radialLine', RadialLineChartPluginSignatures>,
      'series' | 'plugins' | 'zAxis' | 'slots' | 'slotProps'
    >,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'> {
  /**
   * The series to display in the line chart.
   * An array of [[LineSeries]] objects.
   */
  series: Readonly<LineSeries[]>;
  /**
   * Option to display a cartesian grid in the background.
   */
  grid?: Pick<ChartsRadialGridProps, 'radius' | 'rotation'>;
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
  slots?: RadialLineChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RadialLineChartSlotProps;
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
 * - [Line demonstration](https://mui.com/x/react-charts/radial-line/)
 *
 * API:
 *
 * - [RadialLineChart API](https://mui.com/x/api/charts/radial-line-chart/)
 */
export const RadialLineChart = React.forwardRef(function RadialLineChart(
  inProps: RadialLineChartProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiRadialLineChart' });
  const {
    chartsWrapperProps,
    chartsContainerProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    overlayProps,
    legendProps,
    children,
  } = useRadialLineChartProps(props);
  const { chartsDataProviderProps, chartsSurfaceProps } = useChartsContainerProps<
    'radialLine',
    RadialLineChartPluginSignatures
  >(chartsContainerProps);

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;
  const Toolbar = props.slots?.toolbar;

  return (
    <ChartsRadialDataProvider<'radialLine', RadialLineChartPluginSignatures>
      {...chartsDataProviderProps}
      seriesConfig={{ radialLine: radialLineSeriesConfig }}
    >
      <ChartsWrapper
        {...chartsWrapperProps}
        ref={ref}
      >
        {props.showToolbar && Toolbar ? <Toolbar {...props.slotProps?.toolbar} /> : null}
        {!props.hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsSurface {...chartsSurfaceProps}>
          <ChartsRadialGrid {...gridProps} />
          <g {...clipPathGroupProps}>
            <ChartsOverlay {...overlayProps} />
          </g>
          <RadialMarkPlot />

          <ChartsClipPath {...clipPathProps} />
          {children}
        </ChartsSurface>
        {!props.loading && <Tooltip {...props.slotProps?.tooltip} />}
      </ChartsWrapper>
    </ChartsRadialDataProvider>
  );
});

export { RadialLineChart as Unstable_RadialLineChart };
