import * as React from 'react';
import { PickersActionBarProps } from '../../../PickersActionBar';
import { DateOrTimeView } from '../../models/views';
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
  /**
   * Custom component for wrapping the layout.
   * It wrapps the toolbar, views, and action bar
   */
  LayoutRoot?: React.JSXElementConstructor<any>;
}

export interface ExportedPickersViewLayoutSlotsComponentsProps {
  /**
   * Props passed down to the action bar component.
   */
  actionBar?: Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>;
  /**
   * Props passed down to the layoutRoot component.
   */
  layoutRoot?: any;
}

interface PickersViewLayoutSlotsComponent<TValue, TView extends DateOrTimeView>
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

export interface PickersViewLayoutProps<TValue, TView extends DateOrTimeView>
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
