import type { IdentifierCleaner } from '@mui/x-charts/internals';

const identifierCleaner: IdentifierCleaner<'treemap'> = (identifier) => ({
  type: identifier.type,
  seriesId: identifier.seriesId,
  nodeId: identifier.nodeId,
});

export default identifierCleaner;
