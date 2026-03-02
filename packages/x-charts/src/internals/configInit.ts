import {
  type CartesianChartSeriesType,
  type PolarChartSeriesType,
} from '../models/seriesType/config';

let cartesianInstance: undefined | Set<CartesianChartSeriesType>;
let polarInstance: undefined | Set<PolarChartSeriesType>;

class CartesianSeriesTypes {
  types: Set<CartesianChartSeriesType> = new Set();

  constructor() {
    if (cartesianInstance) {
      throw new Error(
        'MUI X Charts: Only one CartesianSeriesTypes instance can be created. ' +
          'This is a singleton class used internally for series type registration. ' +
          'Use the existing instance instead of creating a new one.',
      );
    }
    cartesianInstance = this.types;
  }

  addType(value: CartesianChartSeriesType) {
    this.types.add(value);
  }

  getTypes() {
    return this.types;
  }
}

class PolarSeriesTypes {
  types: Set<PolarChartSeriesType> = new Set();

  constructor() {
    if (polarInstance) {
      throw new Error(
        'MUI X Charts: Only one PolarSeriesTypes instance can be created. ' +
          'This is a singleton class used internally for series type registration. ' +
          'Use the existing instance instead of creating a new one.',
      );
    }
    polarInstance = this.types;
  }

  addType(value: PolarChartSeriesType) {
    this.types.add(value);
  }

  getTypes() {
    return this.types;
  }
}

export const cartesianSeriesTypes = new CartesianSeriesTypes();

cartesianSeriesTypes.addType('bar');
cartesianSeriesTypes.addType('line');
cartesianSeriesTypes.addType('scatter');

export const polarSeriesTypes = new PolarSeriesTypes();

polarSeriesTypes.addType('radar');
