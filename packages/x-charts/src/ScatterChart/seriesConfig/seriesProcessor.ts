import { warnOnce } from '@mui/x-internals/warning';
import { ScatterValueType } from '../../models';
import { SeriesProcessor } from '../../internals/plugins/models';

const seriesProcessor: SeriesProcessor<'scatter'> = ({ series, seriesOrder }, dataset) => {
  const completeSeries = Object.fromEntries(
    Object.entries(series).map(([seriesId, seriesData]) => {
      const datasetKeys = seriesData?.datasetKeys;

      const missingKeys = (['x', 'y'] as const).filter(
        (key) => typeof datasetKeys?.[key] !== 'string',
      );

      if (seriesData?.datasetKeys && missingKeys.length > 0) {
        throw new Error(
          [
            `MUI X Charts: scatter series with id='${seriesId}' has incomplete datasetKeys.`,
            `Properties ${missingKeys.map((key) => `"${key}"`).join(', ')} are missing.`,
          ].join('\n'),
        );
      }

      if (process.env.NODE_ENV !== 'production') {
        if (!seriesData.data && dataset) {
          // If these keys are not present, an error is thrown above
          const xDataKey = series[seriesId].datasetKeys!.x;
          const yDataKey = series[seriesId].datasetKeys!.y;

          dataset.forEach((entry, index) => {
            const x = entry[xDataKey];

            if (x != null && typeof x?.valueOf() !== 'number') {
              warnOnce(
                [
                  `MUI X Charts: your dataset key "${xDataKey}" is used for a scatter plot, but the dataset contains the non-null non-numerical element "${x}" at index ${index}.`,
                  'Scatter plots only support numeric and null values.',
                ].join('\n'),
              );
            }

            const y = entry[yDataKey];

            if (y != null && typeof y?.valueOf() !== 'number') {
              warnOnce(
                [
                  `MUI X Charts: your dataset key "${yDataKey}" is used for a scatter plot, but the dataset contains the non-null non-numerical element "${y}" at index ${index}.`,
                  'Scatter plots only support numeric and null values.',
                ].join('\n'),
              );
            }
          });
        }
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
