import * as React from 'react';
import { ColorProcessorsConfig } from '../models';
import { ChartSeriesType } from '../models/seriesType/config';

export interface ColorProviderProps {
  children: React.ReactNode;
  /**
   * A mapping defining for each series type how to get item colors.
   */
  colorProcessors: ColorProcessorsConfig<ChartSeriesType>;
}
export const ColorContext = React.createContext<ColorProviderProps['colorProcessors']>({});

if (process.env.NODE_ENV !== 'production') {
  ColorContext.displayName = 'ColorContext';
}

export function ColorProvider(props: ColorProviderProps) {
  const { colorProcessors, children } = props;

  return <ColorContext.Provider value={colorProcessors}>{children}</ColorContext.Provider>;
}
