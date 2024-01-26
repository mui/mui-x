import {
  UseMobilePickerSlots,
  ExportedUseMobilePickerSlotProps,
  MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseTimePickerProps,
  BaseTimePickerSlots,
  BaseTimePickerSlotProps,
} from '../TimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { TimeView } from '../models';
import { TimeViewWithMeridiem } from '../internals/models';

export interface MobileTimePickerSlots<TDate, TView extends TimeViewWithMeridiem = TimeView>
  extends BaseTimePickerSlots<TDate>,
    MakeOptional<UseMobilePickerSlots<TDate, TView>, 'field'> {}

export interface MobileTimePickerSlotProps<TDate, TView extends TimeViewWithMeridiem = TimeView>
  extends BaseTimePickerSlotProps,
    ExportedUseMobilePickerSlotProps<TDate, TView> {}

export interface MobileTimePickerProps<TDate, TView extends TimeViewWithMeridiem = TimeView>
  extends BaseTimePickerProps<TDate, TView>,
    MobileOnlyPickerProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileTimePickerSlots<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileTimePickerSlotProps<TDate, TView>;
}
