import * as React from 'react';
import { CalendarOrClockPickerView } from '../../models';
import { PickersPopperSlotsComponent, PickersPopperSlotsComponentsProps } from '../PickersPopper';
import { BasePickerProps2, ExportedBasePickerProps2 } from '../../models/props/basePickerProps';

export interface DesktopPickerSlotsComponent extends PickersPopperSlotsComponent {
  Field: React.ElementType;
  /**
   * Icon displayed in the open picker button.
   */
  OpenPickerIcon: React.ElementType;
  Input?: React.ElementType;
  /**
   * Button to open the picker.
   * @default IconButton
   */
  OpenPickerButton?: React.ElementType;
}

// TODO: Type props of all slots
export interface DesktopPickerSlotsComponentsProps extends PickersPopperSlotsComponentsProps {
  field?: Record<string, any>;
  input?: Record<string, any>;
  openPickerIcon?: Record<string, any>;
  openPickerButton?: Record<string, any>;
}

interface DesktopOnlyPickerProps {
  /**
   * Do not render open picker button (renders only the field).
   * @default false
   */
  disableOpenPicker?: boolean;
}

export interface DesktopPickerProps<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends DesktopOnlyPickerProps,
    BasePickerProps2<TValue, TDate, TView> {
  /**
   * Overrideable components.
   * @default {}
   */
  components: DesktopPickerSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopPickerSlotsComponentsProps;
}

export interface ExportedDesktopPickerProps<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends DesktopOnlyPickerProps,
    ExportedBasePickerProps2<TValue, TDate, TView> {}
