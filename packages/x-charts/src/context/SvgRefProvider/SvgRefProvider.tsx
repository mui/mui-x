'use client';
import * as React from 'react';
import { SvgRefProviderProps } from './SvgRef.types';
import { SvgRefContext } from './SvgRefContext';

export function SvgRefProvider(props: SvgRefProviderProps) {
  const { svgRef, children } = props;

  const refValue = React.useMemo(() => ({ isInitialized: true, data: svgRef }), [svgRef]);

  return <SvgRefContext.Provider value={refValue}>{children}</SvgRefContext.Provider>;
}
