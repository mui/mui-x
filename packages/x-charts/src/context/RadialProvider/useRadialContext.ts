import * as React from 'react';
import { RadialContext } from './RadialContext';
import { RadialContextState } from './Radial.types';

export const useRadialContext = (): RadialContextState => {
  const { data } = React.useContext(RadialContext);
  return data;
};

