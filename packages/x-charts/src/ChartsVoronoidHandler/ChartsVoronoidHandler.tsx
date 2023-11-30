import * as React from 'react';
import { Delaunay } from 'd3-delaunay';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { InteractionContext } from '../context/InteractionProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { SVGContext, DrawingContext } from '../context/DrawingProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { getValueToPositionMapper } from '../hooks/useScale';

function ChartsVoronoidHandler() {
  const svgRef = React.useContext(SVGContext);
  const { width, height, top, left } = React.useContext(DrawingContext);
  const { xAxis, yAxis, xAxisIds, yAxisIds } = React.useContext(CartesianContext);
  const { dispatch } = React.useContext(InteractionContext);

  const { series, seriesOrder } = React.useContext(SeriesContext).scatter ?? {};
  const voronoidRef = React.useRef<
    Record<string, { startIndex: number; endIndex: number }> & { delauney?: Delaunay<any> }
  >({});

  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  useEnhancedEffect(() => {
    if (seriesOrder === undefined || series === undefined) {
      // If there is no scatter chart series
      return;
    }

    const ids = seriesOrder.filter((id) => !series[id].disableVoronoid);

    voronoidRef.current = {};
    let points: number[] = [];
    ids.forEach((seriesId) => {
      const { data, xAxisKey, yAxisKey } = series[seriesId];

      const xScale = xAxis[xAxisKey ?? defaultXAxisId].scale;
      const yScale = yAxis[yAxisKey ?? defaultYAxisId].scale;

      const getXPosition = getValueToPositionMapper(xScale);
      const getYPosition = getValueToPositionMapper(yScale);

      const seriesPoints = data.flatMap(({ x, y }) => [getXPosition(x), getYPosition(y)]);
      voronoidRef.current[seriesId] = {
        startIndex: points.length,
        endIndex: points.length + seriesPoints.length,
      };
      points = points.concat(seriesPoints);
    });

    voronoidRef.current.delauney = new Delaunay(points);
  }, [defaultXAxisId, defaultYAxisId, series, seriesOrder, xAxis, yAxis]);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return undefined;
    }

    const handleMouseMove = (event: MouseEvent) => {
      // Get mouse coordinate in global SVG space
      const pt = svgRef.current!.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;
      const svgPt = pt.matrixTransform(svgRef.current!.getScreenCTM()!.inverse());

      // mousePosition.current = {
      //   x: svgPt.x,
      //   y: svgPt.y,
      // };

      const outsideX = svgPt.x < left || svgPt.x > left + width;
      const outsideY = svgPt.y < top || svgPt.y > top + height;
      if (outsideX || outsideY) {
        dispatch({ type: 'exitChart' });
        return;
      }

      const closestPointIndex = voronoidRef.current.delauney?.find(svgPt.x, svgPt.y);
      if (closestPointIndex !== undefined) {
        const seriesId = Object.keys(voronoidRef.current).find((id) => {
          if (id === 'delauney') {
            return false;
          }
          return (
            2 * closestPointIndex >= voronoidRef.current[id].startIndex &&
            2 * closestPointIndex < voronoidRef.current[id].endIndex
          );
        });
        if (seriesId === undefined) {
          return;
        }

        const dataIndex = (2 * closestPointIndex - voronoidRef.current[seriesId].startIndex) / 2;

        dispatch({ type: 'enterItem', data: { type: 'scatter', seriesId, dataIndex } });
      }

      // const newStateX = getUpdate(xAxis[usedXAxis], svgPt.x);
      // const newStateY = getUpdate(yAxis[usedYAxis], svgPt.y);

      // dispatch({ type: 'updateAxis', data: { x: newStateX, y: newStateY } });
    };

    // element.addEventListener('mouseout', handleMouseOut);
    element.addEventListener('mousemove', handleMouseMove);
    return () => {
      // element.removeEventListener('mouseout', handleMouseOut);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [svgRef, dispatch, left, width, top, height, yAxis, xAxis]);
  return null;
}
export default ChartsVoronoidHandler;
