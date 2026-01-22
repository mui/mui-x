import { AllSeriesType } from '@mui/x-charts';

function handleSeries(series: AllSeriesType) {
  if (series.type === 'bar') {
    console.log('bar series');
  }
}

function handleDefaultizedSeries(series: any) {
  if (series.type === 'bar') {
    console.log('defaultized bar series');
  }
}
