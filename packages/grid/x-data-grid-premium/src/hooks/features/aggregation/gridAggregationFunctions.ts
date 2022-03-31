import { GridValueFormatterParams } from '@mui/x-data-grid-pro';
import { isNumber } from '@mui/x-data-grid-pro/internals';
import { GridAggregationFunction } from './gridAggregationInterfaces';

const sumAgg: GridAggregationFunction<number> = {
  apply: ({ values }) => {
    let sum = 0;
    for (let i = 0; i < values.length; i += 1) {
      sum += values[i];
    }

    return sum;
  },
  types: ['number'],
};

const minAgg: GridAggregationFunction<number> = {
  apply: ({ values }) => {
    if (values.length === 0) {
      return Number.NaN;
    }

    let min: number = +Infinity;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if (value < min) {
        min = value;
      }
    }

    return min;
  },
  types: ['number'],
};

const maxAgg: GridAggregationFunction<number> = {
  apply: ({ values }) => {
    if (values.length === 0) {
      return Number.NaN;
    }

    let max: number = -Infinity;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if (value > max) {
        max = value;
      }
    }

    return max;
  },
  types: ['number'],
};

const avgAgg: GridAggregationFunction<number> = {
  apply: (params) => {
    if (params.values.length === 0) {
      return Number.NaN;
    }

    const sum = sumAgg.apply(params);
    return sum / params.values.length;
  },
  types: ['number'],
};

const sizeAgg: GridAggregationFunction<number> = {
  apply: ({ values }) => {
    return values.length;
  },
  valueFormatter: (params: GridValueFormatterParams) => {
    if (params.value == null || !isNumber(params.value)) {
      return params.value;
    }

    return params.value.toLocaleString();
  },
  hasCellUnit: false,
  types: ['number'],
};

export const GRID_AGGREGATION_FUNCTIONS = {
  avg: avgAgg,
  min: minAgg,
  max: maxAgg,
  size: sizeAgg,
  sum: sumAgg,
};
