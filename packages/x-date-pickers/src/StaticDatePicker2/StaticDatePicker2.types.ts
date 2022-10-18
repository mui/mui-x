import {
  BaseDatePicker2Props,
  BaseDatePicker2SlotsComponent,
  BaseDatePicker2SlotsComponentsProps,
} from '../DatePicker2/shared';
import {
  StaticOnlyPickerProps,
  UseStaticPickerSlotsComponent,
  UseStaticPickerSlotsComponentsProps,
} from '../internals/hooks/useStaticPicker';

export interface StaticDatePicker2SlotsComponent<TDate>
  extends BaseDatePicker2SlotsComponent<TDate>,
    UseStaticPickerSlotsComponent {}

export interface StaticDatePicker2SlotsComponentsProps<TDate>
  extends BaseDatePicker2SlotsComponentsProps<TDate>,
    UseStaticPickerSlotsComponentsProps {}

export interface StaticDatePicker2Props<TDate>
  extends BaseDatePicker2Props<TDate>,
    StaticOnlyPickerProps {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: StaticDatePicker2SlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: StaticDatePicker2SlotsComponentsProps<TDate>;
}
