import * as React from 'react';
import { DrawingProvider, DrawingProviderProps } from '../context/DrawingProvider';
import {
  SeriesContextProvider,
  SeriesContextProviderProps,
} from '../context/SeriesContextProvider';
import { InteractionProvider } from '../context/InteractionProvider';
import { Highlight } from '../Highlight';
import { Surface, SurfaceProps } from '../Surface';
import {
  CartesianContextProvider,
  CartesianContextProviderProps,
} from '../context/CartesianContextProvider';

export type ChartContainerProps = Omit<
  Omit<SurfaceProps, 'interactionApiRef'> &
    SeriesContextProviderProps &
    Omit<DrawingProviderProps, 'svgRef'> &
    CartesianContextProviderProps,
  'children'
> & { children?: React.ReactNode };

export function ChartContainer(props: ChartContainerProps) {
  const { width, height, series, margin, xAxis, yAxis, sx, title, desc, children } = props;
  const ref = React.useRef<SVGSVGElement>(null);
  const interactionApiRef = React.useRef<any>(null);

  return (
    <DrawingProvider width={width} height={height} margin={margin} svgRef={ref}>
      <SeriesContextProvider series={series}>
        <CartesianContextProvider xAxis={xAxis} yAxis={yAxis}>
          <InteractionProvider interactionApiRef={interactionApiRef}>
            <Surface
              width={width}
              height={height}
              ref={ref}
              interactionApiRef={interactionApiRef}
              sx={sx}
              title={title}
              desc={desc}
            >
              <Highlight />
              {children}
            </Surface>
          </InteractionProvider>
        </CartesianContextProvider>
      </SeriesContextProvider>
    </DrawingProvider>
  );
}
