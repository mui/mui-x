import {
  StaticOnlyPickerProps,
  UseStaticPickerSlotsComponent,
  UseStaticPickerSlotsComponentsProps,
  MakeOptional,
} from '@mui/x-date-pickers/internals';
import {
  BaseNextDateRangePickerProps,
  BaseNextDateRangePickerSlotsComponent,
  BaseNextDateRangePickerSlotsComponentsProps,
} from '../NextDateRangePicker/shared';

export interface StaticNextDateRangePickerSlotsComponent<TDate>
  extends BaseNextDateRangePickerSlotsComponent<TDate>,
    UseStaticPickerSlotsComponent {}

export interface StaticNextDateRangePickerSlotsComponentsProps<TDate>
  extends BaseNextDateRangePickerSlotsComponentsProps<TDate>,
    UseStaticPickerSlotsComponentsProps {}

export interface StaticNextDateRangePickerProps<TDate>
  extends BaseNextDateRangePickerProps<TDate>,
    MakeOptional<StaticOnlyPickerProps, 'displayStaticWrapperAs'> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: StaticNextDateRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: StaticNextDateRangePickerSlotsComponentsProps<TDate>;
}
