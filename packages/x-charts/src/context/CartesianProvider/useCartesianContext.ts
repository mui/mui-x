import * as React from 'react';
import { CartesianContext } from './CartesianContext';
import { CartesianContextState } from './Cartesian.types';

export const useCartesianContext = (): CartesianContextState => {
  const { data } = React.useContext(CartesianContext);
  return data;
};
