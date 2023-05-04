import * as React from 'react';
import { DrawingProvider, DrawingProviderProps } from '../context/DrawingProvider';
import {
  SeriesContextProvider,
  SeriesContextProviderProps,
} from '../context/SeriesContextProvider';
import { InteractionProvider } from '../context/InteractionProvider';
import { Surface, SurfaceProps } from '../Surface';
import {
  CartesianContextProvider,
  CartesianContextProviderProps,
} from '../context/CartesianContextProvider';
import { Tooltip, TooltipProps } from '../Tooltip';
import { Highlight, HighlightProps } from '../Highlight';
import { AxisInteractionListener } from '../hooks/useAxisEvents';

export type ChartContainerProps = Omit<
  SurfaceProps &
    SeriesContextProviderProps &
    Omit<DrawingProviderProps, 'svgRef'> &
    CartesianContextProviderProps,
  'children'
> & { children?: React.ReactNode; tooltip?: TooltipProps; highlight?: HighlightProps };

export function ChartContainer(props: ChartContainerProps) {
  const {
    width,
    height,
    series,
    margin,
    xAxis,
    yAxis,
    colors,
    sx,
    title,
    desc,
    tooltip,
    highlight = { x: 'line', y: 'none' },
    children,
  } = props;
  const ref = React.useRef<SVGSVGElement>(null);

  return (
    <DrawingProvider width={width} height={height} margin={margin} svgRef={ref}>
      <SeriesContextProvider series={series} colors={colors}>
        <CartesianContextProvider xAxis={xAxis} yAxis={yAxis}>
          <InteractionProvider>
            <Surface width={width} height={height} ref={ref} sx={sx} title={title} desc={desc}>
              <AxisInteractionListener
                listen={
                  tooltip?.trigger === 'axis' || highlight?.x !== 'none' || highlight?.y !== 'none'
                }
              />
              {children}
              <Highlight {...highlight} />
              <Tooltip {...tooltip} />
            </Surface>
          </InteractionProvider>
        </CartesianContextProvider>
      </SeriesContextProvider>
    </DrawingProvider>
  );
}
