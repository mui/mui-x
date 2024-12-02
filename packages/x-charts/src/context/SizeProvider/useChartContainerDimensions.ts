'use client';
/* eslint-disable react-compiler/react-compiler */
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import ownerWindow from '@mui/utils/ownerWindow';

const MAX_COMPUTE_RUN = 10;

export const useChartContainerDimensions = (inWidth?: number, inHeight?: number) => {
  const hasInSize = inWidth !== undefined && inHeight !== undefined;
  const stateRef = React.useRef({ displayError: false, initialCompute: true, computeRun: 0 });
  const rootRef = React.useRef<SVGSVGElement>(null);

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  // Adaptation of the `computeSizeAndPublishResizeEvent` from the grid.
  const computeSize = React.useCallback(() => {
    const mainEl = rootRef?.current;

    if (!mainEl) {
      if (process.env.NODE_ENV !== 'production') {
        // This is mostly for internal use.
        throw new Error(
          [
            `MUI X: ChartContainer does not have a valid reference to the <svg /> element.`,
            'This may be caused by a ref forwarding issue.',
            'Make sure that the ref from SizedProvider is forwarded correctly.',
          ].join('\n'),
        );
      }

      return {};
    }

    const win = ownerWindow(mainEl);
    const computedStyle = win.getComputedStyle(mainEl);

    const newHeight = Math.floor(parseFloat(computedStyle.height)) || 0;
    const newWidth = Math.floor(parseFloat(computedStyle.width)) || 0;

    setWidth(newWidth);
    setHeight(newHeight);

    return { width: newWidth, height: newHeight };
  }, []);

  React.useEffect(() => {
    // Ensure the error detection occurs after the first rendering.
    stateRef.current.displayError = true;
  }, []);

  // This effect is used to compute the size of the container on the initial render.
  // It is not bound to the raf loop to avoid an unwanted "resize" event.
  // https://github.com/mui/mui-x/issues/13477#issuecomment-2336634785
  useEnhancedEffect(() => {
    // computeRun is used to avoid infinite loops.
    if (
      hasInSize ||
      !stateRef.current.initialCompute ||
      stateRef.current.computeRun > MAX_COMPUTE_RUN
    ) {
      return;
    }

    const computedSize = computeSize();
    if (computedSize.width !== width || computedSize.height !== height) {
      stateRef.current.computeRun += 1;
    } else if (stateRef.current.initialCompute) {
      stateRef.current.initialCompute = false;
    }
  }, [width, height, computeSize, hasInSize]);

  useEnhancedEffect(() => {
    if (hasInSize) {
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
      animationFrame = requestAnimationFrame(() => {
        computeSize();
      });
    });

    if (elementToObserve) {
      observer.observe(elementToObserve);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      if (elementToObserve) {
        observer.unobserve(elementToObserve);
      }
    };
  }, [computeSize, hasInSize]);

  if (process.env.NODE_ENV !== 'production') {
    if (stateRef.current.displayError && inWidth === undefined && width === 0) {
      console.error(
        `MUI X: ChartContainer does not have \`width\` prop, and its container has no \`width\` defined.`,
      );
      stateRef.current.displayError = false;
    }
    if (stateRef.current.displayError && inHeight === undefined && height === 0) {
      console.error(
        `MUI X: ChartContainer does not have \`height\` prop, and its container has no \`height\` defined.`,
      );
      stateRef.current.displayError = false;
    }
  }
  const finalWidth = inWidth ?? width;
  const finalHeight = inHeight ?? height;

  return {
    svgRef: rootRef,
    width: finalWidth,
    height: finalHeight,
    hasIntrinsicSize: finalWidth > 0 && finalHeight > 0,
    inWidth,
    inHeight,
  };
};
