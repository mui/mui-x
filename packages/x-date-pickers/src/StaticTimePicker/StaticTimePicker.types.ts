import { MakeOptional } from '@mui/x-internals/types';
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
import { TimeView } from '../models';

export interface StaticTimePickerSlots extends BaseTimePickerSlots, UseStaticPickerSlots {}

export interface StaticTimePickerSlotProps
  extends BaseTimePickerSlotProps,
    UseStaticPickerSlotProps {}

export interface StaticTimePickerProps
  extends BaseTimePickerProps<TimeView>,
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
