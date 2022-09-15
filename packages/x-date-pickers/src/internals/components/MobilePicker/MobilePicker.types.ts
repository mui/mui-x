import * as React from 'react';
import { CalendarOrClockPickerView, MuiPickersAdapter } from '../../models';
import { PickerStateProps2 } from '../../hooks/usePickerState2';
import { PickerViewManagerProps } from '../PickerViewManager';
import { PickerStateValueManager } from '../../hooks/usePickerState';
import {
  PickersModalDialogSlotsComponent,
  PickersModalDialogSlotsComponentsProps,
} from '../PickersModalDialog';

export interface MobilePickerSlotsComponent extends PickersModalDialogSlotsComponent {
  Field: React.ElementType;
  Input?: React.ElementType;
}

// TODO: Type props of all slots
export interface MobilePickerSlotsComponentsProps extends PickersModalDialogSlotsComponentsProps {
  field?: Record<string, any>;
  input?: Record<string, any>;
}

export interface MobilePickerProps<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends PickerStateProps2<TValue>,
    Omit<PickerViewManagerProps<TValue, TDate, TView>, 'value' | 'onChange'> {
  /**
   * Class name applied to the root element.
   */
  className?: string;
  valueManager: PickerStateValueManager<TValue, TValue, TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  components: MobilePickerSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: MobilePickerSlotsComponentsProps;
  /**
   * Get aria-label text for control that opens picker dialog. Aria-label text must include selected date. @DateIOType
   * @template TInputDate, TDate
   * @param {TInputDate} date The date from which we want to add an aria-text.
   * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.
   * @returns {string} The aria-text to render inside the dialog.
   * @default (date, utils) => `Choose date, selected date is ${utils.format(utils.date(date), 'fullDate')}`
   */
  getOpenDialogAriaText: (date: TDate, utils: MuiPickersAdapter<TDate>) => string;
  /**
   * Format of the date when rendered in the input(s).
   */
  inputFormat: string;
}

export interface ExportedMobilePickerProps<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends Omit<
    MobilePickerProps<TValue, TDate, TView>,
    'valueManager' | 'renderViews' | 'components' | 'componentsProps' | 'getOpenDialogAriaText'
  > {}
