import type {
  AllTrue,
  Assert,
  AssertAllSlotsAcceptDataAttributes,
} from 'test/utils/slotDataAttributes';
import type { BarChartProSlotProps } from '@mui/x-charts-pro/BarChartPro';
import type { FunnelChartSlotProps } from '@mui/x-charts-pro/FunnelChart';
import type { HeatmapSlotProps } from '@mui/x-charts-pro/Heatmap';
import type { LineChartProSlotProps } from '@mui/x-charts-pro/LineChartPro';
import type { PieChartProSlotProps } from '@mui/x-charts-pro/PieChartPro';
import type { RadarChartProSlotProps } from '@mui/x-charts-pro/RadarChartPro';
import type { SankeyChartSlotProps } from '@mui/x-charts-pro/SankeyChart';
import type { ScatterChartProSlotProps } from '@mui/x-charts-pro/ScatterChartPro';

declare module '@mui/utils/types' {
  interface DataAttributesOverrides {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}

// Compile-time assertion: every slot in every exported SlotProps type of `x-charts-pro`
// must accept `data-*` attributes. The test compiles if and only if the assertion holds.

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
