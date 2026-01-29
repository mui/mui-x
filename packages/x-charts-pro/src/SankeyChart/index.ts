import { SankeyChart } from './SankeyChart';

export { SankeyChart } from './SankeyChart';
/**
 * @deprecated Sankey chart is now stable, import `SankeyChart` instead
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Unstable_SankeyChart = SankeyChart;
export type { SankeyChartProps, SankeySeries } from './SankeyChart';
export * from './SankeyPlot';
export * from './SankeyDataProvider';
export * from './SankeyLinkPlot';
export * from './SankeyNodePlot';
export * from './SankeyLinkLabelPlot';
export * from './SankeyNodeLabelPlot';
export * from './FocusedSankeyLink';
export * from './FocusedSankeyNode';
export * from './sankey.types';
export * from './sankeySlots.types';
export * from './sankeyHighlightHooks';
export * from '../hooks/useSankeySeries';
export { type SankeyPlotClasses, sankeyPlotClasses } from './sankeyClasses';
export { SankeyTooltip, SankeyTooltipContent } from './SankeyTooltip';
export type {
  SankeyTooltipProps,
  SankeyTooltipClasses,
  SankeyTooltipContentClasses,
  SankeyTooltipSlots,
  SankeyTooltipSlotProps,
} from './SankeyTooltip';
