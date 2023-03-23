import * as React from 'react';
import { DrawingProvider } from '../context/DrawingProvider';
import {
  SeriesContextProvider,
  SeriesContextProviderProps,
} from '../context/SeriesContextProvider';
import { TooltipProvider, TooltipProviderProps } from '../context/TooltipProvider';
import { LayoutConfig } from '../models/layout';
import { Surface } from '../Surface';

type ChartContainerProps = LayoutConfig & SeriesContextProviderProps & TooltipProviderProps;

export function ChartContainer(props: ChartContainerProps) {
  const { width, height, series, margin, trigger, children } = props;
  const ref = React.useRef<SVGSVGElement>(null);

  return (
    <DrawingProvider width={width} height={height} margin={margin} svgRef={ref}>
      <SeriesContextProvider series={series}>
        <TooltipProvider trigger={trigger}>
          <Surface width={width} height={height} ref={ref}>
            {children}
          </Surface>
        </TooltipProvider>
      </SeriesContextProvider>
    </DrawingProvider>
  );
}
