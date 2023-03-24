import { DigitalClockClasses } from './digitalClockClasses';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import { BaseClockProps, ExportedBaseClockProps } from '../internals/models/props/clock';

export interface ExportedDigitalClockProps<TDate> extends ExportedBaseClockProps<TDate> {
  /**
   * Number representing the increment of precision at which to display minutes and seconds in digital view.
   * @default 5
   */
  timeStep?: number;
}

export interface DigitalClockSlotsComponent {}

export interface DigitalClockSlotsComponentsProps {}

export interface DigitalClockProps<TDate>
  extends ExportedDigitalClockProps<TDate>,
    BaseClockProps<TDate> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DigitalClockClasses>;
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: DigitalClockSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: DigitalClockSlotsComponentsProps;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DigitalClockSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DigitalClockSlotsComponentsProps;
}
