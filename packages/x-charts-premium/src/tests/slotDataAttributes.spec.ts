import type {
  AllTrue,
  Assert,
  AssertAllSlotsAcceptDataAttributes,
} from 'test/utils/slotDataAttributes';
import type { BarChartPremiumSlotProps } from '@mui/x-charts-premium/BarChartPremium';
import type { CandlestickChartSlotProps } from '@mui/x-charts-premium/CandlestickChart';
import type { ChartsContainerPremiumSlotProps } from '@mui/x-charts-premium/ChartsContainerPremium';
import type { ChartsDataProviderPremiumSlotProps } from '@mui/x-charts-premium/ChartsDataProviderPremium';
import type { HeatmapPremiumSlotProps } from '@mui/x-charts-premium/HeatmapPremium';

declare module '@mui/utils/types' {
  interface DataAttributesOverrides {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}

// Compile-time assertion: every slot in every exported SlotProps type of `x-charts-premium`
// must accept `data-*` attributes once `DataAttributesOverrides` is augmented (below).

type AssertBarChartPremium = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<BarChartPremiumSlotProps, 'BarChartPremium'>>
>;
type AssertCandlestickChart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<CandlestickChartSlotProps, 'CandlestickChart'>>
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
  AllTrue<AssertAllSlotsAcceptDataAttributes<HeatmapPremiumSlotProps, 'HeatmapPremium'>>
>;
