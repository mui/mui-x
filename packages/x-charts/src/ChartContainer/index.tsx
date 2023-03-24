import * as React from 'react';
import { DrawingProvider } from '../context/DrawingProvider';
import {
  SeriesContextProvider,
  SeriesContextProviderProps,
} from '../context/SeriesContextProvider';
import { InteractionProvider } from '../context/InteractionProvider';
import { LayoutConfig } from '../models/layout';
import { Surface } from '../Surface';
import {
  CartesianContextProvider,
  CartesianContextProviderProps,
} from '../context/CartesianContextProvider';

export type ChartContainerProps = LayoutConfig &
  SeriesContextProviderProps &
  CartesianContextProviderProps;

export function ChartContainer(props: ChartContainerProps) {
  const { width, height, series, margin, xAxis, yAxis, children } = props;
  const ref = React.useRef<SVGSVGElement>(null);
  const interactionApiRef = React.useRef<any>(null);

  return (
    <DrawingProvider width={width} height={height} margin={margin} svgRef={ref}>
      <SeriesContextProvider series={series}>
        <CartesianContextProvider xAxis={xAxis} yAxis={yAxis}>
          <InteractionProvider interactionApiRef={interactionApiRef}>
            <Surface width={width} height={height} ref={ref} interactionApiRef={interactionApiRef}>
              {children}
            </Surface>
          </InteractionProvider>
        </CartesianContextProvider>
      </SeriesContextProvider>
    </DrawingProvider>
  );
}
