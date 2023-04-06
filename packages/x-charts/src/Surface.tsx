import { styled, SxProps, Theme } from '@mui/system';
import * as React from 'react';
import { isBandScale } from './hooks/useScale';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from './constants';
import { CartesianContext } from './context/CartesianContextProvider';
import { InteractionContext } from './context/InteractionProvider';
import { DrawingContext } from './context/DrawingProvider';

type ViewBox = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};
export interface SurfaceProps {
  width: number;
  height: number;
  interactionApiRef: React.RefObject<any>;
  viewBox?: ViewBox;
  className?: string;
  title?: string;
  desc?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

const useAxisEvents = (interactionApiRef: React.RefObject<any>) => {
  const { width, height, top, left } = React.useContext(DrawingContext);
  const { xAxis, yAxis } = React.useContext(CartesianContext);
  const { dispatch } = React.useContext(InteractionContext);

  const [usedXAxis, setUsedXAxis] = React.useState<string | null>(null);
  const [usedYAxis, setUsedYAxis] = React.useState<string | null>(null);

  React.useImperativeHandle(
    interactionApiRef,
    () => {
      return {
        /**
         * Ask to list mouse event to get update on active x value.
         * @param axisId the id of the axis to listen. Use null to stop listening.
         */
        listenXAxis: (axisId?: string | null) => {
          setUsedXAxis(axisId === undefined ? DEFAULT_X_AXIS_KEY : axisId);
        },
        listenYAxis: (axisId?: string | null) => {
          setUsedYAxis(axisId === undefined ? DEFAULT_Y_AXIS_KEY : axisId);
        },
      };
    },
    [],
  );

  // Use a ref to avoid rerendering on every mousemove event.
  const mousePosition = React.useRef({
    x: -1,
    y: -1,
  });

  const getUpdateY = React.useCallback(
    (y: number) => {
      if (usedYAxis === null) {
        return null;
      }
      const { scale: yScale, data: yAxisData } = yAxis[usedYAxis];
      if (!isBandScale(yScale)) {
        return { value: yScale.invert(y) };
      }
      const dataIndex = Math.floor((y - yScale.range()[0]) / yScale.step());
      if (dataIndex < 0 || dataIndex >= yAxisData!.length) {
        return null;
      }
      return {
        index: dataIndex,
        value: yAxisData![dataIndex],
      };
    },
    [usedYAxis, yAxis],
  );

  const getUpdateX = React.useCallback(
    (x: number) => {
      if (usedXAxis === null) {
        return null;
      }
      const { scale: xScale, data: xAxisData } = xAxis[usedXAxis];
      if (!isBandScale(xScale)) {
        return { value: xScale.invert(x) };
      }
      const dataIndex = Math.floor((x - xScale.range()[0]) / xScale.step());
      if (dataIndex < 0 || dataIndex >= xAxisData!.length) {
        return null;
      }
      return {
        index: dataIndex,
        value: xAxisData![dataIndex],
      };
    },
    [usedXAxis, xAxis],
  );

  const handleMouseOut = () => {
    mousePosition.current = {
      x: -1,
      y: -1,
    };
    dispatch({ type: 'updateAxis', data: { x: null, y: null } });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    mousePosition.current = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
    const outsideX = event.nativeEvent.offsetX < left || event.nativeEvent.offsetX > left + width;
    const outsideY = event.nativeEvent.offsetY < top || event.nativeEvent.offsetY > top + height;
    if (outsideX || outsideY) {
      dispatch({ type: 'updateAxis', data: { x: null, y: null } });
      return;
    }
    const newStateX = getUpdateX(event.nativeEvent.offsetX);
    const newStateY = getUpdateY(event.nativeEvent.offsetY);

    dispatch({ type: 'updateAxis', data: { x: newStateX, y: newStateY } });
  };
  return { handleMouseOut, handleMouseMove };
};

const ChartSurfaceStyles = styled('svg', {
  name: 'MuiChartsSurface',
  slot: 'Root',
})(() => ({}));

export const Surface = React.forwardRef<SVGSVGElement, SurfaceProps>(function Surface(
  props: SurfaceProps,
  ref,
) {
  const { children, width, height, viewBox, interactionApiRef, className, ...other } = props;
  const svgView = { width, height, x: 0, y: 0, ...viewBox };

  const { handleMouseOut, handleMouseMove } = useAxisEvents(interactionApiRef);

  return (
    <ChartSurfaceStyles
      width={width}
      height={height}
      viewBox={`${svgView.x} ${svgView.y} ${svgView.width} ${svgView.height}`}
      ref={ref}
      {...other}
      onMouseOut={handleMouseOut}
      onMouseMove={handleMouseMove}
    >
      <title>{props.title}</title>
      <desc>{props.desc}</desc>
      {children}
    </ChartSurfaceStyles>
  );
});
