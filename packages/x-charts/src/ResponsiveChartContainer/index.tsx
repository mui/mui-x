import * as React from 'react';
import { ResizeObserver } from '@juggle/resize-observer';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';

const useChartDimensions = (): [React.RefObject<HTMLDivElement>, number, number] => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    const element = ref.current;
    if (element === null) {
      return () => {};
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (Array.isArray(entries) && entries.length) {
        const entry = entries[0];
        setWidth(entry.contentRect.width);
        setHeight(entry.contentRect.height);
      }
    });
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [height, width]);

  return [ref, width, height];
};

export type ResponsiveChartContainerProps = Omit<ChartContainerProps, 'width' | 'height'>;

export function ResponsiveChartContainer(props: ResponsiveChartContainerProps) {
  const [containerRef, width, height] = useChartDimensions();

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <ChartContainer {...props} width={width} height={height} />
    </div>
  );
}
