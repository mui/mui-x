import * as React from 'react';
import { SlotComponentProps } from '@mui/base';

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
  /**
   * Left arrow icon aria-label text.
   * @deprecated
   */
  leftArrowButtonText?: string;
  /**
   * Right arrow icon aria-label text.
   * @deprecated
   */
  rightArrowButtonText?: string;
}

export interface PickersArrowSwitcherProps
  extends ExportedPickersArrowSwitcherProps,
    Omit<React.HTMLProps<HTMLDivElement>, 'ref' | 'as'> {
  children?: React.ReactNode;
  isLeftDisabled: boolean;
  isLeftHidden?: boolean;
  isRightDisabled: boolean;
  isRightHidden?: boolean;
  onLeftClick: () => void;
  onRightClick: () => void;
}

export interface PickersArrowSwitchComponentsPropsOverrides {}

export interface PickersArrowSwitcherSlotsComponent {
  LeftArrowButton: React.ElementType;
  LeftArrowIcon: React.ElementType;
  RightArrowButton: React.ElementType;
  RightArrowIcon: React.ElementType;
}

export interface PickersArrowSwitcherSlotsComponentsProps {
  leftArrowButton: SlotComponentProps<
    'button',
    PickersArrowSwitchComponentsPropsOverrides,
    PickersArrowSwitcherProps
  >;
  rightArrowButton: SlotComponentProps<
    'button',
    PickersArrowSwitchComponentsPropsOverrides,
    PickersArrowSwitcherProps
  >;
}
