import type { ConvertSignaturesIntoPlugins } from '@mui/x-charts/internals';
import { SCATTER_CHART_PRO_PLUGINS } from '@mui/x-charts-pro/ScatterChartPro';
import type { ScatterChartProPluginSignatures } from '@mui/x-charts-pro/ScatterChartPro';
import { useChartPremiumExport } from '../internals/plugins/useChartPremiumExport';
import type { UseChartPremiumExportSignature } from '../internals/plugins/useChartPremiumExport';

export type ScatterChartPremiumPluginSignatures = [
  ...ScatterChartProPluginSignatures,
  UseChartPremiumExportSignature,
];

export const SCATTER_CHART_PREMIUM_PLUGINS: ConvertSignaturesIntoPlugins<ScatterChartPremiumPluginSignatures> =
  [...SCATTER_CHART_PRO_PLUGINS, useChartPremiumExport];
