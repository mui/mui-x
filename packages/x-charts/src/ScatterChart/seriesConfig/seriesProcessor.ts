import { type ScatterValueType } from '../../models';
import { type SeriesProcessor } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

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
        throw new Error(
          `MUI X Charts: Scatter series with id="${seriesId}" has incomplete datasetKeys. ` +
            `Properties ${missingKeys.map((key) => `"${key}"`).join(', ')} are missing. ` +
            'Scatter plots require both "x" and "y" keys to map dataset values to coordinates. ' +
            'Add the missing datasetKeys to the series configuration.',
        );
      }

      const data = !datasetKeys
        ? (seriesData.data ?? [])
        : (dataset?.map((d) => {
            return {
              x: d[datasetKeys.x] ?? null,
              y: d[datasetKeys.y] ?? null,
              z: datasetKeys.z && d[datasetKeys.z],
              id: datasetKeys.id && d[datasetKeys.id],
            } as ScatterValueType;
          }) ?? []);

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
