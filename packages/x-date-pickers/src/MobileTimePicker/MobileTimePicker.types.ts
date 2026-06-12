import { type MakeOptional } from '@mui/x-internals/types';
import {
  type UseMobilePickerSlots,
  type ExportedUseMobilePickerSlotProps,
  type MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  type BaseTimePickerProps,
  type BaseTimePickerSlots,
  type BaseTimePickerSlotProps,
} from '../TimePicker/shared';
import { type TimeView } from '../models';
import { type TimeViewWithMeridiem } from '../internals/models';

export interface MobileTimePickerSlots
  extends BaseTimePickerSlots, MakeOptional<UseMobilePickerSlots, 'field'> {}

export interface MobileTimePickerSlotProps
  extends BaseTimePickerSlotProps, ExportedUseMobilePickerSlotProps {}

export interface MobileTimePickerProps<TView extends TimeViewWithMeridiem = TimeView>
  extends BaseTimePickerProps<TView>, MobileOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileTimePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileTimePickerSlotProps;
}
