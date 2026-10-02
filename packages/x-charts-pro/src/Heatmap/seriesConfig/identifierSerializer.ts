import { typeSerializer, seriesIdSerializer } from '@mui/x-charts/internals';
import type { IdentifierSerializer } from '@mui/x-charts/internals';

const identifierSerializer: IdentifierSerializer<'heatmap'> = (identifier) => {
  return `${typeSerializer(identifier.type)}${seriesIdSerializer(identifier.seriesId)}X(${identifier.xIndex})Y(${identifier.yIndex})`;
};

export default identifierSerializer;
