import {
  UseMobilePickerSlots,
  ExportedUseMobilePickerSlotProps,
  MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseDateTimePickerProps,
  BaseDateTimePickerSlots,
  BaseDateTimePickerSlotProps,
} from '../DateTimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { DateOrTimeView, FieldTextFieldVersion } from '../models';
import { DateOrTimeViewWithMeridiem } from '../internals/models';

export interface MobileDateTimePickerSlots<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends BaseDateTimePickerSlots<TDate>,
    MakeOptional<UseMobilePickerSlots<TDate, TView>, 'field'> {}

export interface MobileDateTimePickerSlotProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends BaseDateTimePickerSlotProps<TDate>,
    ExportedUseMobilePickerSlotProps<TDate, TView, TTextFieldVersion> {}

export interface MobileDateTimePickerProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem = DateOrTimeView,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> extends BaseDateTimePickerProps<TDate, TView>,
    MobileOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDateTimePickerSlots<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateTimePickerSlotProps<TDate, TView, TTextFieldVersion>;
}
