import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { type MakeOptional } from '@mui/x-internals/types';
import { ChartsLegend, type ChartsLegendSlots, type ChartsLegendSlotProps } from '../ChartsLegend';
import {
  ChartsPolarDataProvider,
  type ChartsPolarDataProviderProps,
} from '../ChartsPolarDataProvider';
import { ChartsPolarGrid, type ChartsPolarGridProps } from '../ChartsPolarGrid';
import { ChartsSurface } from '../ChartsSurface';
import {
  ChartsTooltip,
  type ChartsTooltipSlots,
  type ChartsTooltipSlotProps,
} from '../ChartsTooltip';
import { ChartsWrapper } from '../ChartsWrapper';
import { type RadialLineChartPluginSignatures } from './RadialLineChart.plugins';
import { RadialLinePlot } from './RadialLinePlot';
import { ChartsClipPath } from '../ChartsClipPath';
import {
  ChartsOverlay,
  type ChartsOverlayProps,
  type ChartsOverlaySlots,
  type ChartsOverlaySlotProps,
} from '../ChartsOverlay';
import { type LinePlotSlots, type LinePlotSlotProps } from '../LineChart';
import { type LineSeriesType } from '../models/seriesType';
import { type ChartsToolbarSlots, type ChartsToolbarSlotProps } from '../Toolbar';
import { type ChartsSlots, type ChartsSlotProps } from '../internals/material';
import { useChartsPolarDataProviderProps } from '../ChartsPolarDataProvider/useChartsPolarDataProviderProps';
import { useRadialLineChartProps } from './useRadialLineChartProps';

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

export type LineSeries = MakeOptional<LineSeriesType, 'type'>;
export interface RadialLineChartProps
  extends
    Omit<
      ChartsPolarDataProviderProps<'line', RadialLineChartPluginSignatures>,
      'series' | 'plugins' | 'zAxis'
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
  grid?: Pick<ChartsPolarGridProps, 'circular' | 'radial'>;
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
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [RadialLineChart API](https://mui.com/x/api/charts/radial-line-chart/)
 */
const RadialLineChart = React.forwardRef(function RadialLineChart(
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
    linePlotProps,
    overlayProps,
    legendProps,
    children,
  } = useRadialLineChartProps(props);
  const { chartsProviderProps, chartsSurfaceProps } =
    useChartsPolarDataProviderProps(chartsContainerProps);

  const Tooltip = props.slots?.tooltip ?? ChartsTooltip;
  const Toolbar = props.slots?.toolbar;

  return (
    <ChartsPolarDataProvider<'line', RadialLineChartPluginSignatures> {...chartsProviderProps}>
      <ChartsWrapper {...chartsWrapperProps} ref={ref}>
        {props.showToolbar && Toolbar ? <Toolbar {...props.slotProps?.toolbar} /> : null}
        {!props.hideLegend && <ChartsLegend {...legendProps} />}
        <ChartsSurface {...chartsSurfaceProps}>
          <ChartsPolarGrid {...gridProps} />
          <g {...clipPathGroupProps}>
            <RadialLinePlot {...linePlotProps} />
            <ChartsOverlay {...overlayProps} />
          </g>

          <ChartsClipPath {...clipPathProps} />
          {children}
        </ChartsSurface>
        {!props.loading && <Tooltip {...props.slotProps?.tooltip} />}
      </ChartsWrapper>
    </ChartsPolarDataProvider>
  );
});
