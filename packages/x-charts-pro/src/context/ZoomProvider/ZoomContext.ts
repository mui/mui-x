import * as React from 'react';
import { Initializable } from '@mui/x-charts/internals';

export type ZoomState = {
  zoomRange: [number, number];
  setZoomRange: (range: [number, number]) => void;
};

export const ZoomContext = React.createContext<Initializable<ZoomState>>({
  isInitialized: false,
  data: {
    zoomRange: [0, 100],
    setZoomRange: () => {},
  },
});

if (process.env.NODE_ENV !== 'production') {
  ZoomContext.displayName = 'ZoomContext';
}
