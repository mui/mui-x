import * as React from 'react';
import {PaperProps as MuiPaperProps} from "@mui/material/Paper/Paper";
import { DateInputProps } from '../PureDateInput';
import { PickersActionBarProps } from '../../../PickersActionBar';

export interface DateInputPropsLike
  extends Omit<DateInputProps<any>, 'renderInput' | 'validationError'> {
  renderInput: (...args: any) => JSX.Element;
  validationError?: any;
}


export interface PickersWrapperSlotsComponent {
  /**
   * The action bar placed bellow picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
  Paper?: React.ElementType<MuiPaperProps>;
  /**
   * The content of the Paper wrapping views.
   * @default React.Fragment
   */
  PaperContent?: React.ElementType<{ children: React.ReactNode }>;
}

export interface PickersWrapperSlotsComponentsProps {
  actionBar?: Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>;
  paperContent?: Record<string, any>;
  /**
   * Paper props passed down to [Paper](https://mui.com/material-ui/api/paper/) component.
   */
  paper?: Partial<MuiPaperProps>;
}