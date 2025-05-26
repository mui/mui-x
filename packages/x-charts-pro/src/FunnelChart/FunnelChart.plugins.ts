import {
  useChartZAxis,
  UseChartZAxisSignature,
  useChartInteraction,
  UseChartInteractionSignature,
  useChartHighlight,
  UseChartHighlightSignature,
} from '@mui/x-charts/internals';
import { UseChartFunnelAxisSignature } from './funnelAxisPlugin/useChartCartesianAxis.types';
import { useChartFunnelAxis } from './funnelAxisPlugin/useChartFunnelAxis';

export type FunnelSignatures = [
  UseChartZAxisSignature,
  UseChartFunnelAxisSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
];

export const FUNNEL_PLUGINS = [
  useChartZAxis,
  useChartFunnelAxis,
  useChartInteraction,
  useChartHighlight,
] as const;
