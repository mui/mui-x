import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { SlotComponentProps } from '@mui/base/utils';
import { CalendarOrClockPickerView, MuiPickersAdapter } from '../../models';
import { BasePickerProps2 } from '../../models/props/basePickerProps';
import {
  PickersModalDialogSlotsComponent,
  PickersModalDialogSlotsComponentsProps,
} from '../../components/PickersModalDialog';
import { UsePickerParams } from '../usePicker';
import { BaseFieldProps } from '../../models/fields';

export interface UseMobilePickerSlotsComponent extends PickersModalDialogSlotsComponent {
  Field: React.ElementType;
  Input?: React.ElementType<TextFieldProps>;
}

// TODO: Type props of all slots
export interface UseMobilePickerSlotsComponentsProps<TDate>
  extends PickersModalDialogSlotsComponentsProps {
  field?: SlotComponentProps<React.ElementType<BaseFieldProps<TDate | null, unknown>>, {}, unknown>;
  input?: SlotComponentProps<typeof TextField, {}, unknown>;
}

export interface ExportedUseMobilePickerProps {}

interface UseMobilePickerProps<TDate, TView extends CalendarOrClockPickerView>
  extends BasePickerProps2<TDate | null, TDate, TView> {
  /**
   * Force rendering in particular orientation.
   */
  orientation?: 'portrait' | 'landscape';
  /**
   * Overrideable components.
   * @default {}
   */
  components: UseMobilePickerSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: UseMobilePickerSlotsComponentsProps<TDate>;
}

export interface UseMobilePickerParams<TDate, TView extends CalendarOrClockPickerView>
  extends Pick<
    UsePickerParams<TDate | null, TDate, TView, {}>,
    'props' | 'valueManager' | 'sectionModeLookup' | 'renderViews'
  > {
  props: UseMobilePickerProps<TDate, TView>;
  getOpenDialogAriaText: (date: TDate | null, utils: MuiPickersAdapter<TDate>) => string;
}
