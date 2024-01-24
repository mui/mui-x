import { Slot } from '@mui-internal/api-docs-builder/utils/parseSlotsAndClasses';

export function slotsSort(a: Slot, b: Slot) {
  if (a.name === 'root') {
    return 1;
  }
  if (b.name === 'root') {
    return -1;
  }
  return a.name.localeCompare(b.name);
}
