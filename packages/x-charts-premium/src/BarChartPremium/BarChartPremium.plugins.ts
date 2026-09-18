import type { ConvertSignaturesIntoPlugins } from '@mui/x-charts/internals';
import { BAR_CHART_PRO_PLUGINS } from '@mui/x-charts-pro/BarChartPro';
import type { BarChartProPluginSignatures } from '@mui/x-charts-pro/BarChartPro';
import { useChartPremiumExport } from '../internals/plugins/useChartPremiumExport';
import type { UseChartPremiumExportSignature } from '../internals/plugins/useChartPremiumExport';

export type BarChartPremiumPluginSignatures = [
  ...BarChartProPluginSignatures,
  UseChartPremiumExportSignature,
];

export const BAR_CHART_PREMIUM_PLUGINS: ConvertSignaturesIntoPlugins<BarChartPremiumPluginSignatures> =
  [...BAR_CHART_PRO_PLUGINS, useChartPremiumExport];
