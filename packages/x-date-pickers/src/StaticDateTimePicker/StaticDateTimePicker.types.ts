import { MakeOptional } from '@mui/x-internals/types';
import {
  BaseDateTimePickerProps,
  BaseDateTimePickerSlots,
  BaseDateTimePickerSlotProps,
} from '../DateTimePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlots,
  UseStaticPickerSlotProps,
} from '../internals/hooks/useStaticPicker';
import { DateOrTimeView } from '../models';

export interface StaticDateTimePickerSlots
  extends BaseDateTimePickerSlots,
    UseStaticPickerSlots<DateOrTimeView> {}

export interface StaticDateTimePickerSlotProps
  extends BaseDateTimePickerSlotProps,
    UseStaticPickerSlotProps<DateOrTimeView> {}

export interface StaticDateTimePickerProps
  extends BaseDateTimePickerProps<DateOrTimeView>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: StaticDateTimePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: StaticDateTimePickerSlotProps;
  /**
   * Years rendered per row.
   * @default `4` when `displayStaticWrapperAs === 'desktop'`, `3` otherwise.
   */
  yearsPerRow?: 3 | 4;
}
