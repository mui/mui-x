import type { SeriesId } from '../models';
import type { SeriesTypeWithDataIndex } from '../models/seriesType/config';

export const typeSerializer = (type: string) => `Type(${type})`;
export const seriesIdSerializer = (id: SeriesId) => `Series(${id})`;
export const dataIndexSerializer = (dataIndex?: number) =>
  dataIndex === undefined ? '' : `Index(${dataIndex})`;

/**
 * Serializes an identifier using type, seriesId, and dataIndex properties.
 *
 * The generic constraint ensures this can only be used for series types whose
 * identifier actually includes `dataIndex`. Series types with different identifier
 * properties (like heatmap's xIndex/yIndex) must provide their own serializer.
 */
export const identifierSerializerSeriesIdDataIndex = <
  SeriesType extends SeriesTypeWithDataIndex,
>(identifier: {
  type: SeriesType;
  seriesId: SeriesId;
  dataIndex?: number;
}) => {
  return `${typeSerializer(identifier.type)}${seriesIdSerializer(identifier.seriesId)}${dataIndexSerializer(identifier.dataIndex)}`;
};
