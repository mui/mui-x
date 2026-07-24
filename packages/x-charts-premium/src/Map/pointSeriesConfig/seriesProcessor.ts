import { incompleteDatasetKeysError } from '@mui/x-charts/internals';
import type { SeriesProcessor, SeriesId, ChartSeriesDefaultized } from '@mui/x-charts/internals';
import type { MapPointValueType } from '../../models/seriesType/mapPoint';

const defaultValueFormatter = ((v) =>
  v == null ? '' : String(v.value)) as ChartSeriesDefaultized<'mapPoint'>['valueFormatter'];

const seriesProcessor: SeriesProcessor<'mapPoint'> = (
  { series, seriesOrder },
  dataset,
  isItemVisible,
) => {
  const defaultizedSeries: Record<SeriesId, ChartSeriesDefaultized<'mapPoint'>> = {};

  seriesOrder.forEach((seriesId) => {
    const input = series[seriesId];
    const datasetKeys = input.datasetKeys;

    if (datasetKeys && (typeof datasetKeys.lon !== 'string' || typeof datasetKeys.lat !== 'string')) {
      incompleteDatasetKeysError('MapPoint', seriesId, ['lon', 'lat']);
    }

    let data: readonly MapPointValueType[];
    if (input.valueGetter) {
      data = dataset?.map(input.valueGetter) ?? [];
    } else if (datasetKeys) {
      data =
        dataset?.map((d) => {
          const rep = {
            coordinates: [d[datasetKeys.lon] as number, d[datasetKeys.lat] as number],
          } as MapPointValueType;
          if (datasetKeys.label !== undefined) {
            rep.label = d[datasetKeys.label] as string;
          }
          if (datasetKeys.value !== undefined) {
            rep.value = d[datasetKeys.value] as number;
          }
          if (datasetKeys.colorValue !== undefined) {
            rep.colorValue = d[datasetKeys.colorValue];
          }
          return rep;
        }) ?? [];
    } else {
      data = input.data ?? [];
    }

    defaultizedSeries[seriesId] = {
      labelMarkType: 'circle',
      ...input,
      data: data.map((item, dataIndex) => ({
        ...item,
        hidden: !isItemVisible?.({ type: 'mapPoint', seriesId, dataIndex }),
      })),
      hidden: !isItemVisible?.({ type: 'mapPoint', seriesId }),
      valueFormatter: input.valueFormatter ?? defaultValueFormatter,
    };
  });

  return {
    series: defaultizedSeries,
    seriesOrder,
  };
};

export default seriesProcessor;
