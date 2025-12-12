import {
  ChartDataProvider,
  PIE_CHART_PLUGINS,
  type ChartDataProviderProps,
  type PieChartPluginSignatures,
  type PieSeriesType,
  type PieValueType,
} from '@mui/x-charts';
import type { MakeOptional } from '@mui/x-internals/types';
import * as React from 'react';
import { defaultizeMargin } from '@mui/x-charts/internals/defaultizeMargin';
import { DEFAULT_PIE_CHART_MARGIN } from '@mui/x-charts/internals/constants';
import { useChartContainerProps } from '@mui/x-charts/ChartContainer/useChartContainerProps';
import { ChartsSurface } from '../ChartsSurface';
import { PiePlot } from './PiePlot';
import { PieLabelPlot } from './PieLabelPlot';

export type PieSeries = MakeOptional<PieSeriesType<MakeOptional<PieValueType, 'id'>>, 'type'>;
export interface PieRootProps
  extends Omit<
    ChartDataProviderProps<'pie', PieChartPluginSignatures>,
    'series' | 'slots' | 'slotProps' | 'experimentalFeatures'
  > {
  /**
   * The series to display in the pie chart.
   * An array of [[PieSeries]] objects.
   */
  series: Readonly<PieSeries[]>;
}

const PieRoot = React.forwardRef(function PieChart(
  props: PieRootProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const {
    series,
    width,
    height,
    margin: marginProps,
    colors,
    skipAnimation,
    children,
    highlightedItem,
    onHighlightChange,
    ...other
  } = props;
  const margin = defaultizeMargin(marginProps, DEFAULT_PIE_CHART_MARGIN);

  const { chartDataProviderProps } = useChartContainerProps<'pie', PieChartPluginSignatures>(
    {
      ...other,
      series: series.map((s) => ({ type: 'pie', ...s })),
      width,
      height,
      margin,
      colors,
      highlightedItem,
      onHighlightChange,
      skipAnimation,
      plugins: PIE_CHART_PLUGINS,
    },
    ref,
  );

  return (
    <ChartDataProvider<'pie', PieChartPluginSignatures> {...chartDataProviderProps}>
      {children}
    </ChartDataProvider>
  );
});

// We could use `ChartsSurface` directly, but I think we could propose a different pattern, like if you want a single chart, then
// you can use `PieChart.Surface`, but if you want composition, we could use like `Composition.Surface`, technically they are the same though.
const PieSurface = ChartsSurface;

export { PieRoot as Root, PieSurface as Surface, PiePlot as Plot, PieLabelPlot as LabelPlot };
