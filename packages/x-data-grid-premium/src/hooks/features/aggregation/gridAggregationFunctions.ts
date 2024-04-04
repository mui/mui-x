import { isNumber } from '@mui/x-data-grid-pro/internals';
import { GridAggregationFunction } from './gridAggregationInterfaces';

const sumAgg: GridAggregationFunction<unknown, number> = {
  apply: ({ values }) => {
    let sum = 0;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if (isNumber(value)) {
        sum += value;
      }
    }

    return sum;
  },
  columnTypes: ['number'],
};

const avgAgg: GridAggregationFunction<unknown, number> = {
  apply: ({ values }) => {
    if (values.length === 0) {
      return null;
    }

    let sum = 0;
    let valuesCount = 0;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if (isNumber(value)) {
        valuesCount += 1;
        sum += value;
      }
    }

    return sum / valuesCount;
  },
  columnTypes: ['number'],
};

const minAgg: GridAggregationFunction<number | Date> = {
  apply: ({ values }) => {
    if (values.length === 0) {
      return null;
    }

    let min: number | Date = +Infinity;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if (value != null && value < min) {
        min = value;
      }
    }

    return min;
  },
  columnTypes: ['number', 'date', 'dateTime'],
};

const maxAgg: GridAggregationFunction<number | Date> = {
  apply: ({ values }) => {
    if (values.length === 0) {
      return null;
    }

    let max: number | Date = -Infinity;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if (value != null && value > max) {
        max = value;
      }
    }

    return max;
  },
  columnTypes: ['number', 'date', 'dateTime'],
};

const sizeAgg: GridAggregationFunction<unknown, number> = {
  apply: ({ values }) => {
    return values.filter((value) => typeof value !== 'undefined').length;
  },
  valueFormatter: (value: number | string | null) => {
    if (value == null || !isNumber(value)) {
      return value;
    }

    return value.toLocaleString();
  },
  hasCellUnit: false,
};

export const GRID_AGGREGATION_FUNCTIONS = {
  sum: sumAgg,
  avg: avgAgg,
  min: minAgg,
  max: maxAgg,
  size: sizeAgg,
};
