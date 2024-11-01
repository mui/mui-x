import { MakeOptional } from '@mui/x-internals/types';
import {
  UseDesktopPickerSlots,
  ExportedUseDesktopPickerSlotProps,
  DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseDateTimePickerProps,
  BaseDateTimePickerSlots,
  BaseDateTimePickerSlotProps,
} from '../DateTimePicker/shared';
import { DateOrTimeView, PickerValidDate } from '../models';
import { DesktopOnlyTimePickerProps } from '../internals/models/props/time';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import {
  MultiSectionDigitalClockSlots,
  MultiSectionDigitalClockSlotProps,
} from '../MultiSectionDigitalClock';
import { DigitalClockSlots, DigitalClockSlotProps } from '../DigitalClock';
import { ExportedYearCalendarProps } from '../YearCalendar/YearCalendar.types';

export interface DesktopDateTimePickerSlots<TDate extends PickerValidDate>
  extends BaseDateTimePickerSlots<TDate>,
    MakeOptional<
      UseDesktopPickerSlots<TDate, DateOrTimeViewWithMeridiem>,
      'field' | 'openPickerIcon'
    >,
    DigitalClockSlots,
    MultiSectionDigitalClockSlots {}

export interface DesktopDateTimePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends BaseDateTimePickerSlotProps<TDate>,
    ExportedUseDesktopPickerSlotProps<
      TDate,
      DateOrTimeViewWithMeridiem,
      TEnableAccessibleFieldDOMStructure
    >,
    DigitalClockSlotProps,
    MultiSectionDigitalClockSlotProps {}

export interface DesktopDateTimePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends BaseDateTimePickerProps<TDate, DateOrTimeViewWithMeridiem>,
    DesktopOnlyPickerProps,
    DesktopOnlyTimePickerProps<TDate>,
    ExportedYearCalendarProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopDateTimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDateTimePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
  /**
   * Available views.
   */
  views?: readonly DateOrTimeView[];
  /**
   * Years rendered per row.
   * @default 4
   */
  yearsPerRow?: 3 | 4;
}
