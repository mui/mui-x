import {
  UseDesktopPickerSlotsComponent,
  ExportedUseDesktopPickerSlotsComponentsProps,
  DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseDateTimePickerProps,
  BaseDateTimePickerSlotsComponent,
  BaseDateTimePickerSlotsComponentsProps,
} from '../DateTimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { DateOrTimeView } from '../models';
import { DesktopOnlyTimePickerProps } from '../internals/models/props/clock';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import {
  MultiSectionDigitalClockSlotsComponent,
  MultiSectionDigitalClockSlotsComponentsProps,
} from '../MultiSectionDigitalClock';
import { DigitalClockSlotsComponent, DigitalClockSlotsComponentsProps } from '../DigitalClock';

export interface DesktopDateTimePickerSlotsComponent<TDate>
  extends BaseDateTimePickerSlotsComponent<TDate>,
    MakeOptional<
      UseDesktopPickerSlotsComponent<TDate, DateOrTimeViewWithMeridiem>,
      'field' | 'openPickerIcon'
    >,
    DigitalClockSlotsComponent,
    MultiSectionDigitalClockSlotsComponent {}

export interface DesktopDateTimePickerSlotsComponentsProps<TDate>
  extends BaseDateTimePickerSlotsComponentsProps<TDate>,
    ExportedUseDesktopPickerSlotsComponentsProps<TDate, DateOrTimeViewWithMeridiem>,
    DigitalClockSlotsComponentsProps,
    MultiSectionDigitalClockSlotsComponentsProps {}

export interface DesktopDateTimePickerProps<TDate>
  extends BaseDateTimePickerProps<TDate, DateOrTimeViewWithMeridiem>,
    DesktopOnlyPickerProps<TDate>,
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
  slots?: DesktopDateTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDateTimePickerSlotsComponentsProps<TDate>;
}
