import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import MenuItem from '@mui/material/MenuItem';
import { DigitalClockClasses } from './digitalClockClasses';
import {
  BaseClockProps,
  DigitalClockOnlyProps,
  ExportedBaseClockProps,
} from '../internals/models/props/time';
import { TimeView } from '../models';

export interface ExportedDigitalClockProps extends ExportedBaseClockProps, DigitalClockOnlyProps {}

export interface DigitalClockSlots {
  /**
   * Component responsible for rendering a single digital clock item.
   * @default MenuItem from '@mui/material'
   */
  digitalClockItem?: React.ElementType;
}

export interface DigitalClockSlotProps {
  digitalClockItem?: SlotComponentProps<typeof MenuItem, {}, Record<string, any>>;
}

export interface DigitalClockProps
  extends ExportedDigitalClockProps,
    BaseClockProps<Extract<TimeView, 'hours'>> {
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
   * Overrideable component slots.
   * @default {}
   */
  slots?: DigitalClockSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DigitalClockSlotProps;
}
