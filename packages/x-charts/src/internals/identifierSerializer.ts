import type { SeriesId } from '../models';

export const typeSerializer = (type: string) => `Type(${type})`;
export const seriesIdSerializer = (id: SeriesId) => `Series(${id})`;
export const dataIndexSerializer = (dataIndex?: number) => `Index(${dataIndex})`;

export const identifierSerializerSeriesIdDataIndex = <
  T extends {
    type: string;
    seriesId: SeriesId;
    dataIndex?: number;
  },
>(
  identifier: T,
) => {
  return `${typeSerializer(identifier.type)}${seriesIdSerializer(identifier.seriesId)}${dataIndexSerializer(identifier.dataIndex)}`;
};
