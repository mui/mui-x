import { type LegendGetter, getDataItemLegendItems } from '@mui/x-charts/internals';

const legendGetter: LegendGetter<'funnel'> = (series) =>
  getDataItemLegendItems('funnel', series);

export default legendGetter;
