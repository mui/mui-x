import { GridColumnMenuValue, GridColumnMenuLookup } from '@mui/x-data-grid';

/**
 * Method used to insert specific items after an item in column menu
 *
 * @param {GridColumnMenuValue['visibleSlots']} visibleSlots ordered list of visible slots
 * @param {GridColumnMenuValue['visibleSlots']} newSlots new slots to be inserted
 * @param {GridColumnMenuLookup['slot'] | undefined} afterSlot name of the slot after which the new slots should be inserted
 * @returns {GridColumnMenuValue['visibleSlots']} updated slots
 */
export const insertSlotsInColumnMenu = (
  visibleSlots: GridColumnMenuValue['visibleSlots'],
  newSlots: GridColumnMenuValue['visibleSlots'],
  afterSlot: GridColumnMenuLookup['slot'] | undefined,
) => {
  if (!afterSlot) {
    return [...visibleSlots, ...newSlots];
  }
  return visibleSlots.reduce((finalItems, slot) => {
    if (slot === afterSlot) {
      return [...finalItems, slot, ...newSlots];
    }
    return [...finalItems, slot];
  }, [] as GridColumnMenuValue['visibleSlots']);
};
