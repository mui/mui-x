import { typeSerializer, seriesIdSerializer } from '@mui/x-charts/internals';
import type { IdentifierSerializer } from '@mui/x-charts/internals';

const identifierSerializer: IdentifierSerializer<'mapShape'> = (identifier) => {
  const namePart = identifier.name == null ? '' : `(${identifier.name})`;
  return `${typeSerializer(identifier.type)}${seriesIdSerializer(identifier.seriesId)}Name(${namePart})`;
};

export default identifierSerializer;
