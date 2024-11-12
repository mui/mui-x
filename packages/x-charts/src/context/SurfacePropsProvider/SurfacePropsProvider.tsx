'use client';
import * as React from 'react';
import { SurfacePropsContext } from './SurfacePropsContext';
import { SurfacePropsProviderProps } from './SurfaceProps.types';

const SurfacePropsProvider = React.forwardRef(function SurfacePropsProvider(
  props: SurfacePropsProviderProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const { children, ...other } = props;

  const value = React.useMemo(
    () => ({
      isInitialized: true,
      data: {
        ...other,
        ref,
      },
    }),
    [other, ref],
  );

  return <SurfacePropsContext.Provider value={value}>{children}</SurfacePropsContext.Provider>;
});

export { SurfacePropsProvider };
