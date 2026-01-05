import { ChartsSurface } from '../ChartsSurface';

export { PieArc as Arc } from './PieArc';
export { PieArcLabel as ArcLabel } from './PieArcLabel';
export { PieLabelPlot as LabelPlot } from './PieLabelPlot';
export { PiePlot as Plot } from './PiePlot';
export { PieRoot as Root, type PieRootProps } from './PieRoot';

/**
 * PieChart.Surface is a re-export of ChartsSurface to make the API more intuitive.
 */
export const Surface = ChartsSurface;
