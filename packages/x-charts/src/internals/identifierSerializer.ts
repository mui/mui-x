import type { SeriesId } from '../models';

export const typeSerializer = (type: string) => `Type(${type})`;
export const seriesIdSerializer = (id: SeriesId) => `Series(${id})`;
export const dataIndexSerializer = (dataIndex?: number) =>
  dataIndex === undefined ? '' : `Index(${dataIndex})`;

export const identifierSerializerSeriesIdDataIndex = (identifier: {
  type: string;
  seriesId: SeriesId;
  dataIndex?: number;
}) => {
  return `${typeSerializer(identifier.type)}${seriesIdSerializer(identifier.seriesId)}${dataIndexSerializer(identifier.dataIndex)}`;
};
