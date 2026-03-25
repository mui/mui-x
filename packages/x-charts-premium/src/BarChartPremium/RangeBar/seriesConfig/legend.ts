import { getSeriesLegendItems, type LegendGetter } from '@mui/x-charts/internals';

const legendGetter: LegendGetter<'rangeBar'> = (series) => getSeriesLegendItems('rangeBar', series);

export default legendGetter;
