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

export interface DesktopTimePickerSlotsComponent<TDate, TUseV6TextField extends boolean>
  extends BaseTimePickerSlotsComponent<TDate>,
    MakeOptional<
      UseDesktopPickerSlotsComponent<TDate, TimeViewWithMeridiem, TUseV6TextField>,
      'field' | 'openPickerIcon'
    >,
    DigitalClockSlotsComponent,
    MultiSectionDigitalClockSlotsComponent {}

export interface DesktopTimePickerSlotsComponentsProps<TDate, TUseV6TextField extends boolean>
  extends BaseTimePickerSlotsComponentsProps,
    ExportedUseDesktopPickerSlotsComponentsProps<TDate, TimeViewWithMeridiem, TUseV6TextField>,
    DigitalClockSlotsComponentsProps,
    MultiSectionDigitalClockSlotsComponentsProps {}

export interface DesktopTimePickerProps<TDate, TUseV6TextField extends boolean = false>
  extends BaseTimePickerProps<TDate, TimeViewWithMeridiem>,
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
  slots?: DesktopTimePickerSlotsComponent<TDate, TUseV6TextField>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopTimePickerSlotsComponentsProps<TDate, TUseV6TextField>;
}
