'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { SvgRefProviderProps } from './SvgRef.types';
import { SvgRefContext } from './SvgRefContext';

export function SvgRefProvider(props: SvgRefProviderProps) {
  const { svgRef: inRef, children } = props;
  const svgRef = React.useRef<SVGSVGElement>(null);
  const surfaceRef = useForkRef(inRef, svgRef);

  const refValue = React.useMemo(
    () => ({ isInitialized: true, data: { svgRef, surfaceRef } }),
    [svgRef, surfaceRef],
  );

  return <SvgRefContext.Provider value={refValue}>{children}</SvgRefContext.Provider>;
}
