import { DesktopTimeClockClasses } from './desktopTimeClockClasses';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import { BaseClockProps, ExportedBaseClockProps } from '../internals/models/props/clock';
import { ClockTimeView } from '../internals/models';
import { DesktopTimeClockSectionProps } from './DesktopTimeClockSection';
import { MeridiemEnum } from '../internals/utils/time-utils';

export interface DesktopTimeClockSectionOption {
  disabled?: boolean;
  selected?: boolean;
  label: string;
  value: number | MeridiemEnum;
}

export interface ExportedDesktopTimeClockProps<TDate> extends ExportedBaseClockProps<TDate> {
  /**
   * Number representing the increment of precision at which to display minutes and seconds.
   * @default 5
   */
  timeStep?: number;
}

export interface DesktopTimeClockSectionViewProps
  extends Pick<DesktopTimeClockSectionProps, 'onChange' | 'items'> {}

export interface DesktopTimeClockSlotsComponent {}

export interface DesktopTimeClockSlotsComponentsProps {}

export interface DesktopTimeClockProps<TDate>
  extends ExportedDesktopTimeClockProps<TDate>,
    BaseClockProps<TDate, ClockTimeView> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DesktopTimeClockClasses>;
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: DesktopTimeClockSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: DesktopTimeClockSlotsComponentsProps;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DesktopTimeClockSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopTimeClockSlotsComponentsProps;
}
