import type { LegendGetter } from '@mui/x-charts/internals';
import { getSeriesLegendItems } from '@mui/x-charts/internals';

const legendGetter: LegendGetter<'radialBar'> = (series) =>
  getSeriesLegendItems('radialBar', series, 'square');

export default legendGetter;
