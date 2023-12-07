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

export interface DesktopDatePickerSlotsComponent<TDate, TUseV6TextField extends boolean>
  extends BaseDatePickerSlotsComponent<TDate>,
    MakeOptional<
      UseDesktopPickerSlotsComponent<TDate, DateView, TUseV6TextField>,
      'field' | 'openPickerIcon'
    > {}

export interface DesktopDatePickerSlotsComponentsProps<TDate, TUseV6TextField extends boolean>
  extends BaseDatePickerSlotsComponentsProps<TDate>,
    ExportedUseDesktopPickerSlotsComponentsProps<TDate, DateView, TUseV6TextField> {}

export interface DesktopDatePickerProps<TDate, TUseV6TextField extends boolean = false>
  extends BaseDatePickerProps<TDate>,
    DesktopOnlyPickerProps {
  /**
   * Years rendered per row.
   * @default 4
   */
  yearsPerRow?: 3 | 4;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopDatePickerSlotsComponent<TDate, TUseV6TextField>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDatePickerSlotsComponentsProps<TDate, TUseV6TextField>;
}
