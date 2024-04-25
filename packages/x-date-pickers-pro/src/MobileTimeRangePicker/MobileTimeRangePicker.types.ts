import { PickerValidDate } from '@mui/x-date-pickers/models';
import { MakeOptional, TimeViewWithMeridiem } from '@mui/x-date-pickers/internals';
import {
  UseMobileRangePickerSlots,
  UseMobileRangePickerSlotProps,
  MobileRangeOnlyPickerProps,
} from '../internals/hooks/useMobileRangePicker';
import {
  BaseTimeRangePickerProps,
  BaseTimeRangePickerSlots,
  BaseTimeRangePickerSlotProps,
} from '../TimeRangePicker/shared';

export interface MobileTimeRangePickerSlots<TDate extends PickerValidDate>
  extends BaseTimeRangePickerSlots<TDate>,
    MakeOptional<UseMobileRangePickerSlots<TDate, TimeViewWithMeridiem>, 'field'> {}

export interface MobileTimeRangePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends BaseTimeRangePickerSlotProps,
    Omit<
      UseMobileRangePickerSlotProps<
        TDate,
        TimeViewWithMeridiem,
        TEnableAccessibleFieldDOMStructure
      >,
      'tabs' | 'toolbar'
    > {}

export interface MobileTimeRangePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends BaseTimeRangePickerProps<TDate>,
    MobileRangeOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MobileTimeRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileTimeRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
}
