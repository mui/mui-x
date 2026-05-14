import { getSeriesLegendItems, type LegendGetter } from '@mui/x-charts/internals';

const legendGetter: LegendGetter<'radialLine'> = (series) =>
  getSeriesLegendItems('radialLine', series, undefined, (s) =>
    s.showMark ? (s.shape ?? 'circle') : undefined,
  );

export default legendGetter;
