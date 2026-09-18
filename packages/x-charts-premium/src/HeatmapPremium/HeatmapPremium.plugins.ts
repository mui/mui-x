import {
  useChartZAxis,
  useChartCartesianAxis,
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartBrush,
  useChartKeyboardNavigation,
  useChartItemClick,
} from '@mui/x-charts/internals';
import type {
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  ConvertSignaturesIntoPlugins,
  UseChartBrushSignature,
  UseChartKeyboardNavigationSignature,
  UseChartItemClickSignature,
} from '@mui/x-charts/internals';
import { useChartProExport, useChartProZoom } from '@mui/x-charts-pro/plugins';
import type {
  UseChartProExportSignature,
  UseChartProZoomSignature,
} from '@mui/x-charts-pro/plugins';
import { useChartPremiumExport } from '../internals/plugins/useChartPremiumExport';
import type { UseChartPremiumExportSignature } from '../internals/plugins/useChartPremiumExport';

export type HeatmapPremiumPluginSignatures = [
  UseChartZAxisSignature,
  UseChartTooltipSignature<'heatmap'>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'heatmap'>,
  UseChartHighlightSignature<'heatmap'>,
  UseChartProExportSignature,
  UseChartPremiumExportSignature,
  UseChartBrushSignature,
  UseChartProZoomSignature,
  UseChartItemClickSignature<'heatmap'>,
  UseChartKeyboardNavigationSignature,
];

export const HEATMAP_PREMIUM_PLUGINS: ConvertSignaturesIntoPlugins<HeatmapPremiumPluginSignatures> =
  [
    useChartZAxis,
    useChartTooltip,
    useChartInteraction,
    useChartCartesianAxis,
    useChartHighlight,
    useChartProExport,
    useChartPremiumExport,
    useChartBrush,
    useChartProZoom,
    useChartItemClick,
    useChartKeyboardNavigation,
  ];
