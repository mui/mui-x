import * as React from 'react';
import { AxisId, Initializable } from '@mui/x-charts/internals';
import { DefaultizedZoomOptions, ZoomData } from './Zoom.types';

export type ZoomState = {
  isZoomEnabled: boolean;
  isPanEnabled: boolean;
  options: Record<AxisId, DefaultizedZoomOptions>;
  zoomData: ZoomData[];
  setZoomData: (zoomData: ZoomData[]) => void;
  isInteracting: boolean;
  setIsInteracting: (isInteracting: boolean) => void;
};

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
