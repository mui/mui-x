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

export interface UseMobilePickerProps<TDate, TView extends CalendarOrClockPickerView>
  extends BasePickerProps2<TDate | null, TDate, TView> {
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

export interface UseMobilePickerParams<TDate, TView extends CalendarOrClockPickerView>
  extends Omit<
    UsePickerParams<TDate | null, TDate, TView>,
    'props' | 'wrapperVariant' | 'inputRef'
  > {
  props: UseMobilePickerProps<TDate, TView>;
  getOpenDialogAriaText: (date: TDate, utils: MuiPickersAdapter<TDate>) => string;
}
