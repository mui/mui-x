import type { AllTrue, Assert, AssertAllSlotsAcceptDataAttributes } from '@mui/x-internals/types';
import type { BarChartSlotProps } from '@mui/x-charts/BarChart';
import type { ChartsAxisSlotProps } from '@mui/x-charts/ChartsAxis';
import type { ChartsContainerSlotProps } from '@mui/x-charts/ChartsContainer';
import type { ChartsDataProviderSlotProps } from '@mui/x-charts/ChartsDataProvider';
import type { ChartsLegendSlotProps } from '@mui/x-charts/ChartsLegend';
import type { ChartsOverlaySlotProps } from '@mui/x-charts/ChartsOverlay';
import type { ChartsRadialDataProviderSlotProps } from '@mui/x-charts/ChartsRadialDataProvider';
import type { ChartsToolbarSlotProps } from '@mui/x-charts/Toolbar';
import type { ChartsTooltipContainerSlotProps } from '@mui/x-charts/ChartsTooltip';
import type { ChartsXAxisSlotProps } from '@mui/x-charts/ChartsXAxis';
import type { ChartsYAxisSlotProps } from '@mui/x-charts/ChartsYAxis';
import type { LineChartSlotProps } from '@mui/x-charts/LineChart';
import type { PieChartSlotProps } from '@mui/x-charts/PieChart';
import type { RadarChartSlotProps } from '@mui/x-charts/RadarChart';
import type { ScatterChartSlotProps } from '@mui/x-charts/ScatterChart';
import type { SparkLineChartSlotProps } from '@mui/x-charts/SparkLineChart';

// Compile-time assertion: every slot in every exported SlotProps type of `x-charts`
// must accept `data-*` and `aria-*` attributes. The test compiles iff the assertion holds.

type AssertBarChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<BarChartSlotProps, 'BarChart'>>
>;
type AssertChartsAxis = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChartsAxisSlotProps, 'ChartsAxis'>>
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
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChartsXAxisSlotProps, 'ChartsXAxis'>>
>;
type AssertChartsYAxis = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChartsYAxisSlotProps, 'ChartsYAxis'>>
>;
type AssertLineChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<LineChartSlotProps, 'LineChart'>>
>;
type AssertPieChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<PieChartSlotProps, 'PieChart'>>
>;
type AssertRadarChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<RadarChartSlotProps, 'RadarChart'>>
>;
type AssertScatterChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ScatterChartSlotProps, 'ScatterChart'>>
>;
type AssertSparkLineChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<SparkLineChartSlotProps, 'SparkLineChart'>>
>;
