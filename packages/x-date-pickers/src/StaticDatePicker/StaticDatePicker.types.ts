import { MakeOptional } from '@mui/x-internals/types';
import {
  BaseDatePickerProps,
  BaseDatePickerSlots,
  BaseDatePickerSlotProps,
} from '../DatePicker/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlots,
  UseStaticPickerSlotProps,
} from '../internals/hooks/useStaticPicker';

export interface StaticDatePickerSlots extends BaseDatePickerSlots, UseStaticPickerSlots {}

export interface StaticDatePickerSlotProps
  extends BaseDatePickerSlotProps,
    UseStaticPickerSlotProps {}

export interface StaticDatePickerProps
  extends BaseDatePickerProps,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: StaticDatePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: StaticDatePickerSlotProps;
  /**
   * Years rendered per row.
   * @default `4` when `displayStaticWrapperAs === 'desktop'`, `3` otherwise.
   */
  yearsPerRow?: 3 | 4;
}
