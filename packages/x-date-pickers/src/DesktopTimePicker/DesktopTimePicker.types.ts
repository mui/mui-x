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
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import { DesktopOnlyTimePickerProps } from '../internals/models/props/clock';
import { DigitalClockSlotsComponent, DigitalClockSlotsComponentsProps } from '../DigitalClock';
import {
  MultiSectionDigitalClockSlotsComponent,
  MultiSectionDigitalClockSlotsComponentsProps,
} from '../MultiSectionDigitalClock';

export interface DesktopTimePickerSlotsComponent<
  TDate,
  TView extends TimeViewWithMeridiem = TimeViewWithMeridiem,
> extends BaseTimePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopPickerSlotsComponent<TDate, TView>, 'Field' | 'OpenPickerIcon'>,
    DigitalClockSlotsComponent,
    MultiSectionDigitalClockSlotsComponent {}

export interface DesktopTimePickerSlotsComponentsProps<
  TDate,
  TView extends TimeViewWithMeridiem = TimeViewWithMeridiem,
> extends BaseTimePickerSlotsComponentsProps,
    ExportedUseDesktopPickerSlotsComponentsProps<TDate, TView>,
    DigitalClockSlotsComponentsProps,
    MultiSectionDigitalClockSlotsComponentsProps {}

export interface DesktopTimePickerProps<
  TDate,
  TView extends TimeViewWithMeridiem = TimeViewWithMeridiem,
> extends BaseTimePickerProps<TDate, TView>,
    DesktopOnlyPickerProps<TDate>,
    DesktopOnlyTimePickerProps<TDate> {
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: DesktopTimePickerSlotsComponent<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: DesktopTimePickerSlotsComponentsProps<TDate, TView>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DesktopTimePickerSlotsComponent<TDate, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopTimePickerSlotsComponentsProps<TDate, TView>;
}
