import { PickerValidDate } from '../../models/pickers';

export type PickerValue = PickerValidDate | null;

export type PickerRangeValue = [PickerValidDate | null, PickerValidDate | null];
