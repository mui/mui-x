import * as React from 'react';
import type { CartesianContextState } from './CartesianContext';
import { CartesianContext } from './CartesianContext';

export const useCartesianContext = (): CartesianContextState => {
  const { data } = React.useContext(CartesianContext);
  return data;
};
