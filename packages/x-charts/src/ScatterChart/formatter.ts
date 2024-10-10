import { SeriesFormatter } from '../context/PluginProvider/SeriesFormatter.types';
import { ScatterValueType } from '../models';

const formatter: SeriesFormatter<'scatter'> = ({ series, seriesOrder }, dataset) => {
  const completeSeries = Object.fromEntries(
    Object.entries(series).map(([seriesId, seriesData]) => {
      const xDataKey = seriesData.xDataKey;
      const yDataKey = seriesData.yDataKey;
      const zDataKey = seriesData.zDataKey;
      const idDataKey = seriesData.idDataKey;

      const keys = [xDataKey, yDataKey, idDataKey];
      const hasStringKeys = keys.some((key) => typeof key === 'string');
      const hasNonStringKeys = keys.some((key) => typeof key !== 'string');
      if (hasStringKeys && hasNonStringKeys) {
        throw new Error(
          [
            `MUI X: scatter series with id='${seriesId}' has inconsistent data keys.`,
            'Either provide all data keys or none.',
          ].join('\n'),
        );
      }

      const data = !hasStringKeys
        ? (seriesData.data ?? [])
        : (dataset?.map((d) => {
            const x = d[xDataKey!]!;
            const y = d[yDataKey!]!;
            const z = d[zDataKey ?? ''];
            const id = d[idDataKey!]!;

            return {
              x,
              y,
              z,
              id,
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
