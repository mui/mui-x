import * as React from 'react';
import { MenuItemProps } from '@mui/material/MenuItem';
import { MuiEvent, SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { MultiSectionDigitalClockClasses } from './multiSectionDigitalClockClasses';
import {
  BaseClockProps,
  ExportedBaseClockProps,
  MultiSectionDigitalClockOnlyProps,
} from '../internals/models/props/time';
import { MultiSectionDigitalClockSectionProps } from './MultiSectionDigitalClockSection';
import { TimeViewWithMeridiem } from '../internals/models';
import { PickerOwnerState } from '../models/pickers';

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

export interface MultiSectionDigitalClockSectionItemProps extends MenuItemProps {
  onClick?: (event: MuiEvent<React.MouseEvent<HTMLLIElement>>) => void;
}

export interface MultiSectionDigitalClockSlots {
  /**
   * Component responsible for rendering a single multi section digital clock section item.
   * @default MenuItem from '@mui/material'
   */
  digitalClockSectionItem?: React.ElementType<MultiSectionDigitalClockSectionItemProps>;
}

export interface MultiSectionDigitalClockSectionOwnerState extends PickerOwnerState {
  /**
   * `true` if this is not the initial render of the digital clock.
   */
  hasDigitalClockAlreadyBeenRendered: boolean;
}

export interface MultiSectionDigitalClockSlotProps {
  digitalClockSectionItem?: SlotComponentPropsFromProps<
    MultiSectionDigitalClockSectionItemProps,
    {},
    MultiSectionDigitalClockSectionOwnerState
  >;
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
