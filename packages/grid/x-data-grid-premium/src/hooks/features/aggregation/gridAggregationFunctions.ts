import { GridValueFormatterParams } from '@mui/x-data-grid-pro';
import { isNumber } from '@mui/x-data-grid-pro/internals';
import { GridAggregationFunction } from './gridAggregationInterfaces';

const sumAgg: GridAggregationFunction<number> = {
  apply: ({ values }) => {
    let sum = 0;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if (value !== undefined) {
        sum += value;
      }
    }

    return sum;
  },
  types: ['number'],
};

const avgAgg: GridAggregationFunction<number> = {
  apply: (params) => {
    if (params.values.length === 0) {
      return null;
    }

    const sum = sumAgg.apply(params) as number;
    return sum / params.values.length;
  },
  types: ['number'],
};

const minAgg: GridAggregationFunction<number | Date> = {
  apply: ({ values }) => {
    if (values.length === 0) {
      return null;
    }

    let min: number | Date = +Infinity;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if (value !== undefined && value < min) {
        min = value;
      }
    }

    return min;
  },
  types: ['number', 'date', 'dateTime'],
};

const maxAgg: GridAggregationFunction<number | Date> = {
  apply: ({ values }) => {
    if (values.length === 0) {
      return null;
    }

    let max: number | Date = -Infinity;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if (value !== undefined && value > max) {
        max = value;
      }
    }

    return max;
  },
  types: ['number', 'date', 'dateTime'],
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
};

export const GRID_AGGREGATION_FUNCTIONS = {
  sum: sumAgg,
  avg: avgAgg,
  min: minAgg,
  max: maxAgg,
  size: sizeAgg,
};
