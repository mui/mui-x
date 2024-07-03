import * as React from 'react';
import { ZoomContext } from './ZoomContext';

type ZoomProviderProps = {
  children: React.ReactNode;
};

export function ZoomProvider({ children }: ZoomProviderProps) {
  const [zoomRange, setZoomRange] = React.useState<[number, number]>([0, 100]);
  const [isInteracting, setIsInteracting] = React.useState<boolean>(false);

  const value = React.useMemo(
    () => ({
      isInitialized: true,
      data: {
        zoomRange,
        setZoomRange,
        isInteracting,
        setIsInteracting,
      },
    }),
    [zoomRange, setZoomRange, isInteracting, setIsInteracting],
  );

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>;
}
