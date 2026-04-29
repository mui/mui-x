import { getSeriesLegendItems, type LegendGetter } from '@mui/x-charts/internals';

const legendGetter: LegendGetter<'radialLine'> = (series) =>
  getSeriesLegendItems('radialLine', series);

export default legendGetter;
