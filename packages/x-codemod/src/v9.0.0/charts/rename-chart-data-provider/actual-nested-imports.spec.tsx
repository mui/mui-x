// @ts-nocheck
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartDataProviderPro } from '@mui/x-charts-pro/ChartDataProviderPro';
import { ChartDataProviderPremium } from '@mui/x-charts-premium/ChartDataProviderPremium';
import {
  ChartDataProviderProps,
  ChartDataProviderSlots,
  ChartDataProviderSlotProps,
} from '@mui/x-charts/ChartDataProvider';
import {
  ChartDataProviderProProps,
  ChartDataProviderProSlots,
  ChartDataProviderProSlotProps,
} from '@mui/x-charts-pro/ChartDataProviderPro';
import {
  ChartDataProviderPremiumProps,
  ChartDataProviderPremiumSlots,
  ChartDataProviderPremiumSlotProps,
} from '@mui/x-charts-premium/ChartDataProviderPremium';
import { ChartDataProvider as AliasedProvider } from '@mui/x-charts/ChartDataProvider';

function App() {
  const props: ChartDataProviderProps = {};
  const proProps: ChartDataProviderProProps = {};
  const premiumProps: ChartDataProviderPremiumProps = {};

  return (
    <div>
      <ChartDataProvider>
        <div />
      </ChartDataProvider>
      <ChartDataProviderPro>
        <div />
      </ChartDataProviderPro>
      <ChartDataProviderPremium>
        <div />
      </ChartDataProviderPremium>
      <AliasedProvider>
        <div />
      </AliasedProvider>
    </div>
  );
}
