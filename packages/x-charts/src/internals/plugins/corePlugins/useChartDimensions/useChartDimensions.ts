'use client';
/* eslint-disable react-compiler/react-compiler */
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import ownerWindow from '@mui/utils/ownerWindow';
import { DEFAULT_MARGINS } from '../../../../constants';
import { ChartPlugin } from '../../models';
import { UseChartDimensionsSignature } from './useChartDimensions.types';
import { selectorChartDimensionsState } from './useChartDimensions.selectors';

const MAX_COMPUTE_RUN = 10;

export const useChartDimensions: ChartPlugin<UseChartDimensionsSignature> = ({
  params,
  store,
  svgRef,
}) => {
  const hasInSize = params.width !== undefined && params.height !== undefined;
  const stateRef = React.useRef({ displayError: false, initialCompute: true, computeRun: 0 });
  // States only used for the initialization of the size.
  const [innerWidth, setInnerWidth] = React.useState(0);
  const [innerHeight, setInnerHeight] = React.useState(0);

  const computeSize = React.useCallback(() => {
    const mainEl = svgRef?.current;

    if (!mainEl) {
      return {};
    }

    const win = ownerWindow(mainEl);
    const computedStyle = win.getComputedStyle(mainEl);

    const newHeight = Math.floor(parseFloat(computedStyle.height)) || 0;
    const newWidth = Math.floor(parseFloat(computedStyle.width)) || 0;

    store.update((prev) => {
      const prevWidth = prev.dimensions.width + prev.dimensions.left + prev.dimensions.right;
      const prevHeight = prev.dimensions.height + prev.dimensions.top + prev.dimensions.bottom;

      if (prevWidth === newWidth && prevHeight === newHeight) {
        return prev;
      }

      return {
        ...prev,
        dimensions: {
          ...prev.dimensions,
          width: newWidth - prev.dimensions.left - prev.dimensions.right,
          height: newHeight - prev.dimensions.top - prev.dimensions.bottom,
        },
      };
    });
    return {
      height: newHeight,
      width: newWidth,
    };
  }, [store, svgRef]);

  store.update((prev) => {
    if (
      (params.width === undefined || prev.dimensions.propsWidth === params.width) &&
      (params.height === undefined || prev.dimensions.propsHeight === params.height)
    ) {
      return prev;
    }

    return {
      ...prev,
      dimensions: {
        ...prev.dimensions,
        width:
          params.width === undefined
            ? prev.dimensions.width
            : params.width - prev.dimensions.left - prev.dimensions.right,
        height:
          params.height === undefined
            ? prev.dimensions.height
            : params.height - prev.dimensions.top - prev.dimensions.bottom,
        propsWidth: params.width,
        propsHeight: params.height,
      },
    };
  });

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

    if (computedSize.width !== innerWidth || computedSize.height !== innerHeight) {
      stateRef.current.computeRun += 1;
      if (computedSize.width !== undefined) {
        setInnerWidth(computedSize.width);
      }
      if (computedSize.height !== undefined) {
        setInnerHeight(computedSize.height);
      }
    } else if (stateRef.current.initialCompute) {
      stateRef.current.initialCompute = false;
    }
  }, [innerHeight, innerWidth, computeSize, hasInSize]);

  useEnhancedEffect(() => {
    if (hasInSize) {
      return () => {};
    }
    computeSize();

    const elementToObserve = svgRef.current;
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
  }, [computeSize, hasInSize, svgRef]);

  if (process.env.NODE_ENV !== 'production') {
    if (stateRef.current.displayError && params.width === undefined && innerWidth === 0) {
      console.error(
        `MUI X: ChartContainer does not have \`width\` prop, and its container has no \`width\` defined.`,
      );
      stateRef.current.displayError = false;
    }
    if (stateRef.current.displayError && params.height === undefined && innerHeight === 0) {
      console.error(
        `MUI X: ChartContainer does not have \`height\` prop, and its container has no \`height\` defined.`,
      );
      stateRef.current.displayError = false;
    }
  }

  const isPointInside = React.useCallback(
    (
      { x, y }: { x: number; y: number },
      options?: {
        targetElement?: Element;
        direction?: 'x' | 'y';
      },
    ) => {
      // For element allowed to overflow, wrapping them in <g data-drawing-container /> make them fully part of the drawing area.
      if (options?.targetElement && options?.targetElement.closest('[data-drawing-container]')) {
        return true;
      }
      const drawingArea = selectorChartDimensionsState(store.value);

      const isInsideX = x >= drawingArea.left - 1 && x <= drawingArea.left + drawingArea.width;
      const isInsideY = y >= drawingArea.top - 1 && y <= drawingArea.top + drawingArea.height;

      if (options?.direction === 'x') {
        return isInsideX;
      }

      if (options?.direction === 'y') {
        return isInsideY;
      }

      return isInsideX && isInsideY;
    },
    [store.value],
  );

  return { instance: { isPointInside } };
};

useChartDimensions.params = {
  width: true,
  height: true,
  margin: true,
};

useChartDimensions.getDefaultizedParams = ({ params }) => ({
  ...params,
  margin: params.margin ? { ...DEFAULT_MARGINS, ...params.margin } : DEFAULT_MARGINS,
});

useChartDimensions.getInitialState = ({ width, height, margin }) => ({
  dimensions: {
    ...margin,
    width: (width ?? 0) - margin.left - margin.right,
    height: (height ?? 0) - margin.top - margin.bottom,
    propsWidth: width,
    propsHeight: height,
  },
});
