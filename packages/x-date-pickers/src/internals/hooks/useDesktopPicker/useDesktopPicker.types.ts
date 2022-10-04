import * as React from 'react';
import { CalendarOrClockPickerView, MuiPickersAdapter } from '../../models';
import { BasePickerProps2 } from '../../models/props/basePickerProps';
import {
  PickersPopperSlotsComponent,
  PickersPopperSlotsComponentsProps,
} from '../../components/PickersPopper';
import { UsePickerParams } from '../usePicker';

export interface UseDesktopPickerSlotsComponent extends PickersPopperSlotsComponent {
  Field: React.ElementType;
  Input?: React.ElementType;
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

// TODO: Type props of all slots
export interface UseDesktopPickerSlotsComponentsProps extends PickersPopperSlotsComponentsProps {
  field?: Record<string, any>;
  input?: Record<string, any>;
  inputAdornment?: Record<string, any>;
  openPickerButton?: Record<string, any>;
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
  componentsProps?: UseDesktopPickerSlotsComponentsProps;
}

export interface UseDesktopPickerParams<TDate, TView extends CalendarOrClockPickerView>
  extends Pick<
    UsePickerParams<TDate | null, TDate, TView>,
    'props' | 'valueManager' | 'sectionModeLookup' | 'renderViews'
  > {
  props: UseDesktopPickerProps<TDate, TView>;
  getOpenDialogAriaText: (date: TDate, utils: MuiPickersAdapter<TDate>) => string;
}
