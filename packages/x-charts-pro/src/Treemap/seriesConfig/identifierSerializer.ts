import { typeSerializer } from '@mui/x-charts/internals';
import type { IdentifierSerializer } from '@mui/x-charts/internals';

const identifierSerializer: IdentifierSerializer<'treemap'> = (identifier) =>
  `${typeSerializer(identifier.type)}Node(${identifier.nodeId})`;

export default identifierSerializer;
