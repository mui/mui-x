import PropTypes from 'prop-types';
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
import { DateView, PickerValidDate } from '../models';

export interface DesktopDatePickerSlots<TDate extends PickerValidDate>
  extends BaseDatePickerSlots<TDate>,
    MakeOptional<UseDesktopPickerSlots<TDate, DateView>, 'field' | 'openPickerIcon'> {}

export interface DesktopDatePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends BaseDatePickerSlotProps<TDate>,
    ExportedUseDesktopPickerSlotProps<TDate, DateView, TEnableAccessibleFieldDOMStructure> {}

export interface DesktopDatePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> extends BaseDatePickerProps<TDate>,
    DesktopOnlyPickerProps {
  /**
   * If `false`, display the years in their default order (chronological)
   * If `true`, reverse the order of displayed years
   * @default false
   */
  reverseYears?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopDatePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDatePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
  /**
   * Years rendered per row.
   * @default 4
   */
  yearsPerRow?: 3 | 4;
}
