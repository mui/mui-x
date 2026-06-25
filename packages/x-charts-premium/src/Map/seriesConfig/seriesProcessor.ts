import { incompleteDatasetKeysError } from '@mui/x-charts/internals';
import type { SeriesProcessor, SeriesId, ChartSeriesDefaultized } from '@mui/x-charts/internals';
import type { MapShapeValueType } from '../../models/seriesType/mapShape';

const defaultValueFormatter = ((v) =>
  v == null ? '' : String(v.value)) as ChartSeriesDefaultized<'mapShape'>['valueFormatter'];

const seriesProcessor: SeriesProcessor<'mapShape'> = (
  { series, seriesOrder },
  dataset,
  isItemVisible,
) => {
  const defaultizedSeries: Record<SeriesId, ChartSeriesDefaultized<'mapShape'>> = {};

  seriesOrder.forEach((seriesId) => {
    const input = series[seriesId];
    const datasetKeys = input.datasetKeys;

    if (datasetKeys && typeof datasetKeys.name !== 'string') {
      incompleteDatasetKeysError('MapShape', seriesId, ['name']);
    }

    let data: readonly MapShapeValueType[];
    if (input.valueGetter) {
      data = dataset?.map(input.valueGetter) ?? [];
    } else if (datasetKeys) {
      data =
        dataset?.map((d) => {
          const rep = { name: d[datasetKeys.name] as string } as MapShapeValueType;
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

    const lookupByName = new Map<string, number>();
    data.forEach((item, index) => {
      if (lookupByName.has(item.name)) {
        throw new Error(
          `MUI X Charts: Series "${seriesId}" Has duplicated name "${item.name}". Please ensure that each data entry has a unique name.`,
        );
      }
      lookupByName.set(item.name, index);
    });
    defaultizedSeries[seriesId] = {
      labelMarkType: 'square',
      ...input,
      data: data.map((item) => ({
        ...item,
        hidden: !isItemVisible?.({ type: 'mapShape', seriesId, name: item.name }),
      })),
      lookupByName,
      hidden: !isItemVisible?.({ type: 'mapShape', seriesId }),
      valueFormatter: input.valueFormatter ?? defaultValueFormatter,
    };
  });

  return {
    series: defaultizedSeries,
    seriesOrder,
  };
};

export default seriesProcessor;
