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
import { FieldTextFieldVersion, TimeView } from '../models';

export interface DesktopTimePickerSlots<TDate>
  extends BaseTimePickerSlots<TDate>,
    MakeOptional<UseDesktopPickerSlots<TDate, TimeViewWithMeridiem>, 'field' | 'openPickerIcon'>,
    DigitalClockSlots,
    MultiSectionDigitalClockSlots {}

export interface DesktopTimePickerSlotProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends BaseTimePickerSlotProps,
    ExportedUseDesktopPickerSlotProps<TDate, TimeViewWithMeridiem, TTextFieldVersion>,
    DigitalClockSlotProps,
    MultiSectionDigitalClockSlotProps {}

export interface DesktopTimePickerProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> extends BaseTimePickerProps<TDate, TimeViewWithMeridiem>,
    DesktopOnlyPickerProps,
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
  slotProps?: DesktopTimePickerSlotProps<TDate, TTextFieldVersion>;
}
