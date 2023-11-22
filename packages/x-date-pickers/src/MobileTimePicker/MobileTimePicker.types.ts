import {
  UseMobilePickerSlotsComponent,
  ExportedUseMobilePickerSlotsComponentsProps,
  MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseTimePickerProps,
  BaseTimePickerSlotsComponent,
  BaseTimePickerSlotsComponentsProps,
} from '../TimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { TimeView } from '../models';
import { TimeViewWithMeridiem } from '../internals/models';

export interface MobileTimePickerSlotsComponent<
  TDate,
  TView extends TimeViewWithMeridiem = TimeView,
> extends BaseTimePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate, TView>, 'field'> {}

export interface MobileTimePickerSlotsComponentsProps<
  TDate,
  TView extends TimeViewWithMeridiem = TimeView,
> extends BaseTimePickerSlotsComponentsProps,
    ExportedUseMobilePickerSlotsComponentsProps<TDate, TView> {}

export interface MobileTimePickerProps<TDate, TView extends TimeViewWithMeridiem = TimeView>
  extends BaseTimePickerProps<TDate, TView>,
    MobileOnlyPickerProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileTimePickerSlotsComponent<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileTimePickerSlotsComponentsProps<TDate, TView>;
}
