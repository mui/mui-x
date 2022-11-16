import * as React from 'react';
import { PickersActionBarProps } from '../../../PickersActionBar';
import { CalendarOrClockPickerView } from '../../models/views';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../../models/props/toolbar';
import { BaseTabsProps, ExportedBaseTabsProps } from '../../models/props/tabs';
import { UsePickerLayoutResponseLayoutProps } from '../../hooks/usePicker/usePickerLayout';
import { PickersViewLayoutClasses } from './pickersViewLayoutClasses';

export interface ExportedPickersViewLayoutSlotsComponent {
  /**
   * Custom component for the action bar, it is placed bellow the picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
}

export interface ExportedPickersViewLayoutSlotsComponentsProps {
  /**
   * Props passed down to the action bar component.
   */
  actionBar?: Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>;
}

interface PickersViewLayoutSlotsComponent<TValue, TView extends CalendarOrClockPickerView>
  extends ExportedPickersViewLayoutSlotsComponent {
  /**
   * Tabs enabling toggling between views.
   */
  Tabs?: React.ElementType<BaseTabsProps<TView>>;
  /**
   * Custom component for the toolbar.
   * It is placed above the picker views.
   */
  Toolbar?: React.JSXElementConstructor<BaseToolbarProps<TValue, TView>>;
}

interface PickersViewLayoutSlotsComponentsProps
  extends ExportedPickersViewLayoutSlotsComponentsProps {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedBaseTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedBaseToolbarProps;
}

export interface PickersViewLayoutProps<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerLayoutResponseLayoutProps<TValue, TView> {
  className?: string;
  children: React.ReactNode;
  classes?: Partial<PickersViewLayoutClasses>;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: PickersViewLayoutSlotsComponent<TValue, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: PickersViewLayoutSlotsComponentsProps;
}
