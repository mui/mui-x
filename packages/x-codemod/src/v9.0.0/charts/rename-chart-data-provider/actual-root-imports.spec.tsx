// @ts-nocheck
import { ChartDataProvider, ChartDataProviderProps } from '@mui/x-charts';
import { ChartDataProviderPro, ChartDataProviderProProps } from '@mui/x-charts-pro';
import { ChartDataProviderPremium, ChartDataProviderPremiumProps } from '@mui/x-charts-premium';

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
    </div>
  );
}
