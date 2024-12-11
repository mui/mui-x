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

export interface MobileTimePickerSlots<TView extends TimeViewWithMeridiem>
  extends BaseTimePickerSlots,
    MakeOptional<UseMobilePickerSlots<TView>, 'field'> {}

export interface MobileTimePickerSlotProps<
  TView extends TimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends BaseTimePickerSlotProps,
    ExportedUseMobilePickerSlotProps<TView, TEnableAccessibleFieldDOMStructure> {}

export interface MobileTimePickerProps<
  TView extends TimeViewWithMeridiem = TimeView,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends BaseTimePickerProps<TView>,
    MobileOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileTimePickerSlots<TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileTimePickerSlotProps<TView, TEnableAccessibleFieldDOMStructure>;
}
