import * as React from 'react';
import { ResizeObserver } from '@juggle/resize-observer';
import { DrawingProvider } from '../context/DrawingProvider';
import { SeriesContextProvider } from '../context/SeriesContextProvider';
import { Surface } from '../Surface';
import { CartesianContextProvider } from '../context/CartesianContextProvider';
import { InteractionProvider } from '../context/InteractionProvider';
import { ChartContainerProps } from '../ChartContainer';
import { Tooltip } from '../Tooltip';

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

export type ResponsiveChartContainerProps = Omit<ChartContainerProps, 'width' | 'height'>;

export function ResponsiveChartContainer(props: ResponsiveChartContainerProps) {
  const { series, margin, xAxis, yAxis, colors, sx, title, desc, tooltip, children } = props;
  const ref = React.useRef<SVGSVGElement>(null);

  const [containerRef, width, height] = useChartDimensions();

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <DrawingProvider width={width} height={height} margin={margin} svgRef={ref}>
        <SeriesContextProvider series={series} colors={colors}>
          <CartesianContextProvider xAxis={xAxis} yAxis={yAxis}>
            <InteractionProvider>
              <Surface width={width} height={height} ref={ref} sx={sx} title={title} desc={desc}>
                {children}
                <Tooltip {...tooltip} />
              </Surface>
            </InteractionProvider>
          </CartesianContextProvider>
        </SeriesContextProvider>
      </DrawingProvider>
    </div>
  );
}
