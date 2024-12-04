import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import MenuItem from '@mui/material/MenuItem';
import { MultiSectionDigitalClockClasses } from './multiSectionDigitalClockClasses';
import {
  BaseClockProps,
  ExportedBaseClockProps,
  MultiSectionDigitalClockOnlyProps,
} from '../internals/models/props/time';
import { MultiSectionDigitalClockSectionProps } from './MultiSectionDigitalClockSection';
import { TimeViewWithMeridiem } from '../internals/models';

export interface MultiSectionDigitalClockOption<TSectionValue extends number | string> {
  isDisabled?: (value: TSectionValue) => boolean;
  isSelected: (value: TSectionValue) => boolean;
  isFocused: (value: TSectionValue) => boolean;
  label: string;
  value: TSectionValue;
  ariaLabel: string;
}

export interface ExportedMultiSectionDigitalClockProps
  extends ExportedBaseClockProps,
    MultiSectionDigitalClockOnlyProps {}

export interface MultiSectionDigitalClockViewProps<TSectionValue extends number | string>
  extends Pick<MultiSectionDigitalClockSectionProps<TSectionValue>, 'onChange' | 'items'> {}

export interface MultiSectionDigitalClockSlots {
  /**
   * Component responsible for rendering a single multi section digital clock section item.
   * @default MenuItem from '@mui/material'
   */
  digitalClockSectionItem?: React.ElementType;
}

export interface MultiSectionDigitalClockSlotProps {
  digitalClockSectionItem?: SlotComponentProps<typeof MenuItem, {}, Record<string, any>>;
}

export interface MultiSectionDigitalClockProps
  extends ExportedMultiSectionDigitalClockProps,
    BaseClockProps<TimeViewWithMeridiem> {
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
   * Overrideable component slots.
   * @default {}
   */
  slots?: MultiSectionDigitalClockSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiSectionDigitalClockSlotProps;
}
