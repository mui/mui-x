import type {
  AllTrue,
  Assert,
  AssertAllSlotsAcceptDataAttributes,
} from 'test/utils/slotDataAttributes';
import type {
  BarChartPremiumSlotProps,
  BarPlotPremiumSlotProps,
  RangeBarPlotSlotProps,
} from '@mui/x-charts-premium/BarChartPremium';
import type { CandlestickChartSlotProps } from '@mui/x-charts-premium/CandlestickChart';
import type { ChartsContainerPremiumSlotProps } from '@mui/x-charts-premium/ChartsContainerPremium';
import type { ChartsDataProviderPremiumSlotProps } from '@mui/x-charts-premium/ChartsDataProviderPremium';
import type { HeatmapPremiumSlotProps } from '@mui/x-charts-premium/HeatmapPremium';
import type {
  ScatterChartPremiumSlotProps,
  ScatterPlotPremiumSlotProps,
} from '@mui/x-charts-premium/ScatterChartPremium';
import type { RadialBarChartSlotProps } from '@mui/x-charts-premium/RadialBarChart';
import type {
  RadialLineChartSlotProps,
  RadialLineHighlightPlotSlotProps,
} from '@mui/x-charts-premium/RadialLineChart';
import type { ChartsGeoDataProviderPremiumSlotProps } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import type { ChartsRadialDataProviderPremiumSlotProps } from '@mui/x-charts-premium/ChartsRadialDataProviderPremium';

declare module '@mui/utils/types' {
  interface DataAttributesOverrides {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}

// Compile-time assertion: every slot of every exported top-level component and provider
// `*SlotProps` in `x-charts-premium` must accept `data-*` once `DataAttributesOverrides` is augmented,
// so a regression names the offending slot. Slots of nested components (plot elements,
// `use*` hooks) are exercised through their parent's `*SlotProps`.

type AssertBarChartPremium = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      BarChartPremiumSlotProps,
      'BarChartPremium',
      'xAxis' | 'yAxis'
    >
  >
>;
type AssertCandlestickChart = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      CandlestickChartSlotProps,
      'CandlestickChart',
      'xAxis' | 'yAxis'
    >
  >
>;
type AssertChartsContainerPremium = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<ChartsContainerPremiumSlotProps, 'ChartsContainerPremium'>
  >
>;
type AssertChartsDataProviderPremium = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ChartsDataProviderPremiumSlotProps,
      'ChartsDataProviderPremium'
    >
  >
>;
type AssertHeatmapPremium = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<HeatmapPremiumSlotProps, 'HeatmapPremium', 'xAxis' | 'yAxis'>
  >
>;
type AssertScatterChartPremium = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ScatterChartPremiumSlotProps,
      'ScatterChartPremium',
      'xAxis' | 'yAxis' | 'scatter'
    >
  >
>;
type AssertScatterPlotPremium = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<ScatterPlotPremiumSlotProps, 'ScatterPlotPremium', 'scatter'>
  >
>;
type AssertRadialBarChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<RadialBarChartSlotProps, 'RadialBarChart'>>
>;
type AssertRadialLineChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<RadialLineChartSlotProps, 'RadialLineChart'>>
>;
type AssertRadialLineHighlightPlot = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<RadialLineHighlightPlotSlotProps, 'RadialLineHighlightPlot'>
  >
>;
type AssertChartsGeoDataProviderPremium = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ChartsGeoDataProviderPremiumSlotProps,
      'ChartsGeoDataProviderPremium'
    >
  >
>;
type AssertChartsRadialDataProviderPremium = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ChartsRadialDataProviderPremiumSlotProps,
      'ChartsRadialDataProviderPremium'
    >
  >
>;
type AssertBarPlotPremium = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<BarPlotPremiumSlotProps, 'BarPlotPremium'>>
>;
type AssertRangeBarPlot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<RangeBarPlotSlotProps, 'RangeBarPlot'>>
>;
