'use client';
import * as React from 'react';
import { SurfacePropsContext } from './SurfacePropsContext';
import { SurfacePropsContextState } from './SurfaceProps.types';

export const useSurfaceProps = (): SurfacePropsContextState => {
  const { data } = React.useContext(SurfacePropsContext);
  return data;
};
