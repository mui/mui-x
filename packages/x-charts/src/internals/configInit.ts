import { CartesianChartSeriesType, PolarChartSeriesType } from '../models/seriesType/config';

let cartesianInstance: undefined | Set<CartesianChartSeriesType>;
let polarInstance: undefined | Set<PolarChartSeriesType>;

class CartesianSeriesTypes {
  types: Set<CartesianChartSeriesType> = new Set();

  constructor() {
    if (cartesianInstance) {
      throw new Error('You can only create one instance!');
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
      throw new Error('You can only create one instance!');
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
