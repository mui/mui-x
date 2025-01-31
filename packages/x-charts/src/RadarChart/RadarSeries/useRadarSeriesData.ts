import { useHighlighted } from '../../context/HighlightedProvider';
import { useRotationScale } from '../../hooks/useScale';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useRadarSeries } from '../../hooks/useSeries';
import { useRadiusAxes } from '../../hooks';

/**
 *
 * @param querySeriesId The id of the series to display
 * @returns
 */
export function useRadarSeriesData(querySeriesId?: string) {
  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis } = useRadiusAxes();

  const radarSeries = useRadarSeries();

  const drawingArea = useDrawingArea();
  const highlighted = useHighlighted();

  const cx = drawingArea.left + drawingArea.width / 2;
  const cy = drawingArea.top + drawingArea.height / 2;

  const metrics = rotationScale.domain() as (string | number)[];
  const angles = metrics.map((key) => rotationScale(key)!);

  return radarSeries?.seriesOrder
    .filter((id) => querySeriesId === undefined || id === querySeriesId)
    .map((seriesId) => {
      const isSeriesHighlighted = highlighted.isHighlighted({ seriesId });
      const isSeriesFaded = !isSeriesHighlighted && highlighted.isFaded({ seriesId });

      return {
        ...radarSeries.series[seriesId],
        seriesId,
        isSeriesHighlighted,
        isSeriesFaded,
        points: radarSeries.series[seriesId].data.map((value, dataIndex) => {
          const isItemHighlighted = highlighted.isHighlighted({ seriesId, dataIndex });
          const isItemFaded = !isItemHighlighted && highlighted.isFaded({ seriesId, dataIndex });

          const r = radiusAxis[metrics[dataIndex]].scale(value)!;
          const angle = angles[dataIndex];
          return {
            x: cx + r * Math.sin(angle),
            y: cy - r * Math.cos(angle),
            isItemHighlighted,
            isItemFaded,
            dataIndex,
          };
        }),
      };
    });
}
