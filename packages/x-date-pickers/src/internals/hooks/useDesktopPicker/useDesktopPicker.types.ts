import * as React from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { InputAdornmentProps } from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { SlotComponentProps } from '@mui/base/utils';
import { DateOrTimeView, MuiPickersAdapter } from '../../models';
import {
  BaseNextNonStaticPickerProps,
  BaseNextPickerProps,
} from '../../models/props/basePickerProps';
import {
  PickersPopperSlotsComponent,
  PickersPopperSlotsComponentsProps,
} from '../../components/PickersPopper';
import { UsePickerParams, UsePickerProps } from '../usePicker';
import { BaseFieldProps } from '../../models/fields';
import {
  ExportedPickersViewLayoutSlotsComponent,
  ExportedPickersViewLayoutSlotsComponentsProps,
} from '../../components/PickersViewLayout';
import { UsePickerValueNonStaticProps } from '../usePicker/usePickerValue';
import { UsePickerViewsNonStaticProps } from '../usePicker/usePickerViews';

export interface UseDesktopPickerSlotsComponent<TDate>
  extends PickersPopperSlotsComponent,
    ExportedPickersViewLayoutSlotsComponent {
  /**
   * Component used to enter the date with the keyboard.
   */
  Field: React.ElementType<BaseFieldProps<TDate | null, any>>;
  /**
   * Component used to render an HTML input inside the field.
   * @default TextField
   */
  Input?: React.ElementType<TextFieldProps>;
  /**
   * Component displayed on the start or end input adornment used to open the picker on desktop.
   * @default InputAdornment
   */
  InputAdornment?: React.ElementType<InputAdornmentProps>;
  /**
   * Button to open the picker on desktop.
   * @default IconButton
   */
  OpenPickerButton?: React.ElementType<IconButtonProps>;
  /**
   * Icon displayed in the open picker button on desktop.
   */
  OpenPickerIcon: React.ElementType;
}

export interface UseDesktopPickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  // TODO v6: Remove `Pick` once `PickerPoppers` does not handle the layouting parts
  extends Pick<
      PickersPopperSlotsComponentsProps,
      'desktopPaper' | 'desktopTransition' | 'desktopTrapFocus' | 'popper' | 'paperContent'
    >,
    ExportedPickersViewLayoutSlotsComponentsProps<TDate | null, TView> {
  field?: SlotComponentProps<
    React.ElementType<BaseFieldProps<TDate | null, unknown>>,
    {},
    UsePickerProps<TDate | null, any, any>
  >;
  input?: SlotComponentProps<typeof TextField, {}, Record<string, any>>;
  inputAdornment?: Partial<InputAdornmentProps>;
  openPickerButton?: SlotComponentProps<
    typeof IconButton,
    {},
    UseDesktopPickerProps<TDate, any, any>
  >;
  openPickerIcon?: Record<string, any>;
}

export interface DesktopOnlyPickerProps<TDate>
  extends BaseNextNonStaticPickerProps,
    UsePickerValueNonStaticProps<TDate | null>,
    UsePickerViewsNonStaticProps {}

export interface UseDesktopPickerProps<TDate, TView extends DateOrTimeView, TError>
  extends BaseNextPickerProps<TDate | null, TDate, TView, TError>,
    DesktopOnlyPickerProps<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components: UseDesktopPickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: UseDesktopPickerSlotsComponentsProps<TDate, TView>;
}

export interface UseDesktopPickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseDesktopPickerProps<TDate, TView, any>,
> extends Pick<
    UsePickerParams<TDate | null, TDate, TView, TExternalProps, {}>,
    'valueManager' | 'viewLookup' | 'validator'
  > {
  props: TExternalProps;
  getOpenDialogAriaText: (date: TDate | null, utils: MuiPickersAdapter<TDate>) => string;
}
