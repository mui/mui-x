import {
  typeSerializer,
  seriesIdSerializer,
  type IdentifierSerializer,
} from '@mui/x-charts/internals';

const identifierSerializer: IdentifierSerializer<'mapShape'> = (identifier) => {
  return `${typeSerializer(identifier.type)}${seriesIdSerializer(identifier.seriesId)}(${identifier.dataIndex})`;
};

export default identifierSerializer;
