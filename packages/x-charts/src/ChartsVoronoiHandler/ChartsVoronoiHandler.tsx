import * as React from 'react';
import { Delaunay } from 'd3-delaunay';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { InteractionContext } from '../context/InteractionProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { SVGContext, DrawingContext } from '../context/DrawingProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { getValueToPositionMapper } from '../hooks/useScale';

export type ChartsVoronoiHandlerProps = {
  /**
   * Defines the maximal distance between scatter point and mouse that triggers the interaction.
   * If undefined, the radius is assume to be infinit.
   * @default undefined
   */
  voronoiMaxRadius?: number;
};
function ChartsVoronoiHandler(props: ChartsVoronoiHandlerProps) {
  const { voronoiMaxRadius } = props;
  const svgRef = React.useContext(SVGContext);
  const { width, height, top, left } = React.useContext(DrawingContext);
  const { xAxis, yAxis, xAxisIds, yAxisIds } = React.useContext(CartesianContext);
  const { dispatch } = React.useContext(InteractionContext);

  const { series, seriesOrder } = React.useContext(SeriesContext).scatter ?? {};
  const voronoiRef = React.useRef<
    Record<string, { startIndex: number; endIndex: number }> & { delauney?: Delaunay<any> }
  >({});

  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  useEnhancedEffect(() => {
    dispatch({ type: 'updateVoronoiUsage', useVoronoiInteraction: true });
    return () => {
      dispatch({ type: 'updateVoronoiUsage', useVoronoiInteraction: false });
    };
  }, [dispatch]);

  useEnhancedEffect(() => {
    if (seriesOrder === undefined || series === undefined) {
      // If there is no scatter chart series
      return;
    }

    voronoiRef.current = {};
    let points: number[] = [];
    seriesOrder.forEach((seriesId) => {
      const { data, xAxisKey, yAxisKey } = series[seriesId];

      const xScale = xAxis[xAxisKey ?? defaultXAxisId].scale;
      const yScale = yAxis[yAxisKey ?? defaultYAxisId].scale;

      const getXPosition = getValueToPositionMapper(xScale);
      const getYPosition = getValueToPositionMapper(yScale);

      const seriesPoints = data.flatMap(({ x, y }) => [getXPosition(x), getYPosition(y)]);
      voronoiRef.current[seriesId] = {
        startIndex: points.length,
        endIndex: points.length + seriesPoints.length,
      };
      points = points.concat(seriesPoints);
    });

    voronoiRef.current.delauney = new Delaunay(points);
  }, [defaultXAxisId, defaultYAxisId, series, seriesOrder, xAxis, yAxis]);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return undefined;
    }

    const handleMouseOut = () => {
      dispatch({ type: 'exitChart' });
    };

    // TODO: A perf optimisation of voronoi could be to use the last point as the intial point for the next search.
    const handleMouseMove = (event: MouseEvent) => {
      // Get mouse coordinate in global SVG space
      const pt = svgRef.current!.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;
      const svgPt = pt.matrixTransform(svgRef.current!.getScreenCTM()!.inverse());

      const outsideX = svgPt.x < left || svgPt.x > left + width;
      const outsideY = svgPt.y < top || svgPt.y > top + height;
      if (outsideX || outsideY) {
        dispatch({ type: 'exitChart' });
        return;
      }

      if (!voronoiRef.current.delauney) {
        return;
      }

      const closestPointIndex = voronoiRef.current.delauney?.find(svgPt.x, svgPt.y);
      if (closestPointIndex !== undefined) {
        const seriesId = Object.keys(voronoiRef.current).find((id) => {
          if (id === 'delauney') {
            return false;
          }
          return (
            2 * closestPointIndex >= voronoiRef.current[id].startIndex &&
            2 * closestPointIndex < voronoiRef.current[id].endIndex
          );
        });
        if (seriesId === undefined) {
          return;
        }

        const dataIndex = (2 * closestPointIndex - voronoiRef.current[seriesId].startIndex) / 2;

        if (voronoiMaxRadius !== undefined) {
          const pointX = voronoiRef.current.delauney.points[2 * closestPointIndex];
          const pointY = voronoiRef.current.delauney.points[2 * closestPointIndex + 1];
          const dist2 = (pointX - svgPt.x) ** 2 + (pointY - svgPt.y) ** 2;
          if (dist2 > voronoiMaxRadius ** 2) {
            // The closest point is to far to be considered.
            dispatch({ type: 'leaveItem', data: { type: 'scatter', seriesId, dataIndex } });
            return;
          }
        }
        dispatch({ type: 'enterItem', data: { type: 'scatter', seriesId, dataIndex } });
      }
    };

    element.addEventListener('mouseout', handleMouseOut);
    element.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mouseout', handleMouseOut);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [svgRef, dispatch, left, width, top, height, yAxis, xAxis, voronoiMaxRadius]);
  return null;
}
export default ChartsVoronoiHandler;
