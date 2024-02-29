import * as React from 'react';
import PropTypes from 'prop-types';
import { Delaunay } from 'd3-delaunay';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { InteractionContext } from '../context/InteractionProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { SvgContext, DrawingContext } from '../context/DrawingProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { getValueToPositionMapper } from '../hooks/useScale';
import { getSVGPoint } from '../internals/utils';
import { ScatterItemIdentifier } from '../models';
import { SeriesId } from '../models/seriesType/common';

export type ChartsVoronoiHandlerProps = {
  /**
   * Defines the maximal distance between a scatter point and the pointer that triggers the interaction.
   * If `undefined`, the radius is assumed to be infinite.
   */
  voronoiMaxRadius?: number | undefined;
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event catched at the svg level
   * @param {ScatterItemIdentifier} scatterItemIdentifier Identify whihc item got clicked
   */
  onItemClick?: (event: MouseEvent, scatterItemIdentifier: ScatterItemIdentifier) => void;
};

function ChartsVoronoiHandler(props: ChartsVoronoiHandlerProps) {
  const { voronoiMaxRadius, onItemClick } = props;
  const svgRef = React.useContext(SvgContext);
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
    // This effect generate and store the Delaunay object that's used to map coordinate to closest point.

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

    // TODO: A perf optimisation of voronoi could be to use the last point as the intial point for the next search.
    function getClosestPoint(
      event: MouseEvent,
    ):
      | { seriesId: SeriesId; dataIndex: number }
      | 'outside-chart'
      | 'outside-voronoi-max-radius'
      | 'no-point-found' {
      // Get mouse coordinate in global SVG space
      const svgPoint = getSVGPoint(svgRef.current!, event);

      const outsideX = svgPoint.x < left || svgPoint.x > left + width;
      const outsideY = svgPoint.y < top || svgPoint.y > top + height;
      if (outsideX || outsideY) {
        return 'outside-chart';
      }

      if (!voronoiRef.current.delauney) {
        return 'no-point-found';
      }

      const closestPointIndex = voronoiRef.current.delauney?.find(svgPoint.x, svgPoint.y);
      if (closestPointIndex === undefined) {
        return 'no-point-found';
      }

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
        return 'no-point-found';
      }

      const dataIndex = (2 * closestPointIndex - voronoiRef.current[seriesId].startIndex) / 2;

      if (voronoiMaxRadius !== undefined) {
        const pointX = voronoiRef.current.delauney.points[2 * closestPointIndex];
        const pointY = voronoiRef.current.delauney.points[2 * closestPointIndex + 1];
        const dist2 = (pointX - svgPoint.x) ** 2 + (pointY - svgPoint.y) ** 2;
        if (dist2 > voronoiMaxRadius ** 2) {
          // The closest point is too far to be considered.
          return 'outside-voronoi-max-radius';
        }
      }
      return { seriesId, dataIndex };
    }

    const handleMouseOut = () => {
      dispatch({ type: 'exitChart' });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const closestPoint = getClosestPoint(event);

      if (closestPoint === 'outside-chart') {
        dispatch({ type: 'exitChart' });
        return;
      }

      if (closestPoint === 'outside-voronoi-max-radius' || closestPoint === 'no-point-found') {
        dispatch({ type: 'leaveItem', data: { type: 'scatter' } });
        return;
      }

      const { seriesId, dataIndex } = closestPoint;
      dispatch({ type: 'enterItem', data: { type: 'scatter', seriesId, dataIndex } });
    };

    const handleMouseClick = (event: MouseEvent) => {
      if (!onItemClick) {
        return;
      }
      const closestPoint = getClosestPoint(event);

      if (typeof closestPoint === 'string') {
        // No point fond for any reason
        return;
      }

      const { seriesId, dataIndex } = closestPoint;
      onItemClick(event, { type: 'scatter', seriesId, dataIndex });
    };

    element.addEventListener('mouseout', handleMouseOut);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleMouseClick);
    return () => {
      element.removeEventListener('mouseout', handleMouseOut);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleMouseClick);
    };
  }, [svgRef, dispatch, left, width, top, height, yAxis, xAxis, voronoiMaxRadius, onItemClick]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <React.Fragment />;
}

ChartsVoronoiHandler.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event catched at the svg level
   * @param {ScatterItemIdentifier} scatterItemIdentifier Identify whihc item got clicked
   */
  onItemClick: PropTypes.func,
  /**
   * Defines the maximal distance between a scatter point and the pointer that triggers the interaction.
   * If `undefined`, the radius is assumed to be infinite.
   */
  voronoiMaxRadius: PropTypes.number,
} as any;

export { ChartsVoronoiHandler };
