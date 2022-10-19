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
import {
  ExportedPickerViewLayoutSlotsComponent,
  ExportedPickerViewLayoutSlotsComponentsProps,
} from '../../components/PickerViewLayout';

export interface UseMobilePickerSlotsComponent
  // TODO v6: Remove `Pick` once `PickersModalDialog` does not handle the layouting parts
  extends Pick<PickersModalDialogSlotsComponent, 'Dialog' | 'MobilePaper' | 'MobileTransition'>,
    ExportedPickerViewLayoutSlotsComponent {
  Field: React.ElementType;
  Input?: React.ElementType<TextFieldProps>;
}

export interface UseMobilePickerSlotsComponentsProps<TDate>
  // TODO v6: Remove `Pick` once `PickersModalDialog` does not handle the layouting parts
  extends Pick<
      PickersModalDialogSlotsComponentsProps,
      'dialog' | 'mobilePaper' | 'mobileTransition'
    >,
    ExportedPickerViewLayoutSlotsComponentsProps {
  field?: SlotComponentProps<React.ElementType<BaseFieldProps<TDate | null, unknown>>, {}, unknown>;
  input?: SlotComponentProps<typeof TextField, {}, unknown>;
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
  componentsProps?: UseMobilePickerSlotsComponentsProps<TDate>;
}

export interface UseMobilePickerParams<
  TDate,
  TView extends CalendarOrClockPickerView,
  TExternalProps extends UseMobilePickerProps<TDate, TView>,
> extends Pick<
    UsePickerParams<TDate | null, TDate, TView, TExternalProps, {}>,
    'valueManager' | 'viewLookup'
  > {
  props: TExternalProps;
  getOpenDialogAriaText: (date: TDate | null, utils: MuiPickersAdapter<TDate>) => string;
}
