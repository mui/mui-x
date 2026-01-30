import type { IdentifierCleaner } from '@mui/x-charts/internals';

const identifierCleaner: IdentifierCleaner<'sankey'> = (identifier) => {
  if (identifier.subType === 'node') {
    return {
      type: identifier.type,
      seriesId: identifier.seriesId,
      subType: 'node',
      nodeId: identifier.nodeId,
    };
  }
  return {
    type: identifier.type,
    seriesId: identifier.seriesId,
    subType: 'link',
    sourceId: identifier.sourceId,
    targetId: identifier.targetId,
  };
};

export default identifierCleaner;
