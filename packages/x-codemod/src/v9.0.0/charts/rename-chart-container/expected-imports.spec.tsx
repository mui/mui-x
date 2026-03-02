// @ts-nocheck
// Root imports
import { ChartsContainer } from '@mui/x-charts';
import { ChartsContainer as ChartContainerAlias } from '@mui/x-charts-pro';
import { ChartsContainerProps } from '@mui/x-charts';
import { ChartsContainerSlots, ChartsContainerSlotProps } from '@mui/x-charts';
// Deep imports
import { ChartsContainer as MyContainer } from '@mui/x-charts/ChartsContainer';
import { ChartsContainerProps as MyProps } from '@mui/x-charts/ChartsContainer';
// Pro imports
import { ChartsContainerPro } from '@mui/x-charts-pro';
import { ChartsContainerProProps } from '@mui/x-charts-pro/ChartsContainerPro';
// Premium imports
import { ChartsContainerPremium } from '@mui/x-charts-premium';
import { ChartsContainerPremiumProps } from '@mui/x-charts-premium/ChartsContainerPremium';
// Hooks from internals
import { useChartsContainerProps, UseChartsContainerPropsReturnValue } from '@mui/x-charts/internals';
import { useChartsContainerProProps } from '@mui/x-charts-pro/internals';

function App() {
  const props: ChartsContainerProps = {};
  return <ChartsContainer {...props} />;
}
