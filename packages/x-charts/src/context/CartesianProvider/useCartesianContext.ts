import * as React from 'react';
import { CartesianContext, CartesianContextState } from './CartesianContext';

export const useCartesianContext = (): CartesianContextState => {
  const { data } = React.useContext(CartesianContext);
  return data;
};
