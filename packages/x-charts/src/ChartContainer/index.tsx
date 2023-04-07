import * as React from 'react';
import { DrawingProvider, DrawingProviderProps } from '../context/DrawingProvider';
import {
  SeriesContextProvider,
  SeriesContextProviderProps,
} from '../context/SeriesContextProvider';
import Surface, { SurfaceProps } from '../Surface';

type ChartContainerProps = SurfaceProps & SeriesContextProviderProps & DrawingProviderProps;

export function ChartContainer(props: ChartContainerProps) {
  const { width, height, series, margin, sx, title, desc, children } = props;

  return (
    <DrawingProvider width={width} height={height} margin={margin}>
      <SeriesContextProvider series={series}>
        <Surface width={width} height={height} sx={sx} title={title} desc={desc}>
          {children}
        </Surface>
      </SeriesContextProvider>
    </DrawingProvider>
  );
}
