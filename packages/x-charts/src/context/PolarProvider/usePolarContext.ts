'use client';
import * as React from 'react';
import { PolarContext } from './PolarContext';
import { PolarContextState } from './Polar.types';

export const usePolarContext = (): PolarContextState => {
  const { data } = React.useContext(PolarContext);
  return data;
};
