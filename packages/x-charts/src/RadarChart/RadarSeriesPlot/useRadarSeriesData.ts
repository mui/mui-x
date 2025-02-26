import { useRotationScale } from '../../hooks/useScale';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useRadarSeries } from '../../hooks/useRadarSeries';
import { useRadiusAxes } from '../../hooks/useAxis';
import { useItemHighlightedGetter } from '../../hooks/useItemHighlightedGetter';
import { SeriesId } from '../../models/seriesType/common';

/**
 *
 * @param querySeriesId The id of the series to display
 * @returns
 */
export function useRadarSeriesData(querySeriesId?: SeriesId) {
  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis } = useRadiusAxes();

  const radarSeries = useRadarSeries(querySeriesId === undefined ? undefined : [querySeriesId]);

  const drawingArea = useDrawingArea();
  const { isFaded: isItemFaded, isHighlighted: isItemHighlighted } = useItemHighlightedGetter();

  const cx = drawingArea.left + drawingArea.width / 2;
  const cy = drawingArea.top + drawingArea.height / 2;

  const metrics = rotationScale.domain() as (string | number)[];
  const angles = metrics.map((key) => rotationScale(key)!);

  return radarSeries.map((series) => {
    const seriesId = series.id;
    const isSeriesHighlighted = isItemHighlighted({ seriesId });
    const isSeriesFaded = !isSeriesHighlighted && isItemFaded({ seriesId });

    return {
      ...series,
      seriesId: series.id,
      isSeriesHighlighted,
      isSeriesFaded,
      points: series.data.map((value, dataIndex) => {
        const highlighted = isItemHighlighted({ seriesId, dataIndex });
        const faded = !highlighted && isItemFaded({ seriesId, dataIndex });

        const r = radiusAxis[metrics[dataIndex]].scale(value)!;
        const angle = angles[dataIndex];
        return {
          x: cx + r * Math.sin(angle),
          y: cy - r * Math.cos(angle),
          isItemHighlighted: highlighted,
          isItemFaded: faded,
          dataIndex,
        };
      }),
    };
  });
}
