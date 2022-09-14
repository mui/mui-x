import {
  DesktopPickerSlotsComponent,
  DesktopPickerSlotsComponentsProps,
  ExportedDesktopPickerProps,
} from '../internals/components/DesktopPicker';
import { CalendarPickerView } from '../internals/models';
import { MakeOptional } from '../internals/models/helpers';

export interface DesktopDatePicker2SlotsComponent
  extends MakeOptional<DesktopPickerSlotsComponent, 'Field' | 'OpenPickerIcon'> {}

export interface DesktopDatePicker2SlotsComponentsProps extends DesktopPickerSlotsComponentsProps {}

export interface DesktopDatePicker2Props<TDate>
  extends MakeOptional<
    ExportedDesktopPickerProps<TDate | null, TDate, CalendarPickerView>,
    'views' | 'openTo'
  > {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopDatePicker2SlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopDatePicker2SlotsComponentsProps;
}
