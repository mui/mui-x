import { computeValue } from './computeValue';
import { defaultizeAxis } from './defaultizeAxis';
import { normalizeAxis } from './normalizeAxis';

export * from './CartesianProvider';
export * from './CartesianContext';
export * from './useCartesianContext';

const cartesianProviderUtils = {
  computeValue,
  normalizeAxis,
  defaultizeAxis,
};

export { cartesianProviderUtils };
