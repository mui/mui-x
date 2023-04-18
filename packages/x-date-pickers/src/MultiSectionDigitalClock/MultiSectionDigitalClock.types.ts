import { SlotComponentProps } from '@mui/base/utils';
import MenuItem from '@mui/material/MenuItem';
import { MultiSectionDigitalClockClasses } from './multiSectionDigitalClockClasses';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import {
  BaseClockProps,
  DigitalClockOnlyProps,
  ExportedBaseClockProps,
} from '../internals/models/props/clock';
import { MultiSectionDigitalClockSectionProps } from './MultiSectionDigitalClockSection';
import { TimeView } from '../models';

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

export interface MultiSectionDigitalClockSlotsComponent {
  /**
   * Component responsible for rendering a single digital clock section item.
   * @default MenuItem from '@mui/material'
   */
  DigitalClockSectionItem?: React.ElementType;
}

export interface MultiSectionDigitalClockSlotsComponentsProps {
  digitalClockSectionItem?: SlotComponentProps<typeof MenuItem, {}, Record<string, any>>;
}

export interface MultiSectionDigitalClockProps<TDate>
  extends ExportedMultiSectionDigitalClockProps<TDate>,
    BaseClockProps<TDate, TimeView> {
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
