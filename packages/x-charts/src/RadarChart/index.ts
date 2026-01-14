import { RadarChart } from './RadarChart';
import { RadarDataProvider } from './RadarDataProvider';

export { RadarChart } from './RadarChart';
/**
 * @deprecated radar chart is now stable, import `RadarChart` instead
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Unstable_RadarChart = RadarChart;

export { RadarDataProvider } from './RadarDataProvider';
/**
 * @deprecated radar data provider is now stable, import `RadarDataProvider` instead
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Unstable_RadarDataProvider = RadarDataProvider;

export type { RadarChartProps, RadarChartSlots, RadarChartSlotProps } from './RadarChart';
export type { RadarDataProviderProps, RadarSeries } from './RadarDataProvider';
export * from './FocusedRadarMark';
export * from './RadarGrid';
export * from './RadarAxis';
export * from './RadarAxisHighlight';
export * from './RadarMetricLabels';
export * from './RadarSeriesPlot';
export * from './RadarChart.plugins';
