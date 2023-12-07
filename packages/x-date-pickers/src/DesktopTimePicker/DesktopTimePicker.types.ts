import {
  UseDesktopPickerSlots,
  ExportedUseDesktopPickerSlotProps,
  DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseTimePickerProps,
  BaseTimePickerSlots,
  BaseTimePickerSlotProps,
} from '../TimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { TimeViewWithMeridiem } from '../internals/models';
import { DesktopOnlyTimePickerProps } from '../internals/models/props/clock';
import { DigitalClockSlots, DigitalClockSlotProps } from '../DigitalClock';
import {
  MultiSectionDigitalClockSlots,
  MultiSectionDigitalClockSlotProps,
} from '../MultiSectionDigitalClock';
import { TimeView } from '../models';

export interface DesktopTimePickerSlots<TDate>
  extends BaseTimePickerSlots<TDate>,
    MakeOptional<UseDesktopPickerSlots<TDate, TimeViewWithMeridiem>, 'field' | 'openPickerIcon'>,
    DigitalClockSlots,
    MultiSectionDigitalClockSlots {}

export interface DesktopTimePickerSlotProps<TDate>
  extends BaseTimePickerSlotProps,
    ExportedUseDesktopPickerSlotProps<TDate, TimeViewWithMeridiem>,
    DigitalClockSlotProps,
    MultiSectionDigitalClockSlotProps {}

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
  slots?: DesktopTimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopTimePickerSlotProps<TDate>;
}
