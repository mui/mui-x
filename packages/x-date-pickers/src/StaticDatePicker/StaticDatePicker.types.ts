import {
  BaseDatePickerProps,
  BaseDatePickerSlots,
  BaseDatePickerSlotProps,
} from '../DatePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlots,
  UseStaticPickerSlotProps,
} from '../internals/hooks/useStaticPicker';
import { MakeOptional } from '../internals';
import { DateView } from '../models';

export interface StaticDatePickerSlots<TDate>
  extends BaseDatePickerSlots<TDate>,
    UseStaticPickerSlots<TDate, DateView> {}

export interface StaticDatePickerSlotProps<TDate>
  extends BaseDatePickerSlotProps<TDate>,
    UseStaticPickerSlotProps<TDate, DateView> {}

export interface StaticDatePickerProps<TDate>
  extends BaseDatePickerProps<TDate>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: StaticDatePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: StaticDatePickerSlotProps<TDate>;
}
