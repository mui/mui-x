import * as React from 'react';

export type ScaleParameters = {};

export const ChartScaleContext = React.createContext<ScaleParameters>({});

if (process.env.NODE_ENV !== 'production') {
  ChartScaleContext.displayName = 'ChartScaleContext';
}
