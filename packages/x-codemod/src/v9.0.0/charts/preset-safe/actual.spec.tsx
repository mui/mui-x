import {
  CartesianSeriesType,
  DefaultizedCartesianSeriesType,
  StackableSeriesType,
  AllSeriesType,
  isBarSeries,
  isDefaultizedBarSeries,
} from '@mui/x-charts/models';

function processCartesian(series: CartesianSeriesType) {
  console.log(series);
}

function processDefaultizedCartesian(series: DefaultizedCartesianSeriesType) {
  console.log(series);
}

function processStackable(series: StackableSeriesType) {
  console.log(series);
}

function processAll(series: AllSeriesType) {
  if (isBarSeries(series)) {
    console.log('bar series');
  }
  if (isDefaultizedBarSeries(series)) {
    console.log('defaultized bar series');
  }
}
