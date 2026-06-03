import { type MakeOptional } from '@mui/x-internals/types';
import {
  type BaseTimePickerProps,
  type BaseTimePickerSlots,
  type BaseTimePickerSlotProps,
} from '../TimePicker/shared';
import {
  type StaticOnlyPickerProps,
  type UseStaticPickerSlots,
  type UseStaticPickerSlotProps,
} from '../internals/hooks/useStaticPicker';
import { type TimeView } from '../models';

export interface StaticTimePickerSlots extends BaseTimePickerSlots, UseStaticPickerSlots {}

export interface StaticTimePickerSlotProps
  extends BaseTimePickerSlotProps, UseStaticPickerSlotProps {}

export interface StaticTimePickerProps
  extends
    BaseTimePickerProps<TimeView>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: StaticTimePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: StaticTimePickerSlotProps;
}
