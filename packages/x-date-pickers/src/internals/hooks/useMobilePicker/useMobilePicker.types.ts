import * as React from 'react';
import { CalendarOrClockPickerView } from '../../models/views';
import { UsePickerParams } from '../usePicker';
import { BasePickerProps2 } from '../../models/props/basePickerProps';
import { MuiPickersAdapter } from '../../models';
import {
  PickersModalDialogSlotsComponent,
  PickersModalDialogSlotsComponentsProps,
} from '../../components/PickersModalDialog';

export interface UseMobilePickerSlotsComponent extends PickersModalDialogSlotsComponent {
  Field: React.ElementType;
  Input?: React.ElementType;
}

// TODO: Type props of all slots
export interface UseMobilePickerSlotsComponentsProps
  extends PickersModalDialogSlotsComponentsProps {
  field?: Record<string, any>;
  input?: Record<string, any>;
}

export interface UseMobilePickerProps<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends BasePickerProps2<TValue, TDate, TView> {
  /**
   * Overrideable components.
   * @default {}
   */
  components: UseMobilePickerSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: UseMobilePickerSlotsComponentsProps;
}

export interface UseMobilePickerParams<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends Omit<UsePickerParams<TValue, TDate, TView>, 'props' | 'wrapperVariant'> {
  props: UseMobilePickerProps<TValue, TDate, TView>;
  getOpenDialogAriaText: (date: TDate, utils: MuiPickersAdapter<TDate>) => string;
}
