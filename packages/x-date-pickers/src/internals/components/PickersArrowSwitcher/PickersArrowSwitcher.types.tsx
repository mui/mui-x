import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { PickersArrowSwitcherClasses } from './pickersArrowSwitcherClasses';
import { UncapitalizeObjectKeys } from '../../utils/slots-migration';

export interface ExportedPickersArrowSwitcherProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<PickersArrowSwitcherSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PickersArrowSwitcherSlotsComponentsProps;
  classes?: Partial<PickersArrowSwitcherClasses>;
}

export interface PickersArrowSwitcherProps
  extends ExportedPickersArrowSwitcherProps,
    Omit<React.HTMLProps<HTMLDivElement>, 'ref' | 'as'> {
  children?: React.ReactNode;
  isPreviousDisabled: boolean;
  isPreviousHidden?: boolean;
  onGoToPrevious: () => void;
  previousLabel: string;
  isNextDisabled: boolean;
  isNextHidden?: boolean;
  onGoToNext: () => void;
  nextLabel: string;
}

export type PickersArrowSwitcherOwnerState = PickersArrowSwitcherProps;

export interface PickersArrowSwitcherComponentsPropsOverrides {}

export interface PickersArrowSwitcherSlotsComponent {
  /**
   * Button allowing to switch to the left view.
   * @default IconButton
   */
  PreviousIconButton?: React.ElementType;
  /**
   * Button allowing to switch to the right view.
   * @default IconButton
   */
  NextIconButton?: React.ElementType;
  /**
   * Icon displayed in the left view switch button.
   * @default ArrowLeft
   */
  LeftArrowIcon?: React.ElementType;
  /**
   * Icon displayed in the right view switch button.
   * @default ArrowRight
   */
  RightArrowIcon?: React.ElementType;
}

export interface PickersArrowSwitcherButtonSlotOwnerState extends PickersArrowSwitcherOwnerState {
  hidden?: boolean;
}

export interface PickersArrowSwitcherSlotsComponentsProps {
  previousIconButton?: SlotComponentProps<
    typeof IconButton,
    PickersArrowSwitcherComponentsPropsOverrides,
    PickersArrowSwitcherButtonSlotOwnerState
  >;
  nextIconButton?: SlotComponentProps<
    typeof IconButton,
    PickersArrowSwitcherComponentsPropsOverrides,
    PickersArrowSwitcherButtonSlotOwnerState
  >;
  leftArrowIcon?: SlotComponentProps<
    typeof SvgIcon,
    PickersArrowSwitcherComponentsPropsOverrides,
    undefined
  >;
  rightArrowIcon?: SlotComponentProps<
    typeof SvgIcon,
    PickersArrowSwitcherComponentsPropsOverrides,
    undefined
  >;
}
