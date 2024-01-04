import {
  UseDesktopPickerSlots,
  ExportedUseDesktopPickerSlotProps,
  DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseDatePickerProps,
  BaseDatePickerSlots,
  BaseDatePickerSlotProps,
} from '../DatePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { DateView, FieldTextFieldVersion } from '../models';

export interface DesktopDatePickerSlots<TDate>
  extends BaseDatePickerSlots<TDate>,
    MakeOptional<UseDesktopPickerSlots<TDate, DateView>, 'field' | 'openPickerIcon'> {}

export interface DesktopDatePickerSlotProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends BaseDatePickerSlotProps<TDate>,
    ExportedUseDesktopPickerSlotProps<TDate, DateView, TTextFieldVersion> {}

export interface DesktopDatePickerProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> extends BaseDatePickerProps<TDate>,
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
  slots?: DesktopDatePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDatePickerSlotProps<TDate, TTextFieldVersion>;
}
