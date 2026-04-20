import { typeSerializer, type IdentifierSerializer } from '@mui/x-charts/internals';

const identifierSerializer: IdentifierSerializer<'sankey'> = (identifier) => {
  if (identifier.subType === 'node') {
    return `${typeSerializer(identifier.type)}Node(${identifier.nodeId})`;
  }
  return `${typeSerializer(identifier.type)}Source(${identifier.sourceId})Target(${identifier.targetId})`;
};

export default identifierSerializer;
