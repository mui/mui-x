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
import { MakeOptional } from '../internals/models/helpers';
import { DateOrTimeView, FieldTextFieldVersion } from '../models';
import { DesktopOnlyTimePickerProps } from '../internals/models/props/clock';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import {
  MultiSectionDigitalClockSlots,
  MultiSectionDigitalClockSlotProps,
} from '../MultiSectionDigitalClock';
import { DigitalClockSlots, DigitalClockSlotProps } from '../DigitalClock';

export interface DesktopDateTimePickerSlots<TDate>
  extends BaseDateTimePickerSlots<TDate>,
    MakeOptional<
      UseDesktopPickerSlots<TDate, DateOrTimeViewWithMeridiem>,
      'field' | 'openPickerIcon'
    >,
    DigitalClockSlots,
    MultiSectionDigitalClockSlots {}

export interface DesktopDateTimePickerSlotProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends BaseDateTimePickerSlotProps<TDate>,
    ExportedUseDesktopPickerSlotProps<TDate, DateOrTimeViewWithMeridiem, TTextFieldVersion>,
    DigitalClockSlotProps,
    MultiSectionDigitalClockSlotProps {}

export interface DesktopDateTimePickerProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> extends BaseDateTimePickerProps<TDate, DateOrTimeViewWithMeridiem>,
    DesktopOnlyPickerProps,
    DesktopOnlyTimePickerProps<TDate> {
  /**
   * Available views.
   */
  views?: readonly DateOrTimeView[];
  /**
   * Years rendered per row.
   * @default 4
   */
  yearsPerRow?: 3 | 4;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopDateTimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDateTimePickerSlotProps<TDate, TTextFieldVersion>;
}
