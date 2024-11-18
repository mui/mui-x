'use client';
import * as React from 'react';
import { SizeContext } from './SizeContext';
import { SizeProviderProps } from './Size.types';
import { useChartContainerDimensions } from './useChartContainerDimensions';

/**
 * The size provider.
 *
 * This differs from the DrawingProvider in that it provides the full size of the container.
 *
 * This provider is also responsible for resolving the size of the container before rendering and if the parent size changes.
 */
function SizeProvider(props: SizeProviderProps) {
  const dimensions = useChartContainerDimensions(
    props.width,
    props.height,
    props.resolveSizeBeforeRender,
  );

  const value = React.useMemo(
    () => ({
      isInitialized: true,
      data: dimensions,
    }),
    [dimensions],
  );

  return <SizeContext.Provider value={value}>{props.children}</SizeContext.Provider>;
}

export { SizeProvider };
