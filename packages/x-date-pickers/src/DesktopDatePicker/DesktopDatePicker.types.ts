import {
  UseDesktopPickerSlotsComponent,
  ExportedUseDesktopPickerSlotsComponentsProps,
  DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseDatePickerProps,
  BaseDatePickerSlotsComponent,
  BaseDatePickerSlotsComponentsProps,
} from '../DatePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { DateView } from '../models';

export interface DesktopDatePickerSlotsComponent<TDate>
  extends BaseDatePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopPickerSlotsComponent<TDate, DateView>, 'field' | 'openPickerIcon'> {}

export interface DesktopDatePickerSlotsComponentsProps<TDate>
  extends BaseDatePickerSlotsComponentsProps<TDate>,
    ExportedUseDesktopPickerSlotsComponentsProps<TDate, DateView> {}

export interface DesktopDatePickerProps<TDate>
  extends BaseDatePickerProps<TDate>,
    DesktopOnlyPickerProps<TDate> {
  /**
   * Years rendered per row.
   * @default 4
   */
  yearsPerRow?: 3 | 4;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopDatePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDatePickerSlotsComponentsProps<TDate>;
}
