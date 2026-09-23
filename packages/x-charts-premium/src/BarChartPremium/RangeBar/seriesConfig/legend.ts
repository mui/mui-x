import { getSeriesLegendItems } from '@mui/x-charts/internals';
import type { LegendGetter } from '@mui/x-charts/internals';

const legendGetter: LegendGetter<'rangeBar'> = (series) => getSeriesLegendItems('rangeBar', series);

export default legendGetter;
