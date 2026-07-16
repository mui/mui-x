import type {
  AllTrue,
  Assert,
  AssertAllSlotsAcceptDataAttributes,
} from 'test/utils/slotDataAttributes';
import type { BarChartProSlotProps } from '@mui/x-charts-pro/BarChartPro';
import type { ChartsContainerProSlotProps } from '@mui/x-charts-pro/ChartsContainerPro';
import type { ChartsDataProviderProSlotProps } from '@mui/x-charts-pro/ChartsDataProviderPro';
import type { ChartsToolbarProSlotProps } from '@mui/x-charts-pro/ChartsToolbarPro';
import type { FunnelChartSlotProps, FunnelPlotSlotProps } from '@mui/x-charts-pro/FunnelChart';
import type {
  HeatmapSlotProps,
  HeatmapPlotSlotProps,
  HeatmapTooltipSlotProps,
} from '@mui/x-charts-pro/Heatmap';
import type { LineChartProSlotProps } from '@mui/x-charts-pro/LineChartPro';
import type { PieChartProSlotProps } from '@mui/x-charts-pro/PieChartPro';
import type { RadarChartProSlotProps } from '@mui/x-charts-pro/RadarChartPro';
import type { SankeyChartSlotProps, SankeyTooltipSlotProps } from '@mui/x-charts-pro/SankeyChart';
import type { ScatterChartProSlotProps } from '@mui/x-charts-pro/ScatterChartPro';

declare module '@mui/utils/types' {
  interface DataAttributesOverrides {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}

// Compile-time assertion: every slot of every exported component and provider `*SlotProps` a
// consumer can pass `slotProps` to -- including the nested/plot-level components asserted below
// -- must accept `data-*` once `DataAttributesOverrides` is augmented, so a regression names the
// offending slot.

type AssertBarChartPro = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<BarChartProSlotProps, 'BarChartPro', 'xAxis' | 'yAxis'>
  >
>;
type AssertFunnelChart = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<FunnelChartSlotProps, 'FunnelChart', 'xAxis' | 'yAxis'>
  >
>;
type AssertHeatmap = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<HeatmapSlotProps, 'Heatmap', 'xAxis' | 'yAxis'>>
>;
type AssertLineChartPro = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<LineChartProSlotProps, 'LineChartPro', 'xAxis' | 'yAxis'>
  >
>;
type AssertPieChartPro = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<PieChartProSlotProps, 'PieChartPro'>>
>;
type AssertRadarChartPro = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<RadarChartProSlotProps, 'RadarChartPro'>>
>;
type AssertSankeyChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<SankeyChartSlotProps, 'SankeyChart'>>
>;
type AssertScatterChartPro = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ScatterChartProSlotProps,
      'ScatterChartPro',
      'xAxis' | 'yAxis' | 'scatter'
    >
  >
>;
type AssertChartsContainerPro = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChartsContainerProSlotProps, 'ChartsContainerPro'>>
>;
type AssertChartsDataProviderPro = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<ChartsDataProviderProSlotProps, 'ChartsDataProviderPro'>
  >
>;
type AssertChartsToolbarPro = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChartsToolbarProSlotProps, 'ChartsToolbarPro'>>
>;
type AssertFunnelPlot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<FunnelPlotSlotProps, 'FunnelPlot'>>
>;
type AssertHeatmapPlot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<HeatmapPlotSlotProps, 'HeatmapPlot'>>
>;
type AssertHeatmapTooltip = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<HeatmapTooltipSlotProps, 'HeatmapTooltip'>>
>;
type AssertSankeyTooltip = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<SankeyTooltipSlotProps, 'SankeyTooltip'>>
>;
