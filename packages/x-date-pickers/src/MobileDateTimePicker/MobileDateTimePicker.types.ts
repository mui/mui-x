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
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import { DateOrTimeViewWithMeridiem } from '../internals/models';

export interface MobileDateTimePickerSlotsComponent<
  TDate,
  TView extends DateOrTimeViewWithMeridiem = DateOrTimeView,
> extends BaseDateTimePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate, TView>, 'Field'> {}

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
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: MobileDateTimePickerSlotsComponent<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: MobileDateTimePickerSlotsComponentsProps<TDate, TView>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<MobileDateTimePickerSlotsComponent<TDate, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateTimePickerSlotsComponentsProps<TDate, TView>;
}
