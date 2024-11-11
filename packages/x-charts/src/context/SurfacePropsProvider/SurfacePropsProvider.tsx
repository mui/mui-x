'use client';
import * as React from 'react';
import { SurfacePropsContext } from './SurfacePropsContext';
import { SurfacePropsProviderProps } from './SurfaceProps.types';

function SurfacePropsProvider(props: SurfacePropsProviderProps) {
  const { children, ...other } = props;

  const value = React.useMemo(
    () => ({
      isInitialized: true,
      data: other,
    }),
    [other],
  );

  return <SurfacePropsContext.Provider value={value}>{children}</SurfacePropsContext.Provider>;
}

export { SurfacePropsProvider };
