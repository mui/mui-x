import { isBarSeries, isDefaultizedBarSeries } from '@mui/x-charts/models';
import { isBarSeries as isBarSeriesPro } from '@mui/x-charts-pro/models';

function handleSeries(series: any) {
  if (isBarSeries(series)) {
    console.log('bar series');
  }
  if (isBarSeriesPro(series)) {
    console.log('bar series pro');
  }
  if (isDefaultizedBarSeries(series)) {
    console.log('defaultized bar series');
  }
}
