import * as React from 'react';
import { ResizeObserver } from '@juggle/resize-observer';
import { DrawingProvider } from '../context/DrawingProvider';
import {
  SeriesContextProvider,
  SeriesContextProviderProps,
} from '../context/SeriesContextProvider';
import { LayoutConfig } from '../models/layout';
import { Surface } from '../Surface';
import {
  CartesianContextProvider,
  CartesianContextProviderProps,
} from '../context/CartesianContextProvider';
import { InteractionProvider } from '../context/InteractionProvider';

const useChartDimensions = (): [React.MutableRefObject<HTMLDivElement>, number, number] => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (Array.isArray(entries) && entries.length) {
        const entry = entries[0];
        setWidth(entry.contentRect.width);
        setHeight(entry.contentRect.height);
      }
    });
    // @ts-ignore
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [height, width]);

  // @ts-ignore
  return [ref, width, height];
};

type ChartContainerProps = LayoutConfig &
  SeriesContextProviderProps &
  CartesianContextProviderProps;

export function ResponsiveChartContainer(props: ChartContainerProps) {
  const { series, margin, xAxis, yAxis, children } = props;
  const ref = React.useRef<SVGSVGElement>(null);

  const [containerRef, width, height] = useChartDimensions();

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <DrawingProvider width={width} height={height} margin={margin} svgRef={ref}>
        <SeriesContextProvider series={series}>
          <CartesianContextProvider xAxis={xAxis} yAxis={yAxis}>
            <InteractionProvider>
              <Surface width={width} height={height} ref={ref}>
                {children}
              </Surface>
            </InteractionProvider>
          </CartesianContextProvider>
        </SeriesContextProvider>
      </DrawingProvider>
    </div>
  );
}
