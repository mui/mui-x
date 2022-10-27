import { GridColumnMenuValue } from '@mui/x-data-grid';

/**
 * Method used to insert specific items after an item in column menu items list
 *
 * @param {GridColumnMenuValue} columnMenuValues value from `columnMenu` pipe processor
 * @param {GridColumnMenuValue} nodesToInsert new nodes to be inserted with `displayName`
 * @param {string} afterComponentName name of the component/node after which the new nodes should be inserted
 * @returns {GridColumnMenuValue} value from `columnMenu` pipe processor with updated nodes
 */
export const insertItemsInColumnMenu = (
  columnMenuValues: GridColumnMenuValue,
  nodesToInsert: GridColumnMenuValue,
  afterComponentName: string,
) =>
  columnMenuValues.reduce((finalItems, item) => {
    if (item.displayName === afterComponentName) {
      return [...finalItems, item, ...nodesToInsert];
    }
    return [...finalItems, item];
  }, [] as GridColumnMenuValue);
