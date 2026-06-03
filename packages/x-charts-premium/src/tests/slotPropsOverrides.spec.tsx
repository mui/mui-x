import {
  Unstable_RadialLineChart as RadialLineChart,
  type RadialLineChartSlots,
} from '@mui/x-charts-premium/RadialLineChart';
import {
  ScatterChartPremium,
  type ScatterChartPremiumSlots,
} from '@mui/x-charts-premium/ScatterChartPremium';
import { type PropsFromSlot } from '@mui/x-charts/models';
// eslint-disable-next-line no-restricted-imports
import type {} from '@mui/x-charts';

declare module '@mui/x-charts' {
  interface TooltipPropsOverrides {
    scatterPremiumTooltipExtra?: string;
  }
}

declare module '@mui/x-charts-premium' {
  interface RadialLineHighlightPropsOverrides {
    customRadialLineHighlightProp?: string;
  }
}

function CustomRadialLineHighlight({
  customRadialLineHighlightProp,
}: PropsFromSlot<RadialLineChartSlots['radialLineHighlight']>) {
  return <circle data-prop={customRadialLineHighlightProp} />;
}

export function AugmentedRadialLineChartUsage() {
  return (
    <RadialLineChart
      height={200}
      series={[{ data: [1, 2, 3] }]}
      radiusAxis={[{ data: [1, 2, 3] }]}
      rotationAxis={[{ data: [0, 120, 240] }]}
      slots={{ radialLineHighlight: CustomRadialLineHighlight }}
      slotProps={{
        radialLineHighlight: { customRadialLineHighlightProp: 'a' },
      }}
    />
  );
}

function CustomScatterPremiumTooltip({
  scatterPremiumTooltipExtra,
}: PropsFromSlot<ScatterChartPremiumSlots['tooltip']>) {
  return <div>{scatterPremiumTooltipExtra}</div>;
}

export function AugmentedScatterChartPremiumUsage() {
  return (
    <ScatterChartPremium
      height={200}
      series={[{ data: [{ x: 1, y: 1, id: 'a' }] }]}
      slots={{ tooltip: CustomScatterPremiumTooltip }}
      slotProps={{ tooltip: { scatterPremiumTooltipExtra: 'extra' } }}
    />
  );
}
