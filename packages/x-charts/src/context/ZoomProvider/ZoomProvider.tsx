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
  const [scaleX, setScaleX] = React.useState(1);
  const [scaleY, setScaleY] = React.useState(1);

  const value = React.useMemo(
    () => ({
      isInitialized: true,
      data: {
        scaleX,
        scaleY,
        setScaleX,
        setScaleY,
      },
    }),
    [scaleX, scaleY, setScaleX, setScaleY],
  );

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>;
}
