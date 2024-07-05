import * as React from 'react';
import { Initializable } from '@mui/x-charts/internals';

export type ZoomState = {
  isZoomEnabled: boolean;
  isPanEnabled: boolean;
  zoomRange: [number, number];
  setZoomRange: (range: [number, number]) => void;
  isInteracting: boolean;
  setIsInteracting: (isInteracting: boolean) => void;
};

export const ZoomContext = React.createContext<Initializable<ZoomState>>({
  isInitialized: false,
  data: {
    isZoomEnabled: false,
    isPanEnabled: false,
    zoomRange: [0, 100],
    setZoomRange: () => {},
    isInteracting: false,
    setIsInteracting: () => {},
  },
});

if (process.env.NODE_ENV !== 'production') {
  ZoomContext.displayName = 'ZoomContext';
}
