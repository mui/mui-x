import { SlotComponentProps } from '@mui/base/utils';
import MenuItem from '@mui/material/MenuItem';
import { DigitalClockClasses } from './digitalClockClasses';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import {
  BaseClockProps,
  DigitalClockOnlyProps,
  ExportedBaseClockProps,
} from '../internals/models/props/clock';
import { TimeView } from '../models';

export interface ExportedDigitalClockProps<TDate>
  extends ExportedBaseClockProps<TDate>,
    DigitalClockOnlyProps {}

export interface DigitalClockSlotsComponent {
  /**
   * Component responsible for rendering a single digital clock item.
   * @default MenuItem from '@mui/material'
   */
  DigitalClockItem?: React.ElementType;
}

export interface DigitalClockSlotsComponentsProps {
  digitalClockItem?: SlotComponentProps<typeof MenuItem, {}, Record<string, any>>;
}

export interface DigitalClockProps<TDate>
  extends ExportedDigitalClockProps<TDate>,
    BaseClockProps<TDate, Extract<TimeView, 'hours'>> {
  /**
   * Available views.
   * @default ['hours']
   */
  views?: readonly 'hours'[];
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
