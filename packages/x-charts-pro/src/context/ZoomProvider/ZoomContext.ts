import * as React from 'react';
import { Initializable } from '@mui/x-charts/internals';
import { DefaultizedZoomOptions, ZoomData } from './Zoom.types';

export type ZoomState = {
  isZoomEnabled: boolean;
  isPanEnabled: boolean;
  xOptions: DefaultizedZoomOptions[];
  yOptions: DefaultizedZoomOptions[];
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
    xOptions: [],
    yOptions: [],
    zoomData: [],
    setZoomData: () => {},
    isInteracting: false,
    setIsInteracting: () => {},
  },
});

if (process.env.NODE_ENV !== 'production') {
  ZoomContext.displayName = 'ZoomContext';
}
