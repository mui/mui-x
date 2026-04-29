import { getSeriesLegendItems, type LegendGetter } from '@mui/x-charts/internals';

const legendGetter: LegendGetter<'ohlc'> = (series) => getSeriesLegendItems('ohlc', series);

export default legendGetter;
