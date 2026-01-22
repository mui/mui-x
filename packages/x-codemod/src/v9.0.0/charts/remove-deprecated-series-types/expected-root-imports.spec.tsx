import {
  AllSeriesType,
  DefaultizedSeriesType,
  CartesianChartSeriesType,
  StackableChartSeriesType,
} from '@mui/x-charts';

function processCartesian(series: AllSeriesType<CartesianChartSeriesType>) {
  console.log(series);
}

function processDefaultizedCartesian(series: DefaultizedSeriesType<CartesianChartSeriesType>) {
  console.log(series);
}

function processStackable(series: DefaultizedSeriesType<StackableChartSeriesType>) {
  console.log(series);
}
