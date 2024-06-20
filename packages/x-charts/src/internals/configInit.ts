import { ChartSeriesType } from '../models/seriesType/config';

let instance: undefined | Set<ChartSeriesType>;

class CartesianSeriesTypes {
  types: Set<ChartSeriesType> = new Set();

  constructor() {
    if (instance) {
      throw new Error('You can only create one instance!');
    }
    instance = this.types;
  }

  addType(value: ChartSeriesType) {
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
