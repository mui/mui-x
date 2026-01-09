import type { IdentifierCompare } from '@mui/x-charts/internals';

const identifierCompare: IdentifierCompare<'sankey'> = (id1, id2) => {
  if (id1.subType === 'node' && id2.subType === 'node') {
    return id1.nodeId === id2.nodeId;
  }

  if (id1.subType === 'link' && id2.subType === 'link') {
    return id1.sourceId === id2.sourceId && id1.targetId === id2.targetId;
  }

  return false;
};

export default identifierCompare;
