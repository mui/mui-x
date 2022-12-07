import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import { DateInputProps } from '../PureDateInput';
import { PickersActionBarProps } from '../../../PickersActionBar';
import { WrapperVariant } from './WrapperVariantContext';

export interface DateInputPropsLike
  extends Omit<DateInputProps<any>, 'renderInput' | 'validationError'> {
  renderInput: (...args: any) => JSX.Element;
  validationError?: any;
}

export interface PickersSlotsComponent {
  /**
   * Custom component for the action bar, it is placed bellow the picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
  /**
   * Custom component wrapping the views of the desktop and static pickers (it is the direct child of the Paper component).
   * @default React.Fragment
   */
  PaperContent?: React.ElementType<{ children: React.ReactNode }>;
}

export interface PickersSlotsComponentsProps {
  /**
   * Props passed down to the action bar component.
   */
  actionBar?: SlotComponentProps<
    React.ComponentType<
      Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>
    >,
    {},
    { wrapperVariant: WrapperVariant }
  >;
  /**
   * Props passed down to the paper content component.
   * Can't be used without a custom PaperContent component since the default one is React.Fragment.
   */
  paperContent?: Record<string, any>;
}
