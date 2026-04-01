// @ts-nocheck
import { ChartsDataProvider } from '@mui/x-charts/ChartsDataProvider';
import { ChartsDataProviderPro } from '@mui/x-charts-pro/ChartsDataProviderPro';
import { ChartsDataProviderPremium } from '@mui/x-charts-premium/ChartsDataProviderPremium';
import {
  ChartsDataProviderProps,
  ChartsDataProviderSlots,
  ChartsDataProviderSlotProps,
} from '@mui/x-charts/ChartsDataProvider';
import {
  ChartsDataProviderProProps,
  ChartsDataProviderProSlots,
  ChartsDataProviderProSlotProps,
} from '@mui/x-charts-pro/ChartsDataProviderPro';
import {
  ChartsDataProviderPremiumProps,
  ChartsDataProviderPremiumSlots,
  ChartsDataProviderPremiumSlotProps,
} from '@mui/x-charts-premium/ChartsDataProviderPremium';
import { ChartsDataProvider as AliasedProvider } from '@mui/x-charts/ChartsDataProvider';

function App() {
  const props: ChartsDataProviderProps = {};
  const proProps: ChartsDataProviderProProps = {};
  const premiumProps: ChartsDataProviderPremiumProps = {};

  return (
    <div>
      <ChartsDataProvider>
        <div />
      </ChartsDataProvider>
      <ChartsDataProviderPro>
        <div />
      </ChartsDataProviderPro>
      <ChartsDataProviderPremium>
        <div />
      </ChartsDataProviderPremium>
      <AliasedProvider>
        <div />
      </AliasedProvider>
    </div>
  );
}
