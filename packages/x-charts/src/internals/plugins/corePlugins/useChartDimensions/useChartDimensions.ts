'use client';
/* eslint-disable react-compiler/react-compiler */
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import ownerWindow from '@mui/utils/ownerWindow';
import { DEFAULT_AXIS_SIZE, DEFAULT_MARGINS } from '../../../../constants';
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

  const addAxisSide = React.useCallback(
    (side: keyof typeof DEFAULT_AXIS_SIZE) => {
      store.update((prev) => axisUpdater(side, true, params, prev));
    },
    [store, params],
  );

  const removeAxisSide = React.useCallback(
    (side: keyof typeof DEFAULT_AXIS_SIZE) => {
      store.update((prev) => axisUpdater(side, false, params, prev));
    },
    [store, params],
  );

  return { instance: { isPointInside, addAxisSide, removeAxisSide } };
};

useChartDimensions.params = {
  width: true,
  height: true,
  margin: true,
  axisSize: true,
};

function axisUpdater(
  side: keyof typeof DEFAULT_AXIS_SIZE,
  enabled: boolean,
  params: UseChartDimensionsSignature['defaultizedParams'],
  prev: any,
): any {
  const enabledAxis = {
    ...prev.dimensions.enabledAxis,
    [side]: enabled,
  };

  return {
    ...prev,
    dimensions: {
      ...prev.dimensions,
      enabledAxis,
      left: params.margin.left + (enabledAxis.left ? params.axisSize.left : 0),
      top: params.margin.top + (enabledAxis.top ? params.axisSize.top : 0),
      right: params.margin.right + (enabledAxis.right ? params.axisSize.right : 0),
      bottom: params.margin.bottom + (enabledAxis.bottom ? params.axisSize.bottom : 0),
      width:
        params.width -
        params.margin.left -
        params.margin.right -
        (enabledAxis.left ? params.axisSize.left : 0) -
        (enabledAxis.right ? params.axisSize.right : 0),
      height:
        params.height -
        params.margin.top -
        params.margin.bottom -
        (enabledAxis.top ? params.axisSize.top : 0) -
        (enabledAxis.bottom ? params.axisSize.bottom : 0),
    },
  };
}

const defaultizeMargin = (
  input: UseChartDimensionsSignature['params']['margin'],
  defaultInput: typeof DEFAULT_MARGINS,
) => {
  if (!input) {
    return defaultInput;
  }

  if (typeof input === 'number') {
    return {
      top: input,
      bottom: input,
      left: input,
      right: input,
    };
  }

  return {
    ...defaultInput,
    ...input,
  };
};

useChartDimensions.getDefaultizedParams = ({ params }) => ({
  ...params,
  width: params.width ?? 0,
  height: params.height ?? 0,
  margin: defaultizeMargin(params.margin, DEFAULT_MARGINS),
  axisSize: defaultizeMargin(params.axisSize, DEFAULT_AXIS_SIZE),
});

useChartDimensions.getInitialState = ({ width, height, margin }) => {
  return {
    dimensions: {
      enabledAxis: {
        left: false,
        top: false,
        right: false,
        bottom: false,
      },
      left: margin.left,
      top: margin.top,
      right: margin.right,
      bottom: margin.bottom,
      width: (width ?? 0) - margin.left - margin.right,
      height: (height ?? 0) - margin.top - margin.bottom,
      propsWidth: width,
      propsHeight: height,
    },
  };
};
