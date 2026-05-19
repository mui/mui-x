import { LineChart, type LineChartSlots } from '@mui/x-charts/LineChart';
import type { PropsFromSlot } from '@mui/x-charts/models';

declare module '@mui/x-charts' {
  interface TooltipPropsOverrides {
    customTooltipProp?: string;
  }
}

function CustomTooltip({ customTooltipProp }: PropsFromSlot<LineChartSlots['tooltip']>) {
  return <div>{customTooltipProp}</div>;
}

export function AugmentedTooltipUsage() {
  return (
    <LineChart
      height={200}
      series={[{ data: [1, 2, 3] }]}
      slots={{ tooltip: CustomTooltip }}
      slotProps={{ tooltip: { customTooltipProp: 'hello' } }}
    />
  );
}
