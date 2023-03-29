import * as React from 'react';
import { DrawingProvider } from '../context/DrawingProvider';
import {
  SeriesContextProvider,
  SeriesContextProviderProps,
} from '../context/SeriesContextProvider';
import { LayoutConfig } from '../models/layout';
import Surface from '../Surface';

type ChartContainerProps = LayoutConfig & SeriesContextProviderProps;

export function ChartContainer(props: ChartContainerProps) {
  const { width, height, series, margin, children } = props;

  return (
    <DrawingProvider width={width} height={height} margin={margin}>
      <SeriesContextProvider series={series}>
        <Surface width={width} height={height}>
          {children}
        </Surface>
      </SeriesContextProvider>
    </DrawingProvider>
  );
}
