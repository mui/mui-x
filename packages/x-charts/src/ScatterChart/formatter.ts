import { SeriesFormatter } from '../context/PluginProvider/SeriesFormatter.types';
import { ScatterValueType } from '../models';

const formatter: SeriesFormatter<'scatter'> = ({ series, seriesOrder }, dataset) => {
  const completeSeries = Object.fromEntries(
    Object.entries(series).map(([seriesId, seriesData]) => {
      const xDataKey = seriesData?.datasetKeys?.x;
      const yDataKey = seriesData?.datasetKeys?.y;
      const zDataKey = seriesData?.datasetKeys?.z;
      const idDataKey = seriesData?.datasetKeys?.id;

      const keys = [xDataKey, yDataKey, idDataKey];
      const hasNonStringKeys = keys.some((key) => typeof key !== 'string');
      if (seriesData?.datasetKeys && hasNonStringKeys) {
        throw new Error(
          [
            `MUI X: scatter series with id='${seriesId}' has incomplete datasetKeys.`,
            'You should provide x, y, and id keys.',
          ].join('\n'),
        );
      }

      const data = !seriesData?.datasetKeys
        ? (seriesData.data ?? [])
        : (dataset?.map((d) => {
            return {
              x: d[xDataKey!],
              y: d[yDataKey!],
              z: zDataKey && d[zDataKey],
              id: d[idDataKey!],
            } as ScatterValueType;
          }) ?? []);

      return [
        seriesId,
        {
          ...seriesData,
          data,
          valueFormatter: seriesData.valueFormatter ?? ((v) => `(${v.x}, ${v.y})`),
        },
      ];
    }),
  );

  return {
    series: completeSeries,
    seriesOrder,
  };
};

export default formatter;
