import { isBarSeries, isDefaultizedBarSeries } from '@mui/x-charts';

function handleSeries(series: any) {
  if (isBarSeries(series)) {
    console.log('bar series');
  }
}

function handleDefaultizedSeries(series: any) {
  if (isDefaultizedBarSeries(series)) {
    console.log('defaultized bar series');
  }
}
