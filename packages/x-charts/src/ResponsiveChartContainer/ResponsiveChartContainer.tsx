import * as React from 'react';
import PropTypes from 'prop-types';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import ownerWindow from '@mui/utils/ownerWindow';
import { styled } from '@mui/material/styles';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';

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
      animationFrame = requestAnimationFrame(() => {
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
        `MUI X Charts: ChartContainer does not have \`width\` prop, and its container has no \`width\` defined.`,
      );
      displayError.current = false;
    }
    if (displayError.current && inHeight === undefined && height === 0) {
      console.error(
        `MUI X Charts: ChartContainer does not have \`height\` prop, and its container has no \`height\` defined.`,
      );
      displayError.current = false;
    }
  }

  return [rootRef, inWidth ?? width, inHeight ?? height];
};

export interface ResponsiveChartContainerProps
  extends Omit<ChartContainerProps, 'width' | 'height'> {
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   * @default undefined
   */
  width?: number;
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   * @default undefined
   */
  height?: number;
}

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

const ResponsiveChartContainer = React.forwardRef(function ResponsiveChartContainer(
  props: ResponsiveChartContainerProps,
  ref,
) {
  const { width: inWidth, height: inHeight, ...other } = props;
  const [containerRef, width, height] = useChartDimensions(inWidth, inHeight);

  return (
    <ResizableContainer ref={containerRef} ownerState={{ width: inWidth, height: inHeight }}>
      {width && height ? (
        <ChartContainer {...other} width={width} height={height} ref={ref} />
      ) : null}
    </ResizableContainer>
  );
});

ResponsiveChartContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset: PropTypes.arrayOf(PropTypes.object),
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   * @default undefined
   */
  height: PropTypes.number,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default object Depends on the charts type.
   */
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
  /**
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  title: PropTypes.string,
  viewBox: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   * @default undefined
   */
  width: PropTypes.number,
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used with id set to `DEFAULT_X_AXIS_KEY`.
   */
  xAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
  ),
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used with id set to `DEFAULT_Y_AXIS_KEY`.
   */
  yAxis: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      reverse: PropTypes.bool,
      scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
  ),
} as any;

export { ResponsiveChartContainer };
