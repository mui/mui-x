import type { IdentifierCleaner } from '@mui/x-charts/internals';

const identifierCleaner: IdentifierCleaner<'mapShape'> = (identifier) => {
  return {
    type: identifier.type,
    seriesId: identifier.seriesId,
    name: identifier.name,
  };
};

export default identifierCleaner;
