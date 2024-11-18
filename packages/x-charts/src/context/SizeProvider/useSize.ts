'use client';
import * as React from 'react';
import { SizeContext } from './SizeContext';
import { SizeContextState } from './Size.types';

/**
 * Returns the size of the chart. And the ref of the container element that the chart is rendered in.
 */
export const useSize = (): SizeContextState => {
  const { data } = React.useContext(SizeContext);
  return data;
};
