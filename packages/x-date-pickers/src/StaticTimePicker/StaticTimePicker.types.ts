import {
  BaseTimePickerProps,
  BaseTimePickerSlots,
  BaseTimePickerSlotProps,
} from '../TimePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlots,
  UseStaticPickerSlotProps,
} from '../internals/hooks/useStaticPicker';
import { MakeOptional } from '../internals/models/helpers';
import { TimeView } from '../models';

export interface StaticTimePickerSlots<TDate>
  extends BaseTimePickerSlots<TDate>,
    UseStaticPickerSlots<TDate, TimeView> {}

export interface StaticTimePickerSlotProps<TDate>
  extends BaseTimePickerSlotProps,
    UseStaticPickerSlotProps<TDate, TimeView> {}

export interface StaticTimePickerProps<TDate>
  extends BaseTimePickerProps<TDate, TimeView>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: StaticTimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: StaticTimePickerSlotProps<TDate>;
}
