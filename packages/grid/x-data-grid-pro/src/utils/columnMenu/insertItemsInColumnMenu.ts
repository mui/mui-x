import { GridColumnMenuValue, GridColumnMenuTypes } from '@mui/x-data-grid';

/**
 * Method used to insert specific items after an item in column menu
 *
 * @param {GridColumnMenuValue['visibleItemKeys']} visibleKeys ordered list of keys for column menu items
 * @param {GridColumnMenuValue['visibleItemKeys']} newKeys new keys to be inserted
 * @param {GridColumnMenuTypes['key'] | undefined} afterKey key of the item after which the new keys should be inserted
 * @returns {GridColumnMenuValue['visibleItemKeys']} updated keys
 */
export const insertItemsInColumnMenu = (
  visibleKeys: GridColumnMenuValue['visibleItemKeys'],
  newKeys: GridColumnMenuValue['visibleItemKeys'],
  afterKey: GridColumnMenuTypes['key'] | undefined,
) => {
  if (!afterKey) {
    return [...visibleKeys, ...newKeys];
  }
  return visibleKeys.reduce<GridColumnMenuValue['visibleItemKeys']>((finalItems, key) => {
    if (key === afterKey) {
      return [...finalItems, key, ...newKeys];
    }
    return [...finalItems, key];
  }, []);
};
