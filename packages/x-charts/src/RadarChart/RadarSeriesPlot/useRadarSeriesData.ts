import { useRotationScale } from '../../hooks/useScale';
import { useRadarSeries } from '../../hooks/useRadarSeries';
import { useRadiusAxes } from '../../hooks/useAxis';
import { useItemHighlightedGetter } from '../../hooks/useItemHighlightedGetter';
import { type SeriesId } from '../../models/seriesType/common';
import { type UseChartPolarAxisSignature } from '../../internals/plugins/featurePlugins/useChartPolarAxis';
import { useChartContext } from '../../context/ChartProvider/useChartContext';
import { getSeriesColorFn } from '../../internals/getSeriesColorFn';

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

  const angles = metrics.map((key) => rotationScale!(key)!);

  return radarSeries.map((series) => {
    const seriesId = series.id;
    const isSeriesHighlighted = isItemHighlighted({ type: 'radar', seriesId });
    const isSeriesFaded = !isSeriesHighlighted && isItemFaded({ type: 'radar', seriesId });
    const getColor = getSeriesColorFn(series);

    return {
      ...series,
      seriesId: series.id,
      isSeriesHighlighted,
      isSeriesFaded,
      points: series.data.map((value, dataIndex) => {
        const highlighted = isItemHighlighted({ type: 'radar', seriesId, dataIndex });
        const faded = !highlighted && isItemFaded({ type: 'radar', seriesId, dataIndex });

        const r = radiusAxis[metrics[dataIndex]].scale(value)!;
        const angle = angles[dataIndex];
        const [x, y] = instance.polar2svg(r, angle);
        return {
          x,
          y,
          isItemHighlighted: highlighted,
          isItemFaded: faded,
          dataIndex,
          value,
          color: getColor({ value, dataIndex }),
        };
      }),
    };
  });
}
