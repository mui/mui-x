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

export interface MobileTimePickerSlots<
  TDate,
  TView extends TimeViewWithMeridiem,
  TUseV6TextField extends boolean,
> extends BaseTimePickerSlots<TDate>,
    MakeOptional<UseMobilePickerSlots<TDate, TView, TUseV6TextField>, 'field'> {}

export interface MobileTimePickerSlotProps<
  TDate,
  TView extends TimeViewWithMeridiem,
  TUseV6TextField extends boolean,
> extends BaseTimePickerSlotProps,
    ExportedUseMobilePickerSlotProps<TDate, TView, TUseV6TextField> {}

export interface MobileTimePickerProps<
  TDate,
  TView extends TimeViewWithMeridiem = TimeView,
  TUseV6TextField extends boolean = false,
> extends BaseTimePickerProps<TDate, TView>,
    MobileOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileTimePickerSlots<TDate, TView, TUseV6TextField>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileTimePickerSlotProps<TDate, TView, TUseV6TextField>;
}
