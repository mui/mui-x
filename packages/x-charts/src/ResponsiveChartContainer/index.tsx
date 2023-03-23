import * as React from 'react';
import { ResizeObserver } from '@juggle/resize-observer';
import { DrawingProvider } from '../context/DrawingProvider';
import {
  SeriesContextProvider,
  SeriesContextProviderProps,
} from '../context/SeriesContextProvider';
import { LayoutConfig } from '../models/layout';
import Surface from '../Surface';

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

type ChartContainerProps = LayoutConfig & SeriesContextProviderProps;

export function ResponsiveChartContainer(props: ChartContainerProps) {
  const { series, margin, children } = props;

  const [ref, width, height] = useChartDimensions();

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <DrawingProvider width={width} height={height} margin={margin}>
        <SeriesContextProvider series={series}>
          <Surface width={width} height={height}>
            {children}
          </Surface>
        </SeriesContextProvider>
      </DrawingProvider>
    </div>
  );
}
