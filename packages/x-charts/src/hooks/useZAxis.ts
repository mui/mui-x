'use client';
import * as React from 'react';
import { ZAxisContext } from '../context/ZAxisContextProvider';

export const useZAxis = () => {
  const data = React.useContext(ZAxisContext);
  return data;
};
