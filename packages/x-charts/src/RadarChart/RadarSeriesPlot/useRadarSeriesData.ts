import { useRotationScale } from '../../hooks/useScale';
import { useRadarSeries } from '../../hooks/useRadarSeries';
import { useRadiusAxes } from '../../hooks/useAxis';
import { useItemHighlightedGetter } from '../../hooks/useItemHighlightedGetter';
import { SeriesId } from '../../models/seriesType/common';
import { UseChartPolarAxisSignature } from '../../internals/plugins/featurePlugins/useChartPolarAxis';
import { useChartContext } from '../../context/ChartProvider/useChartContext';

/**
 * This hook provides all the data needed to display radar series.
 * @param querySeriesId The id of the series to display
 * @returns
 */
export function useRadarSeriesData(querySeriesId?: SeriesId) {
  const { instance } = useChartContext<[UseChartPolarAxisSignature]>();
  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis } = useRadiusAxes();

  const radarSeries = useRadarSeries(querySeriesId === undefined ? undefined : [querySeriesId]);

  const { isFaded: isItemFaded, isHighlighted: isItemHighlighted } = useItemHighlightedGetter();

  const metrics = (rotationScale?.domain() as (string | number)[]) ?? [];
  const angles = metrics.map((key) => rotationScale?.(key)!);

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
        const [x, y] = instance.polar2svg(r, angle);
        return {
          x,
          y,
          isItemHighlighted: highlighted,
          isItemFaded: faded,
          dataIndex,
        };
      }),
    };
  });
}
