import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import ownerWindow from '@mui/utils/ownerWindow';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';
import { MakeOptional } from '../models/helpers';

const useChartDimensions = (
  inWidth?: number,
  inHeight?: number,
): [React.RefObject<HTMLDivElement>, number, number] => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const displayError = React.useRef<boolean>(false);

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  const computeSizeAndPublishResizeEvent = React.useCallback(() => {
    const mainEl = rootRef?.current;

    if (!mainEl) {
      return;
    }

    const win = ownerWindow(mainEl);
    const computedStyle = win.getComputedStyle(mainEl);

    const newHeight = parseFloat(computedStyle.height) || 0;
    const newWidth = parseFloat(computedStyle.width) || 0;

    setWidth(newWidth);
    setHeight(newHeight);
  }, []);

  React.useEffect(() => {
    // Ensure the error detection occures after first rendering
    displayError.current = true;
  }, []);

  useEnhancedEffect(() => {
    if (inWidth !== undefined && inHeight !== undefined) {
      return () => {};
    }
    computeSizeAndPublishResizeEvent();

    const elementToObserve = rootRef.current;
    if (typeof ResizeObserver === 'undefined') {
      return () => {};
    }

    let animationFrame: number;
    const observer = new ResizeObserver(() => {
      // See https://github.com/mui/mui-x/issues/8733
      animationFrame = window.requestAnimationFrame(() => {
        computeSizeAndPublishResizeEvent();
      });
    });

    if (elementToObserve) {
      observer.observe(elementToObserve);
    }

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      if (elementToObserve) {
        observer.unobserve(elementToObserve);
      }
    };
  }, [computeSizeAndPublishResizeEvent, inHeight, inWidth]);

  if (process.env.NODE_ENV !== 'production') {
    if (displayError.current && inWidth === undefined && width === 0) {
      console.error(
        `MUI: Charts does not have \`width\` prop, and its container has no \`width\` defined.`,
      );
      displayError.current = false;
    }
    if (displayError.current && inHeight === undefined && height === 0) {
      console.error(
        `MUI: Charts does not have \`height\` prop, and its container has no \`height\` defined.`,
      );
      displayError.current = false;
    }
  }

  return [rootRef, inWidth ?? width, inHeight ?? height];
};

export type ResponsiveChartContainerProps = MakeOptional<ChartContainerProps, 'width' | 'height'>;

export function ResponsiveChartContainer(props: ResponsiveChartContainerProps) {
  const [containerRef, width, height] = useChartDimensions(props.width, props.height);

  return (
    <div
      ref={containerRef}
      style={{
        width: props.width ?? '100%',
        height: props.height ?? '100%',
        display: 'flex',
        position: 'relative',
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <ChartContainer {...props} width={width} height={height} />
    </div>
  );
}
