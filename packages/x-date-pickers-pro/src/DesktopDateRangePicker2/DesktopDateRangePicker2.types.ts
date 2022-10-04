import { MakeOptional } from '@mui/x-date-pickers/internals';
import {
  UseDesktopRangePickerSlotsComponent,
  UseDesktopRangePickerSlotsComponentsProps,
} from '../internal/hooks/useDesktopRangePicker';
import { BaseDateRangePicker2Props } from '../DateRangePicker2/shared';
import {
  DateRangePickerViewSlotsComponent,
  DateRangePickerViewSlotsComponentsProps,
} from '../DateRangePicker/DateRangePickerView';

export interface DesktopDateRangePicker2SlotsComponent
  extends MakeOptional<UseDesktopRangePickerSlotsComponent, 'Field'>,
    DateRangePickerViewSlotsComponent {}

export interface DesktopDateRangePicker2SlotsComponentsProps
  extends UseDesktopRangePickerSlotsComponentsProps,
    DateRangePickerViewSlotsComponentsProps {}

export interface DesktopDateRangePicker2Props<TDate> extends BaseDateRangePicker2Props<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopDateRangePicker2SlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopDateRangePicker2SlotsComponentsProps;
}
