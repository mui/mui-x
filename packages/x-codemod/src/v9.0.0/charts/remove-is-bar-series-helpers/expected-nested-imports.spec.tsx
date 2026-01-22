import { AllSeriesType } from '@mui/x-charts/models';

function handleSeries(series: AllSeriesType) {
  if (series.type === 'bar') {
    console.log('bar series');
  }
  if (series.type === 'bar') {
    console.log('bar series pro');
  }
  if (series.type === 'bar') {
    console.log('defaultized bar series');
  }
}
