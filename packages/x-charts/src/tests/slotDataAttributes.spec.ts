import type {
  AllTrue,
  Assert,
  AssertAllSlotsAcceptDataAttributes,
} from 'test/utils/slotDataAttributes';
import type {
  BarChartSlotProps,
  BarElementSlotProps,
  BarLabelSlotProps,
  BarPlotSlotProps,
} from '@mui/x-charts/BarChart';
import type { ChartsAxisSlotProps } from '@mui/x-charts/ChartsAxis';
import type { ChartsContainerSlotProps } from '@mui/x-charts/ChartsContainer';
import type { ChartsDataProviderSlotProps } from '@mui/x-charts/ChartsDataProvider';
import type { ChartsLegendSlotProps } from '@mui/x-charts/ChartsLegend';
import type { ChartsOverlaySlotProps } from '@mui/x-charts/ChartsOverlay';
import type { ChartsRadialDataProviderSlotProps } from '@mui/x-charts/ChartsRadialDataProvider';
import type { ChartsToolbarSlotProps } from '@mui/x-charts/Toolbar';
import type {
  ChartsTooltipContainerSlotProps,
  ChartsTooltipSlotProps,
} from '@mui/x-charts/ChartsTooltip';
import type { ChartsXAxisSlotProps } from '@mui/x-charts/ChartsXAxis';
import type { ChartsYAxisSlotProps } from '@mui/x-charts/ChartsYAxis';
import type {
  AreaElementSlotProps,
  AreaPlotSlotProps,
  LineChartSlotProps,
  LineElementSlotProps,
  LineHighlightPlotSlotProps,
  LinePlotSlotProps,
  MarkPlotSlotProps,
} from '@mui/x-charts/LineChart';
import type {
  PieArcLabelPlotSlotProps,
  PieArcPlotSlotProps,
  PieChartSlotProps,
  PiePlotSlotProps,
} from '@mui/x-charts/PieChart';
import type { RadarChartSlotProps } from '@mui/x-charts/RadarChart';
import type {
  ScatterChartSlotProps,
  ScatterMarkerSlotProps,
  ScatterPlotSlotProps,
  ScatterSlotProps,
} from '@mui/x-charts/ScatterChart';
import type { SparkLineChartSlotProps } from '@mui/x-charts/SparkLineChart';

declare module '@mui/utils/types' {
  interface DataAttributesOverrides {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}

// Compile-time assertion: every slot of every exported component and provider `*SlotProps` a
// consumer can pass `slotProps` to -- including the nested/plot-level components asserted below
// -- must accept `data-*` once `DataAttributesOverrides` is augmented, so a regression names the
// offending slot.

type AssertBarChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<BarChartSlotProps, 'BarChart', 'xAxis' | 'yAxis'>>
>;
type AssertChartsAxis = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChartsAxisSlotProps, 'ChartsAxis', 'xAxis' | 'yAxis'>>
>;
type AssertChartsContainer = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChartsContainerSlotProps, 'ChartsContainer'>>
>;
type AssertChartsDataProvider = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChartsDataProviderSlotProps, 'ChartsDataProvider'>>
>;
type AssertChartsLegend = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChartsLegendSlotProps, 'ChartsLegend'>>
>;
type AssertChartsOverlay = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChartsOverlaySlotProps, 'ChartsOverlay'>>
>;
type AssertChartsRadialDataProvider = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ChartsRadialDataProviderSlotProps,
      'ChartsRadialDataProvider'
    >
  >
>;
type AssertChartsToolbar = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChartsToolbarSlotProps, 'ChartsToolbar'>>
>;
type AssertChartsTooltipContainer = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<ChartsTooltipContainerSlotProps, 'ChartsTooltipContainer'>
  >
>;
type AssertChartsXAxis = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<ChartsXAxisSlotProps, 'ChartsXAxis', 'xAxis' | 'yAxis'>
  >
>;
type AssertChartsYAxis = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<ChartsYAxisSlotProps, 'ChartsYAxis', 'xAxis' | 'yAxis'>
  >
>;
type AssertLineChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<LineChartSlotProps, 'LineChart', 'xAxis' | 'yAxis'>>
>;
type AssertPieChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<PieChartSlotProps, 'PieChart'>>
>;
type AssertRadarChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<RadarChartSlotProps, 'RadarChart'>>
>;
type AssertScatterChart = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ScatterChartSlotProps,
      'ScatterChart',
      'xAxis' | 'yAxis' | 'scatter'
    >
  >
>;
type AssertSparkLineChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<SparkLineChartSlotProps, 'SparkLineChart'>>
>;

// Nested/plot-level components exported from the package root also expose their own
// `*SlotProps`. Assert them directly so an independent, unwidened declaration cannot escape.
type AssertAreaElement = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<AreaElementSlotProps, 'AreaElement'>>
>;
type AssertAreaPlot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<AreaPlotSlotProps, 'AreaPlot'>>
>;
type AssertBarElement = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<BarElementSlotProps, 'BarElement'>>
>;
type AssertBarLabel = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<BarLabelSlotProps, 'BarLabel'>>
>;
type AssertBarPlot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<BarPlotSlotProps, 'BarPlot'>>
>;
type AssertChartsTooltip = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChartsTooltipSlotProps, 'ChartsTooltip'>>
>;
type AssertLineElement = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<LineElementSlotProps, 'LineElement'>>
>;
type AssertLineHighlightPlot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<LineHighlightPlotSlotProps, 'LineHighlightPlot'>>
>;
type AssertLinePlot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<LinePlotSlotProps, 'LinePlot'>>
>;
type AssertMarkPlot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<MarkPlotSlotProps, 'MarkPlot'>>
>;
type AssertPieArcLabelPlot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<PieArcLabelPlotSlotProps, 'PieArcLabelPlot'>>
>;
type AssertPieArcPlot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<PieArcPlotSlotProps, 'PieArcPlot'>>
>;
type AssertPiePlot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<PiePlotSlotProps, 'PiePlot'>>
>;
type AssertScatterMarker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ScatterMarkerSlotProps, 'ScatterMarker'>>
>;
type AssertScatterPlot = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ScatterPlotSlotProps,
      'ScatterPlot',
      'xAxis' | 'yAxis' | 'scatter'
    >
  >
>;
type AssertScatter = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ScatterSlotProps, 'Scatter'>>
>;
