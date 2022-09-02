import * as React from 'react';
import { SlotComponentProps } from '@mui/base';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';

export interface ExportedPickersArrowSwitcherProps {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<PickersArrowSwitcherSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<PickersArrowSwitcherSlotsComponentsProps>;
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
  LeftArrowButton: React.ElementType;
  /**
   * Icon displayed in the left view switch button.
   * @default ArrowLeft
   */
  LeftArrowIcon: React.ElementType;
  /**
   * Button allowing to switch to the right view.
   * @default IconButton
   */
  RightArrowButton: React.ElementType;
  /**
   * Icon displayed in the right view switch button.
   * @default ArrowRight
   */
  RightArrowIcon: React.ElementType;
}

export interface PickersArrowSwitcherSlotsComponentsProps {
  leftArrowButton: SlotComponentProps<
    typeof IconButton,
    PickersArrowSwitcherComponentsPropsOverrides,
    PickersArrowSwitcherOwnerState & { hidden?: boolean }
  >;
  leftArrowIcon: SlotComponentProps<
    typeof SvgIcon,
    PickersArrowSwitcherComponentsPropsOverrides,
    undefined
  >;
  rightArrowButton: SlotComponentProps<
    typeof IconButton,
    PickersArrowSwitcherComponentsPropsOverrides,
    PickersArrowSwitcherOwnerState & { hidden?: boolean }
  >;
  rightArrowIcon: SlotComponentProps<
    typeof SvgIcon,
    PickersArrowSwitcherComponentsPropsOverrides,
    undefined
  >;
}
