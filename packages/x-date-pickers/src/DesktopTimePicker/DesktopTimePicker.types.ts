import {
  UseDesktopPickerSlotsComponent,
  ExportedUseDesktopPickerSlotsComponentsProps,
  DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseTimePickerProps,
  BaseTimePickerSlotsComponent,
  BaseTimePickerSlotsComponentsProps,
} from '../TimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { TimeViewWithMeridiem } from '../internals/models';
import { DesktopOnlyTimePickerProps } from '../internals/models/props/clock';
import { DigitalClockSlotsComponent, DigitalClockSlotsComponentsProps } from '../DigitalClock';
import {
  MultiSectionDigitalClockSlotsComponent,
  MultiSectionDigitalClockSlotsComponentsProps,
} from '../MultiSectionDigitalClock';
import { TimeView } from '../models';

export interface DesktopTimePickerSlotsComponent<TDate>
  extends BaseTimePickerSlotsComponent<TDate>,
    MakeOptional<
      UseDesktopPickerSlotsComponent<TDate, TimeViewWithMeridiem>,
      'field' | 'openPickerIcon'
    >,
    DigitalClockSlotsComponent,
    MultiSectionDigitalClockSlotsComponent {}

export interface DesktopTimePickerSlotsComponentsProps<TDate>
  extends BaseTimePickerSlotsComponentsProps,
    ExportedUseDesktopPickerSlotsComponentsProps<TDate, TimeViewWithMeridiem>,
    DigitalClockSlotsComponentsProps,
    MultiSectionDigitalClockSlotsComponentsProps {}

export interface DesktopTimePickerProps<TDate>
  extends BaseTimePickerProps<TDate, TimeViewWithMeridiem>,
    DesktopOnlyPickerProps<TDate>,
    DesktopOnlyTimePickerProps<TDate> {
  /**
   * Available views.
   */
  views?: readonly TimeView[];
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopTimePickerSlotsComponentsProps<TDate>;
}
