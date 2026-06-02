import { type ScatterValueType } from '../../models';
import { type SeriesProcessor } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { incompleteDatasetKeysError } from '../../internals/incompleteDatasetKeysError';

const seriesProcessor: SeriesProcessor<'scatter'> = (
  { series, seriesOrder },
  dataset,
  isItemVisible,
) => {
  const completeSeries = Object.fromEntries(
    Object.entries(series).map(([seriesId, seriesData]) => {
      const datasetKeys = seriesData?.datasetKeys;

      const missingKeys = (['x', 'y'] as const).filter(
        (key) => typeof datasetKeys?.[key] !== 'string',
      );

      if (seriesData?.datasetKeys && missingKeys.length > 0) {
        incompleteDatasetKeysError('Scatter', seriesId, missingKeys);
      }

      let data: readonly ScatterValueType[];
      if (seriesData.valueGetter) {
        data = dataset?.map(seriesData.valueGetter!) ?? [];
      } else if (datasetKeys) {
        data =
          dataset?.map((d) => {
            const x = d[datasetKeys.x];
            const y = d[datasetKeys.y];

            const rep = { x, y } as ScatterValueType;

            if (datasetKeys.colorValue !== undefined) {
              rep.colorValue = d[datasetKeys.colorValue];
            }
            if (datasetKeys.sizeValue !== undefined) {
              rep.sizeValue = d[datasetKeys.sizeValue];
            }
            if (datasetKeys.z !== undefined) {
              rep.z = d[datasetKeys.z];
            }
            if (datasetKeys.id !== undefined) {
              rep.id = d[datasetKeys.id] as string | number | undefined;
            }

            return rep;
          }) ?? [];
      } else {
        data = seriesData.data ?? [];
      }

      return [
        seriesId,
        {
          labelMarkType: 'circle' as const,
          markerSize: 4,
          ...seriesData,
          preview: {
            markerSize: 1,
            ...seriesData?.preview,
          },
          data,
          hidden: !isItemVisible?.({ type: 'scatter', seriesId }),
          valueFormatter: seriesData.valueFormatter ?? ((v) => v && `(${v.x}, ${v.y})`),
        },
      ];
    }),
  );

  return {
    series: completeSeries,
    seriesOrder,
  };
};

export default seriesProcessor;
