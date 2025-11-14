import {
  ChartDataProvider,
  PIE_CHART_PLUGINS,
  type ChartContainerProps,
  type PieChartPluginSignatures,
  type PiePlotProps,
  type PieSeriesType,
  type PieValueType,
} from '@mui/x-charts';
import type { MakeOptional } from '@mui/x-internals/types';
import type { ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import * as React from 'react';
import { defaultizeMargin } from '@mui/x-charts/internals/defaultizeMargin';
import { DEFAULT_PIE_CHART_MARGIN } from '@mui/x-charts/internals/constants';
import { useChartContainerProps } from '@mui/x-charts/ChartContainer/useChartContainerProps';
import { FakeCss } from '../FakeCss';
import { ChartsSurface } from '../ChartsSurface';
import { PiePlot } from './PiePlot';

export type PieSeries = MakeOptional<PieSeriesType<MakeOptional<PieValueType, 'id'>>, 'type'>;
export interface PieChartProps
  extends Omit<
      ChartContainerProps<'pie', PieChartPluginSignatures>,
      'series' | 'slots' | 'slotProps' | 'experimentalFeatures'
    >,
    Omit<ChartsOverlayProps, 'slots' | 'slotProps'> {
  /**
   * The series to display in the pie chart.
   * An array of [[PieSeries]] objects.
   */
  series: Readonly<PieSeries[]>;
  /**
   * If `true`, the legend is not rendered.
   */
  hideLegend?: boolean;
  /**
   * Callback fired when a pie arc is clicked.
   */
  onItemClick?: PiePlotProps['onItemClick'];
  /**
   * If true, shows the default chart toolbar.
   * @default false
   */
  showToolbar?: boolean;
}

export const PieChart = React.forwardRef(function PieChart(
  props: PieChartProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const {
    series,
    width,
    height,
    margin: marginProps,
    colors,
    sx,
    skipAnimation,
    hideLegend,
    children,
    onItemClick,
    loading,
    highlightedItem,
    onHighlightChange,
    className,
    showToolbar,
    ...other
  } = props;
  const margin = defaultizeMargin(marginProps, DEFAULT_PIE_CHART_MARGIN);

  const { chartDataProviderProps, chartsSurfaceProps } = useChartContainerProps<
    'pie',
    PieChartPluginSignatures
  >(
    {
      ...other,
      series: series.map((s) => ({ type: 'pie', ...s })),
      width,
      height,
      margin,
      colors,
      highlightedItem,
      onHighlightChange,
      className,
      skipAnimation,
      plugins: PIE_CHART_PLUGINS,
    },
    ref,
  );

  return (
    <ChartDataProvider<'pie', PieChartPluginSignatures> {...chartDataProviderProps}>
      <FakeCss>
        <ChartsSurface {...chartsSurfaceProps}>
          <PiePlot onItemClick={onItemClick}></PiePlot>
        </ChartsSurface>
      </FakeCss>
    </ChartDataProvider>
  );
});
