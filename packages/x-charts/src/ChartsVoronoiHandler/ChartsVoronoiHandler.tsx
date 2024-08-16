import * as React from 'react';
import PropTypes from 'prop-types';
import { Delaunay } from '@mui/x-charts-vendor/d3-delaunay';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { InteractionContext } from '../context/InteractionProvider';
import { useCartesianContext } from '../context/CartesianProvider';
import { getValueToPositionMapper } from '../hooks/useScale';
import { getSVGPoint } from '../internals/getSVGPoint';
import { ScatterItemIdentifier } from '../models';
import { SeriesId } from '../models/seriesType/common';
import { useDrawingArea, useSvgRef } from '../hooks';
import { useHighlighted } from '../context';
import { useScatterSeries } from '../hooks/useSeries';

export type ChartsVoronoiHandlerProps = {
  /**
   * Defines the maximal distance between a scatter point and the pointer that triggers the interaction.
   * If `undefined`, the radius is assumed to be infinite.
   */
  voronoiMaxRadius?: number | undefined;
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event caught at the svg level
   * @param {ScatterItemIdentifier} scatterItemIdentifier Identify which item got clicked
   */
  onItemClick?: (event: MouseEvent, scatterItemIdentifier: ScatterItemIdentifier) => void;
};

type VoronoiSeries = { seriesId: SeriesId; startIndex: number; endIndex: number };

function ChartsVoronoiHandler(props: ChartsVoronoiHandlerProps) {
  const { voronoiMaxRadius, onItemClick } = props;
  const svgRef = useSvgRef();
  const drawingArea = useDrawingArea();
  const { xAxis, yAxis, xAxisIds, yAxisIds } = useCartesianContext();
  const { dispatch } = React.useContext(InteractionContext);

  const { series, seriesOrder } = useScatterSeries() ?? {};
  const voronoiRef = React.useRef<Record<string, VoronoiSeries>>({});
  const delauneyRef = React.useRef<Delaunay<any> | undefined>(undefined);
  const lastFind = React.useRef<number | undefined>(undefined);

  const { setHighlighted, clearHighlighted } = useHighlighted();

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
      const { data, xAxisId, yAxisId, xAxisKey, yAxisKey } = series[seriesId];

      const xScale = xAxis[xAxisId ?? xAxisKey ?? defaultXAxisId].scale;
      const yScale = yAxis[yAxisId ?? yAxisKey ?? defaultYAxisId].scale;

      const getXPosition = getValueToPositionMapper(xScale);
      const getYPosition = getValueToPositionMapper(yScale);

      const seriesPoints = data.flatMap(({ x, y }) => {
        const pointX = getXPosition(x);
        const pointY = getYPosition(y);

        if (!drawingArea.isPointInside({ x: pointX, y: pointY })) {
          // If the point is not displayed we move them to a trash coordinate.
          // This avoids managing index mapping before/after filtering.
          // The trash point is far enough such that any point in the drawing area will be closer to the mouse than the trash coordinate.
          return [-drawingArea.width, -drawingArea.height];
        }

        return [pointX, pointY];
      });

      voronoiRef.current[seriesId] = {
        seriesId,
        startIndex: points.length,
        endIndex: points.length + seriesPoints.length,
      };
      points = points.concat(seriesPoints);
    });

    delauneyRef.current = new Delaunay(points);
    lastFind.current = undefined;
  }, [defaultXAxisId, defaultYAxisId, series, seriesOrder, xAxis, yAxis, drawingArea]);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return undefined;
    }

    function getClosestPoint(
      event: MouseEvent,
    ):
      | { seriesId: SeriesId; dataIndex: number }
      | 'outside-chart'
      | 'outside-voronoi-max-radius'
      | 'no-point-found' {
      // Get mouse coordinate in global SVG space
      const svgPoint = getSVGPoint(element, event);

      if (!drawingArea.isPointInside(svgPoint)) {
        lastFind.current = undefined;
        return 'outside-chart';
      }

      if (!delauneyRef.current) {
        return 'no-point-found';
      }

      const closestPointIndex = delauneyRef.current.find(svgPoint.x, svgPoint.y, lastFind.current);
      if (closestPointIndex === undefined) {
        return 'no-point-found';
      }

      lastFind.current = closestPointIndex;
      const closestSeries = Object.values(voronoiRef.current).find((value) => {
        return 2 * closestPointIndex >= value.startIndex && 2 * closestPointIndex < value.endIndex;
      });

      if (closestSeries === undefined) {
        return 'no-point-found';
      }

      const dataIndex =
        (2 * closestPointIndex - voronoiRef.current[closestSeries.seriesId].startIndex) / 2;

      if (voronoiMaxRadius !== undefined) {
        const pointX = delauneyRef.current.points[2 * closestPointIndex];
        const pointY = delauneyRef.current.points[2 * closestPointIndex + 1];
        const dist2 = (pointX - svgPoint.x) ** 2 + (pointY - svgPoint.y) ** 2;
        if (dist2 > voronoiMaxRadius ** 2) {
          // The closest point is too far to be considered.
          return 'outside-voronoi-max-radius';
        }
      }
      return { seriesId: closestSeries.seriesId, dataIndex };
    }

    const handleMouseLeave = () => {
      dispatch({ type: 'exitChart' });
      clearHighlighted();
    };

    const handleMouseMove = (event: MouseEvent) => {
      const closestPoint = getClosestPoint(event);

      if (closestPoint === 'outside-chart') {
        dispatch({ type: 'exitChart' });
        clearHighlighted();
        return;
      }

      if (closestPoint === 'outside-voronoi-max-radius' || closestPoint === 'no-point-found') {
        dispatch({ type: 'leaveItem', data: { type: 'scatter' } });
        clearHighlighted();
        return;
      }

      const { seriesId, dataIndex } = closestPoint;
      dispatch({ type: 'enterItem', data: { type: 'scatter', seriesId, dataIndex } });
      setHighlighted({
        seriesId,
        dataIndex,
      });
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

    element.addEventListener('pointerleave', handleMouseLeave);
    element.addEventListener('pointermove', handleMouseMove);
    element.addEventListener('click', handleMouseClick);
    return () => {
      element.removeEventListener('pointerleave', handleMouseLeave);
      element.removeEventListener('pointermove', handleMouseMove);
      element.removeEventListener('click', handleMouseClick);
    };
  }, [
    svgRef,
    dispatch,
    yAxis,
    xAxis,
    voronoiMaxRadius,
    onItemClick,
    setHighlighted,
    clearHighlighted,
    drawingArea,
  ]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <React.Fragment />;
}

ChartsVoronoiHandler.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event caught at the svg level
   * @param {ScatterItemIdentifier} scatterItemIdentifier Identify which item got clicked
   */
  onItemClick: PropTypes.func,
  /**
   * Defines the maximal distance between a scatter point and the pointer that triggers the interaction.
   * If `undefined`, the radius is assumed to be infinite.
   */
  voronoiMaxRadius: PropTypes.number,
} as any;

export { ChartsVoronoiHandler };
