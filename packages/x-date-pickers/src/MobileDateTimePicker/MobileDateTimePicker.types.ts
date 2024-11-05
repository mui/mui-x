import { MakeOptional } from '@mui/x-internals/types';
import {
  UseMobilePickerSlots,
  ExportedUseMobilePickerSlotProps,
  MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseDateTimePickerProps,
  BaseDateTimePickerSlots,
  BaseDateTimePickerSlotProps,
} from '../DateTimePicker/shared';
import { DateOrTimeView } from '../models';
import { DateOrTimeViewWithMeridiem } from '../internals/models';

export interface MobileDateTimePickerSlots<TView extends DateOrTimeViewWithMeridiem>
  extends BaseDateTimePickerSlots,
    MakeOptional<UseMobilePickerSlots<TView>, 'field'> {}

export interface MobileDateTimePickerSlotProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends BaseDateTimePickerSlotProps,
    ExportedUseMobilePickerSlotProps<TView, TEnableAccessibleFieldDOMStructure> {}

export interface MobileDateTimePickerProps<
  TView extends DateOrTimeViewWithMeridiem = DateOrTimeView,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends BaseDateTimePickerProps<TView>,
    MobileOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDateTimePickerSlots<TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateTimePickerSlotProps<TView, TEnableAccessibleFieldDOMStructure>;
}
