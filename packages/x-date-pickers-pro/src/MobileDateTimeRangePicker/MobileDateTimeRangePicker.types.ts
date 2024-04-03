import { MakeOptional } from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
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

export interface MobileDateTimeRangePickerSlots<TDate extends PickerValidDate>
  extends BaseDateTimeRangePickerSlots<TDate>,
    MakeOptional<UseMobileRangePickerSlots<TDate, DateTimeRangePickerView>, 'field'> {}

export interface MobileDateTimeRangePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends BaseDateTimeRangePickerSlotProps<TDate>,
    Omit<
      UseMobileRangePickerSlotProps<
        TDate,
        DateTimeRangePickerView,
        TEnableAccessibleFieldDOMStructure
      >,
      'tabs' | 'toolbar'
    > {}

export interface MobileDateTimeRangePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> extends BaseDateTimeRangePickerProps<TDate>,
    MobileRangeOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileDateTimeRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileDateTimeRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
}
