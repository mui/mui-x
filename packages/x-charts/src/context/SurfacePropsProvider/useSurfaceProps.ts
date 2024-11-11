'use client';
import * as React from 'react';
import { SurfacePropsContext } from './SurfacePropsContext';
import { SurfacePropsContextState } from './SurfaceProps.types';

export const useSurfacePropsContext = (): SurfacePropsContextState => {
  const { data } = React.useContext(SurfacePropsContext);
  return data;
};
