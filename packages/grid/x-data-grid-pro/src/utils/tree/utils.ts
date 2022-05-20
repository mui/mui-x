import { RowTreeBuilderGroupingCriteria } from '@mui/x-data-grid-pro/utils/tree/models';

export const getGroupRowIdFromPath = (path: RowTreeBuilderGroupingCriteria[]) => {
  const pathStr = path
    .map((groupingCriteria) => `${groupingCriteria.field}/${groupingCriteria.key}`)
    .join('-');

  return `auto-generated-row-${pathStr}`;
};
