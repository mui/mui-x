import {
  UseMobilePickerSlotsComponent,
  ExportedUseMobilePickerSlotsComponentsProps,
  MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseDateTimePickerProps,
  BaseDateTimePickerSlotsComponent,
  BaseDateTimePickerSlotsComponentsProps,
} from '../DateTimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { DateOrTimeView } from '../models';
import { DateOrTimeViewWithMeridiem } from '../internals/models';

export interface MobileDateTimePickerSlotsComponent<
  TDate,
  TView extends DateOrTimeViewWithMeridiem = DateOrTimeView,
> extends BaseDateTimePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate, TView>, 'field'> {}

export interface MobileDateTimePickerSlotsComponentsProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem = DateOrTimeView,
> extends BaseDateTimePickerSlotsComponentsProps<TDate>,
    ExportedUseMobilePickerSlotsComponentsProps<TDate, TView> {}

export interface MobileDateTimePickerProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem = DateOrTimeView,
> extends BaseDateTimePickerProps<TDate, TView>,
    MobileOnlyPickerProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDateTimePickerSlotsComponent<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateTimePickerSlotsComponentsProps<TDate, TView>;
}
