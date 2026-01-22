import { AllSeriesType, DefaultizedSeriesType } from '@mui/x-charts';

import {
  CartesianChartSeriesType,
  StackableChartSeriesType,
} from '@mui/x-charts/internals';

function processCartesian(series: AllSeriesType<CartesianChartSeriesType>) {
  console.log(series);
}

function processDefaultizedCartesian(series: DefaultizedSeriesType<CartesianChartSeriesType>) {
  console.log(series);
}

function processStackable(series: DefaultizedSeriesType<StackableChartSeriesType>) {
  console.log(series);
}
