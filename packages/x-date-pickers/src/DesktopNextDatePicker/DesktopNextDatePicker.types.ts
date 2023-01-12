import {
  UseDesktopPickerSlotsComponent,
  UseDesktopPickerSlotsComponentsProps,
  DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseNextDatePickerProps,
  BaseNextDatePickerSlotsComponent,
  BaseNextDatePickerSlotsComponentsProps,
} from '../NextDatePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { BaseNextNonStaticPickerExternalProps } from '../internals/models/props/basePickerProps';
import { DateView } from '../internals/models/views';

export interface DesktopNextDatePickerSlotsComponent<TDate>
  extends BaseNextDatePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopPickerSlotsComponent<TDate, DateView>, 'Field' | 'OpenPickerIcon'> {}

export interface DesktopNextDatePickerSlotsComponentsProps<TDate>
  extends BaseNextDatePickerSlotsComponentsProps<TDate>,
    UseDesktopPickerSlotsComponentsProps<TDate, DateView> {}

export interface DesktopNextDatePickerProps<TDate>
  extends BaseNextDatePickerProps<TDate>,
    DesktopOnlyPickerProps<TDate>,
    BaseNextNonStaticPickerExternalProps {
  /**
   * Years rendered per row.
   * @default 4
   */
  yearsPerRow?: 3 | 4;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopNextDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopNextDatePickerSlotsComponentsProps<TDate>;
}
