import { MakeOptional } from '@mui/x-internals/types';
import {
  UseMobileRangePickerSlots,
  UseMobileRangePickerSlotProps,
  MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import {
  BaseDateTimeRangePickerProps,
  BaseDateTimeRangePickerSlots,
  BaseDateTimeRangePickerSlotProps,
} from '../DateTimeRangePicker/shared';
import { DateTimeRangePickerView } from '../internals/models';

export interface MobileDateTimeRangePickerSlots
  extends BaseDateTimeRangePickerSlots,
    MakeOptional<UseMobileRangePickerSlots<DateTimeRangePickerView>, 'field'> {}

export interface MobileDateTimeRangePickerSlotProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends BaseDateTimeRangePickerSlotProps,
    Omit<
      UseMobileRangePickerSlotProps<DateTimeRangePickerView, TEnableAccessibleFieldDOMStructure>,
      'tabs' | 'toolbar'
    > {}

export interface MobileDateTimeRangePickerProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends BaseDateTimeRangePickerProps,
    MobileRangeOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDateTimeRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateTimeRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
}
