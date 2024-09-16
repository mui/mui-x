'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import ownerWindow from '@mui/utils/ownerWindow';

export const useChartContainerDimensions = (
  inWidth?: number,
  inHeight?: number,
  resolveSizeBeforeRender?: boolean,
) => {
  const stateRef = React.useRef({ displayError: false, initialCompute: true, computeRun: 0 });
  const rootRef = React.useRef(null);

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  // Adaptation of the `computeSizeAndPublishResizeEvent` from the grid.
  const computeSize = React.useCallback(() => {
    const mainEl = rootRef?.current;

    if (!mainEl) {
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
      !resolveSizeBeforeRender ||
      !stateRef.current.initialCompute ||
      stateRef.current.computeRun > 20
    ) {
      return;
    }

    const computedSize = computeSize();
    if (computedSize.width !== width || computedSize.height !== height) {
      stateRef.current.computeRun += 1;
    } else if (stateRef.current.initialCompute) {
      stateRef.current.initialCompute = false;
    }
  }, [width, height, computeSize, resolveSizeBeforeRender]);

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
  }, [computeSize, inHeight, inWidth]);

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

  return { containerRef: rootRef, width: inWidth ?? width, height: inHeight ?? height };
};
