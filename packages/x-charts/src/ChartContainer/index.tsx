import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { DrawingProvider, DrawingProviderProps } from '../context/DrawingProvider';
import {
  SeriesContextProvider,
  SeriesContextProviderProps,
} from '../context/SeriesContextProvider';
import { InteractionProvider } from '../context/InteractionProvider';
import { ChartsSurface, ChartsSurfaceProps } from '../ChartsSurface';
import {
  CartesianContextProvider,
  CartesianContextProviderProps,
} from '../context/CartesianContextProvider';
import { HighlightProvider } from '../context/HighlightProvider';

export type ChartContainerProps = Omit<
  ChartsSurfaceProps &
    SeriesContextProviderProps &
    Omit<DrawingProviderProps, 'svgRef'> &
    CartesianContextProviderProps,
  'children'
> & {
  children?: React.ReactNode;
};

export const ChartContainer = React.forwardRef(function ChartContainer(
  props: ChartContainerProps,
  ref,
) {
  const {
    width,
    height,
    series,
    margin,
    xAxis,
    yAxis,
    colors,
    dataset,
    sx,
    title,
    desc,
    disableAxisListener,
    children,
  } = props;
  const svgRef = React.useRef<SVGSVGElement>(null);
  const handleRef = useForkRef(ref, svgRef);

  return (
    <DrawingProvider width={width} height={height} margin={margin} svgRef={svgRef}>
      <SeriesContextProvider series={series} colors={colors} dataset={dataset}>
        <CartesianContextProvider xAxis={xAxis} yAxis={yAxis} dataset={dataset}>
          <InteractionProvider>
            <HighlightProvider>
              <ChartsSurface
                width={width}
                height={height}
                ref={handleRef}
                sx={sx}
                title={title}
                desc={desc}
                disableAxisListener={disableAxisListener}
              >
                {children}
              </ChartsSurface>
            </HighlightProvider>
          </InteractionProvider>
        </CartesianContextProvider>
      </SeriesContextProvider>
    </DrawingProvider>
  );
});
