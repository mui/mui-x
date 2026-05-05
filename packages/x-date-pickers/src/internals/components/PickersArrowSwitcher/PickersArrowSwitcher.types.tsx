import * as React from 'react';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { PickersArrowSwitcherClasses } from './pickersArrowSwitcherClasses';
import { PickerOwnerState } from '../../../models';

export interface ExportedPickersArrowSwitcherProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: PickersArrowSwitcherSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PickersArrowSwitcherSlotProps;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickersArrowSwitcherClasses>;
  /**
   * Format used to display the date.
   * @default `${adapter.formats.month} ${adapter.formats.year}`
   */
  format?: string;
}

export interface PickersArrowSwitcherProps
  extends ExportedPickersArrowSwitcherProps, Omit<React.HTMLProps<HTMLDivElement>, 'ref' | 'as'> {
  children?: React.ReactNode;
  isPreviousDisabled: boolean;
  isPreviousHidden?: boolean;
  onGoToPrevious: () => void;
  previousLabel: string;
  isNextDisabled: boolean;
  isNextHidden?: boolean;
  onGoToNext: () => void;
  nextLabel: string;
  labelId?: string;
}

export interface PickersArrowSwitcherOwnerState extends PickerOwnerState {
  /**
   * If `true`, this button should be hidden.
   */
  isButtonHidden: boolean;
}

export interface PickersArrowSwitcherSlotPropsOverrides {}

export interface PickersArrowSwitcherSlots {
  /**
   * Button allowing to switch to the left view.
   * @default IconButton
   */
  previousIconButton?: React.ElementType;
  /**
   * Button allowing to switch to the right view.
   * @default IconButton
   */
  nextIconButton?: React.ElementType;
  /**
   * Icon displayed in the left view switch button.
   * @default ArrowLeft
   */
  leftArrowIcon?: React.ElementType;
  /**
   * Icon displayed in the right view switch button.
   * @default ArrowRight
   */
  rightArrowIcon?: React.ElementType;
}

export interface PickersArrowSwitcherSlotProps {
  previousIconButton?: SlotComponentPropsFromProps<
    typeof IconButton,
    PickersArrowSwitcherSlotPropsOverrides,
    PickersArrowSwitcherOwnerState
  >;
  nextIconButton?: SlotComponentPropsFromProps<
    typeof IconButton,
    PickersArrowSwitcherSlotPropsOverrides,
    PickersArrowSwitcherOwnerState
  >;
  leftArrowIcon?: SlotComponentPropsFromProps<
    typeof SvgIcon,
    PickersArrowSwitcherSlotPropsOverrides,
    PickerOwnerState
  >;
  rightArrowIcon?: SlotComponentPropsFromProps<
    typeof SvgIcon,
    PickersArrowSwitcherSlotPropsOverrides,
    PickerOwnerState
  >;
}
