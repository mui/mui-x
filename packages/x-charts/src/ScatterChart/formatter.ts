import { SeriesFormatter } from '../context/PluginProvider/SeriesFormatter.types';
import { ScatterValueType } from '../models';

const formatter: SeriesFormatter<'scatter'> = ({ series, seriesOrder }, dataset) => {
  const completeSeries = Object.fromEntries(
    Object.entries(series).map(([seriesId, seriesData]) => {
      const datasetKeys = seriesData?.datasetKeys;

      const missingKeys = (['x', 'y', 'id'] as const).filter(
        (key) => typeof datasetKeys?.[key] !== 'string',
      );

      if (seriesData?.datasetKeys && missingKeys.length > 0) {
        throw new Error(
          [
            `MUI X: scatter series with id='${seriesId}' has incomplete datasetKeys.`,
            `Properties ${missingKeys.map((key) => `"${key}"`).join(', ')} are missing.`,
          ].join('\n'),
        );
      }

      const data = !datasetKeys
        ? (seriesData.data ?? [])
        : (dataset?.map((d) => {
            return {
              x: d[datasetKeys.x],
              y: d[datasetKeys.y],
              z: datasetKeys.z && d[datasetKeys.z],
              id: d[datasetKeys.id],
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
