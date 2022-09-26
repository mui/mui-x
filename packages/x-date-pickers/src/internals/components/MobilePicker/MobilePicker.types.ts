import * as React from 'react';
import { CalendarOrClockPickerView } from '../../models';
import {
  PickersModalDialogSlotsComponent,
  PickersModalDialogSlotsComponentsProps,
} from '../PickersModalDialog';
import { BasePickerProps2, ExportedBasePickerProps2 } from '../../models/props/basePickerProps';

export interface MobilePickerSlotsComponent extends PickersModalDialogSlotsComponent {
  Field: React.ElementType;
  Input?: React.ElementType;
}

// TODO: Type props of all slots
export interface MobilePickerSlotsComponentsProps extends PickersModalDialogSlotsComponentsProps {
  field?: Record<string, any>;
  input?: Record<string, any>;
}

interface MobileOnlyPickerProps {}

export interface MobilePickerProps<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends MobileOnlyPickerProps,
    BasePickerProps2<TValue, TDate, TView> {
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
}

export interface ExportedMobilePickerProps<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends MobileOnlyPickerProps,
    ExportedBasePickerProps2<TValue, TDate, TView> {}
