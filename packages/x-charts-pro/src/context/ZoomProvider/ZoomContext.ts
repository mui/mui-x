import * as React from 'react';
import { Initializable } from '@mui/x-charts/internals';
import { ZoomState } from './Zoom.types';

export const ZoomContext = React.createContext<Initializable<ZoomState>>({
  isInitialized: false,
  data: {
    isZoomEnabled: false,
    isPanEnabled: false,
    options: {},
    zoomData: [],
    setZoomData: () => {},
    isInteracting: false,
    setIsInteracting: () => {},
  },
});

if (process.env.NODE_ENV !== 'production') {
  ZoomContext.displayName = 'ZoomContext';
}
