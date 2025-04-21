'use client';
 
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import ownerWindow from '@mui/utils/ownerWindow';
import { DEFAULT_MARGINS } from '../../../../constants';
import { ChartPlugin } from '../../models';
import type { UseChartDimensionsSignature } from './useChartDimensions.types';
import { selectorChartDrawingArea } from './useChartDimensions.selectors';
import { defaultizeMargin } from '../../../defaultizeMargin';

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
      if (prev.dimensions.width === newWidth && prev.dimensions.height === newHeight) {
        return prev;
      }

      return {
        ...prev,
        dimensions: {
          margin: {
            top: params.margin.top,
            right: params.margin.right,
            bottom: params.margin.bottom,
            left: params.margin.left,
          },
          width: params.width ?? newWidth,
          height: params.height ?? newHeight,
          propsWidth: params.width,
          propsHeight: params.height,
        },
      };
    });
    return {
      height: newHeight,
      width: newWidth,
    };
  }, [
    store,
    svgRef,
    params.height,
    params.width,
    // Margin is an object, so we need to include all the properties to prevent infinite loops.
    params.margin.left,
    params.margin.right,
    params.margin.top,
    params.margin.bottom,
  ]);

  React.useEffect(() => {
    store.update((prev) => {
      const width = params.width ?? prev.dimensions.width;
      const height = params.height ?? prev.dimensions.height;

      return {
        ...prev,
        dimensions: {
          margin: {
            top: params.margin.top,
            right: params.margin.right,
            bottom: params.margin.bottom,
            left: params.margin.left,
          },
          width,
          height,
          propsHeight: params.height,
          propsWidth: params.width,
        },
      };
    });
  }, [
    store,
    params.height,
    params.width,
    // Margin is an object, so we need to include all the properties to prevent infinite loops.
    params.margin.left,
    params.margin.right,
    params.margin.top,
    params.margin.bottom,
  ]);

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

      const drawingArea = selectorChartDrawingArea(store.value);

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
  margin: defaultizeMargin(params.margin, DEFAULT_MARGINS),
});

useChartDimensions.getInitialState = ({ width, height, margin }) => {
  return {
    dimensions: {
      margin,
      width: width ?? 0,
      height: height ?? 0,
      propsWidth: width,
      propsHeight: height,
    },
  };
};
