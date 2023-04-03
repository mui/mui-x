import { MultiSectionDigitalClockClasses } from './multiSectionDigitalClockClasses';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import {
  BaseClockProps,
  DigitalClockOnlyProps,
  ExportedBaseClockProps,
} from '../internals/models/props/clock';
import { MultiSectionDigitalClockSectionProps } from './MultiSectionDigitalClockSection';

export interface MultiSectionDigitalClockOption<TValue> {
  isDisabled?: (value: TValue) => boolean;
  isSelected: (value: TValue) => boolean;
  label: string;
  value: TValue;
}

export interface ExportedMultiSectionDigitalClockProps<TDate>
  extends ExportedBaseClockProps<TDate>,
    DigitalClockOnlyProps {}

export interface MultiSectionDigitalClockViewProps<TValue>
  extends Pick<MultiSectionDigitalClockSectionProps<TValue>, 'onChange' | 'items'> {}

export interface MultiSectionDigitalClockSlotsComponent {}

export interface MultiSectionDigitalClockSlotsComponentsProps {}

export interface MultiSectionDigitalClockProps<TDate>
  extends ExportedMultiSectionDigitalClockProps<TDate>,
    BaseClockProps<TDate> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<MultiSectionDigitalClockClasses>;
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: MultiSectionDigitalClockSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: MultiSectionDigitalClockSlotsComponentsProps;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<MultiSectionDigitalClockSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiSectionDigitalClockSlotsComponentsProps;
}
