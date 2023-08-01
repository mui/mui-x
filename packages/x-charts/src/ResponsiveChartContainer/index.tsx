import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import ownerWindow from '@mui/utils/ownerWindow';
import { styled } from '@mui/material/styles';
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

  // Adaptation of the `computeSizeAndPublishResizeEvent` from the grid.
  const computeSize = React.useCallback(() => {
    const mainEl = rootRef?.current;

    if (!mainEl) {
      return;
    }

    const win = ownerWindow(mainEl);
    const computedStyle = win.getComputedStyle(mainEl);

    const newHeight = Math.floor(parseFloat(computedStyle.height)) || 0;
    const newWidth = Math.floor(parseFloat(computedStyle.width)) || 0;

    setWidth(newWidth);
    setHeight(newHeight);
  }, []);

  React.useEffect(() => {
    // Ensure the error detection occurs after the first rendering.
    displayError.current = true;
  }, []);

  useEnhancedEffect(() => {
    if (inWidth !== undefined && inHeight !== undefined) {
      return () => {};
    }
    computeSize();

    const elementToObserve = rootRef.current;
    if (typeof ResizeObserver === 'undefined') {
      return () => {};
    }

    let animationFrame: number;
    const observer = new ResizeObserver(() => {
      // See https://github.com/mui/mui-x/issues/8733
      animationFrame = window.requestAnimationFrame(() => {
        computeSize();
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
  }, [computeSize, inHeight, inWidth]);

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

const ResizableContainer = styled('div', {
  name: 'MuiResponsiveChart',
  slot: 'Container',
})<{ ownerState: Pick<ResponsiveChartContainerProps, 'width' | 'height'> }>(({ ownerState }) => ({
  width: ownerState.width ?? '100%',
  height: ownerState.height ?? '100%',
  display: 'flex',
  position: 'relative',
  flexGrow: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '&>svg': {
    width: '100%',
    height: '100%',
  },
}));

export const ResponsiveChartContainer = React.forwardRef(function ResponsiveChartContainer(
  props: ResponsiveChartContainerProps,
  ref,
) {
  const { width: inWidth, height: inHeight, ...other } = props;
  const [containerRef, width, height] = useChartDimensions(inWidth, inHeight);

  return (
    <ResizableContainer ref={containerRef} ownerState={{ width: inWidth, height: inHeight }}>
      <ChartContainer {...other} width={width} height={height} ref={ref} />
    </ResizableContainer>
  );
});
