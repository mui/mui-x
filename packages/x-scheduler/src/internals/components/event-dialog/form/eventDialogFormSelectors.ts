import { createSelector } from '@base-ui/utils/store';
import type { EventDialogFormState } from './EventDialogFormStore';

export const eventDialogFormSelectors = {
  value: createSelector((state: EventDialogFormState, key: string) => state.values[key]),
  error: createSelector((state: EventDialogFormState, key: string) => state.errors[key]),
};
