import type { IdentifierCleaner } from '@mui/x-charts/internals';

const identifierCleaner: IdentifierCleaner<'heatmap'> = (identifier) => {
  return {
    type: identifier.type,
    seriesId: identifier.seriesId,
    xIndex: identifier.xIndex,
    yIndex: identifier.yIndex,
  };
};

export default identifierCleaner;
