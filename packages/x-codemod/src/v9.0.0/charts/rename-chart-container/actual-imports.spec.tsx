// @ts-nocheck
// Root imports
import { ChartContainer } from '@mui/x-charts';
import { ChartContainer as ChartContainerAlias } from '@mui/x-charts-pro';
import { ChartContainerProps } from '@mui/x-charts';
import { ChartContainerSlots, ChartContainerSlotProps } from '@mui/x-charts';
// Deep imports
import { ChartContainer as MyContainer } from '@mui/x-charts/ChartContainer';
import { ChartContainerProps as MyProps } from '@mui/x-charts/ChartContainer';
// Pro imports
import { ChartContainerPro } from '@mui/x-charts-pro';
import { ChartContainerProProps } from '@mui/x-charts-pro/ChartContainerPro';
// Premium imports
import { ChartContainerPremium } from '@mui/x-charts-premium';
import { ChartContainerPremiumProps } from '@mui/x-charts-premium/ChartContainerPremium';
// Hooks from internals
import { useChartContainerProps, UseChartContainerPropsReturnValue } from '@mui/x-charts/internals';
import { useChartContainerProProps } from '@mui/x-charts-pro/internals';

function App() {
  const props: ChartContainerProps = {};
  return <ChartContainer {...props} />;
}
