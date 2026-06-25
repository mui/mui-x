import { typeSerializer, seriesIdSerializer } from '@mui/x-charts/internals';
import type { IdentifierSerializer } from '@mui/x-charts/internals';

const identifierSerializer: IdentifierSerializer<'mapShape'> = (identifier) => {
  return `${typeSerializer(identifier.type)}${seriesIdSerializer(identifier.seriesId)}(${identifier.name})`;
};

export default identifierSerializer;
