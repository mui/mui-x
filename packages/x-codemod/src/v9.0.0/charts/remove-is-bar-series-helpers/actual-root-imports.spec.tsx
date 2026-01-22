import { isBarSeries, isDefaultizedBarSeries, AllSeriesType } from '@mui/x-charts';

function handleSeries(series: AllSeriesType) {
  if (isBarSeries(series)) {
    console.log('bar series');
  }
}

function handleDefaultizedSeries(series: any) {
  if (isDefaultizedBarSeries(series)) {
    console.log('defaultized bar series');
  }
}
