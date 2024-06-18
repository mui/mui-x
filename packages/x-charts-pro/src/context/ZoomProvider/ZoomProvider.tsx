import * as React from 'react';
import { ZoomContext } from './ZoomContext';

type ZoomProviderProps = {
  children: React.ReactNode;
};

export function ZoomProvider({ children }: ZoomProviderProps) {
  const prevContext = React.useContext(ZoomContext);

  if (prevContext.isInitialized) {
    return children;
  }

  return <ZoomProviderReal>{children}</ZoomProviderReal>;
}

function ZoomProviderReal({ children }: ZoomProviderProps) {
  const [zoomRange, setZoomRange] = React.useState<[number, number]>([0, 100]);

  const value = React.useMemo(
    () => ({
      isInitialized: true,
      data: {
        zoomRange,
        setZoomRange,
      },
    }),
    [zoomRange, setZoomRange],
  );

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>;
}
