import {
  CartesianSeriesType,
  DefaultizedCartesianSeriesType,
  StackableSeriesType,
  AllSeriesType,
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
  console.log(series);
}
