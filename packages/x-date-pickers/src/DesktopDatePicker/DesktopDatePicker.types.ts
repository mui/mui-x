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
import { DateView } from '../models';

export interface DesktopDatePickerSlots<TDate>
  extends BaseDatePickerSlots<TDate>,
    MakeOptional<UseDesktopPickerSlots<TDate, DateView>, 'field' | 'openPickerIcon'> {}

export interface DesktopDatePickerSlotProps<TDate, TUseV6TextField extends boolean>
  extends BaseDatePickerSlotProps<TDate>,
    ExportedUseDesktopPickerSlotProps<TDate, DateView, TUseV6TextField> {}

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
  slots?: DesktopDatePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDatePickerSlotProps<TDate, TUseV6TextField>;
}
