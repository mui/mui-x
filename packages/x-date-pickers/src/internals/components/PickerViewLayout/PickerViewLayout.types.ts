import * as React from 'react';
import { PickersActionBarProps } from '../../../PickersActionBar';
import { CalendarOrClockPickerView } from '../../models/views';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../../models/props/toolbar';
import { BaseTabsProps, ExportedBaseTabsProps } from '../../models/props/tabs';
import { UsePickerLayoutResponseLayoutProps } from '../../hooks/usePicker/usePickerLayout';
import { PickerViewLayoutClasses } from './pickerViewLayoutClasses';

export interface ExportedPickerViewLayoutSlotsComponent {
  /**
   * Custom component for the action bar, it is placed bellow the picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
}

export interface ExportedPickerViewLayoutSlotsComponentsProps {
  /**
   * Props passed down to the action bar component.
   */
  actionBar?: Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>;
}

interface PickerViewLayoutSlotsComponent<TValue> extends ExportedPickerViewLayoutSlotsComponent {
  /**
   * Tabs enabling toggling between views.
   */
  Tabs?: React.ElementType<BaseTabsProps>;
  /**
   * Custom component for the toolbar.
   * It is placed above the picker views.
   */
  Toolbar?: React.JSXElementConstructor<BaseToolbarProps<TValue>>;
}

interface PickerViewLayoutSlotsComponentsProps
  extends ExportedPickerViewLayoutSlotsComponentsProps {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedBaseTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedBaseToolbarProps;
}

export interface PickerViewLayoutProps<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerLayoutResponseLayoutProps<TValue, TView> {
  className?: string;
  children: React.ReactNode;
  classes?: Partial<PickerViewLayoutClasses>;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: PickerViewLayoutSlotsComponent<TValue>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: PickerViewLayoutSlotsComponentsProps;
}
