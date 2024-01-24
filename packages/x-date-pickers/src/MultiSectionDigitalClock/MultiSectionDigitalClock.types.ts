import { SlotComponentProps } from '@mui/base/utils';
import MenuItem from '@mui/material/MenuItem';
import { MultiSectionDigitalClockClasses } from './multiSectionDigitalClockClasses';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import {
  BaseClockProps,
  ExportedBaseClockProps,
  MultiSectionDigitalClockOnlyProps,
} from '../internals/models/props/clock';
import { MultiSectionDigitalClockSectionProps } from './MultiSectionDigitalClockSection';
import { TimeViewWithMeridiem } from '../internals/models';

export interface MultiSectionDigitalClockOption<TValue> {
  isDisabled?: (value: TValue) => boolean;
  isSelected: (value: TValue) => boolean;
  label: string;
  value: TValue;
  ariaLabel: string;
}

export interface ExportedMultiSectionDigitalClockProps<TDate>
  extends ExportedBaseClockProps<TDate>,
    MultiSectionDigitalClockOnlyProps {}

export interface MultiSectionDigitalClockViewProps<TValue>
  extends Pick<MultiSectionDigitalClockSectionProps<TValue>, 'onChange' | 'items'> {}

export interface MultiSectionDigitalClockSlotsComponent {
  /**
   * Component responsible for rendering a single multi section digital clock section item.
   * @default MenuItem from '@mui/material'
   */
  DigitalClockSectionItem?: React.ElementType;
}

export interface MultiSectionDigitalClockSlotsComponentsProps {
  digitalClockSectionItem?: SlotComponentProps<typeof MenuItem, {}, Record<string, any>>;
}

export interface MultiSectionDigitalClockProps<TDate>
  extends ExportedMultiSectionDigitalClockProps<TDate>,
    BaseClockProps<TDate, TimeViewWithMeridiem> {
  /**
   * Available views.
   * @default ['hours', 'minutes']
   */
  views?: readonly TimeViewWithMeridiem[];
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
