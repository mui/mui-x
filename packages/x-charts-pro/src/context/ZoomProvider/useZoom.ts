import * as React from 'react';
import { ZoomContext } from './ZoomContext';

export const useZoom = () => {
  const { data } = React.useContext(ZoomContext);
  return data;
};
