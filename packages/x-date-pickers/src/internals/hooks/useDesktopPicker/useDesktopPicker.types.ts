import * as React from 'react';
import { IconButtonProps } from '@mui/material/IconButton';
import { InputAdornmentProps } from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { SlotComponentProps } from '@mui/base/utils';
import { CalendarOrClockPickerView, MuiPickersAdapter } from '../../models';
import { BasePickerProps2 } from '../../models/props/basePickerProps';
import {
  PickersPopperSlotsComponent,
  PickersPopperSlotsComponentsProps,
} from '../../components/PickersPopper';
import { UsePickerParams } from '../usePicker';
import { BaseFieldProps } from '../../models/fields';

export interface UseDesktopPickerSlotsComponent extends PickersPopperSlotsComponent {
  Field: React.ElementType;
  Input?: React.ElementType<TextFieldProps>;
  /**
   * Component disabled on the start or end input adornment used to open the picker.
   * @default InputAdornment
   */
  InputAdornment?: React.ElementType;
  /**
   * Button to open the picker.
   * @default IconButton
   */
  OpenPickerButton?: React.ElementType;
  /**
   * Icon displayed in the open picker button.
   */
  OpenPickerIcon: React.ElementType;
}

export interface UseDesktopPickerSlotsComponentsProps<TDate>
  extends PickersPopperSlotsComponentsProps {
  field?: SlotComponentProps<React.ElementType<BaseFieldProps<TDate | null, unknown>>, {}, unknown>;
  input?: SlotComponentProps<typeof TextField, {}, unknown>;
  inputAdornment?: Partial<InputAdornmentProps>;
  openPickerButton?: Partial<IconButtonProps>;
  openPickerIcon?: Record<string, any>;
}

interface DesktopOnlyPickerProps {
  /**
   * Do not render open picker button (renders only the field).
   * @default false
   */
  disableOpenPicker?: boolean;
}

export interface UseDesktopPickerProps<TDate, TView extends CalendarOrClockPickerView>
  extends DesktopOnlyPickerProps,
    BasePickerProps2<TDate | null, TDate, TView> {
  /**
   * Overrideable components.
   * @default {}
   */
  components: UseDesktopPickerSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: UseDesktopPickerSlotsComponentsProps<TDate>;
}

export interface UseDesktopPickerParams<TDate, TView extends CalendarOrClockPickerView>
  extends Pick<
    UsePickerParams<TDate | null, TDate, TView, {}>,
    'props' | 'valueManager' | 'sectionModeLookup' | 'renderViews'
  > {
  props: UseDesktopPickerProps<TDate, TView>;
  getOpenDialogAriaText: (date: TDate | null, utils: MuiPickersAdapter<TDate>) => string;
}
