// @ts-nocheck
import { ChartsDataProvider, ChartsDataProviderProps } from '@mui/x-charts';
import { ChartsDataProviderPro, ChartsDataProviderProProps } from '@mui/x-charts-pro';
import { ChartsDataProviderPremium, ChartsDataProviderPremiumProps } from '@mui/x-charts-premium';

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
    </div>
  );
}
