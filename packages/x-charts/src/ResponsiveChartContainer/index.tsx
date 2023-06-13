import * as React from 'react';
import { ResizeObserver } from '@juggle/resize-observer';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';
import { MakeOptional } from '../models/helpers';

const useChartDimensions = (
  inWidth?: number,
  inHeight?: number,
): [React.RefObject<HTMLDivElement>, number, number] => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    const element = ref.current;
    if (element === null || (inHeight !== undefined && inWidth !== undefined)) {
      return () => {};
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (Array.isArray(entries) && entries.length) {
        const entry = entries[0];
        if (inWidth === undefined) {
          setWidth(entry.contentRect.width);
        }
        if (inHeight === undefined) {
          setHeight(entry.contentRect.height);
        }
      }
    });
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [height, inHeight, inWidth, width]);

  return [ref, inWidth ?? width, inHeight ?? height];
};

export type ResponsiveChartContainerProps = MakeOptional<ChartContainerProps, 'width' | 'height'>;

export function ResponsiveChartContainer(props: ResponsiveChartContainerProps) {
  const [containerRef, width, height] = useChartDimensions(props.width, props.height);

  return (
    <div
      ref={containerRef}
      style={{ width: props.width ?? '100%', height: props.height ?? '100%', padding: 0 }}
    >
      <ChartContainer {...props} width={width} height={height} />
    </div>
  );
}
