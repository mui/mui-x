import {
  BaseDateTimePickerProps,
  BaseDateTimePickerSlotsComponent,
  BaseDateTimePickerSlotsComponentsProps,
} from '../DateTimePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlotsComponent,
  UseStaticPickerSlotsComponentsProps,
} from '../internals/hooks/useStaticPicker';
import { MakeOptional } from '../internals';
import { DateOrTimeView } from '../models';

export interface StaticDateTimePickerSlotsComponent<TDate>
  extends BaseDateTimePickerSlotsComponent<TDate>,
    UseStaticPickerSlotsComponent<TDate, DateOrTimeView> {}

export interface StaticDateTimePickerSlotsComponentsProps<TDate>
  extends BaseDateTimePickerSlotsComponentsProps<TDate>,
    UseStaticPickerSlotsComponentsProps<TDate, DateOrTimeView> {}

export interface StaticDateTimePickerProps<TDate>
  extends BaseDateTimePickerProps<TDate, DateOrTimeView>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: StaticDateTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: StaticDateTimePickerSlotsComponentsProps<TDate>;
}
