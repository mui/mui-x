import * as React from 'react';
import { Initializable } from '../context.types';

export type ZoomState = {
  scaleX: number;
  scaleY: number;
  setScaleX: (x: number) => void;
  setScaleY: (y: number) => void;
};

export const ZoomContext = React.createContext<Initializable<ZoomState>>({
  isInitialized: false,
  data: {
    scaleX: 1,
    scaleY: 1,
    setScaleX: () => {},
    setScaleY: () => {},
  },
});

if (process.env.NODE_ENV !== 'production') {
  ZoomContext.displayName = 'ZoomContext';
}
