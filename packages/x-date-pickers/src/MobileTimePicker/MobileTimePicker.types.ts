import { MakeOptional } from '@mui/x-internals/types';
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
import { TimeView } from '../models';
import { TimeViewWithMeridiem } from '../internals/models';

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
