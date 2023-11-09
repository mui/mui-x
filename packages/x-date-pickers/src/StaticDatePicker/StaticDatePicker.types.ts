import {
  BaseDatePickerProps,
  BaseDatePickerSlotsComponent,
  BaseDatePickerSlotsComponentsProps,
} from '../DatePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlotsComponent,
  UseStaticPickerSlotsComponentsProps,
} from '../internals/hooks/useStaticPicker';
import { MakeOptional } from '../internals';
import { DateView } from '../models';

export interface StaticDatePickerSlotsComponent<TDate>
  extends BaseDatePickerSlotsComponent<TDate>,
    UseStaticPickerSlotsComponent<TDate, DateView> {}

export interface StaticDatePickerSlotsComponentsProps<TDate>
  extends BaseDatePickerSlotsComponentsProps<TDate>,
    UseStaticPickerSlotsComponentsProps<TDate, DateView> {}

export interface StaticDatePickerProps<TDate>
  extends BaseDatePickerProps<TDate>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: StaticDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: StaticDatePickerSlotsComponentsProps<TDate>;
}
