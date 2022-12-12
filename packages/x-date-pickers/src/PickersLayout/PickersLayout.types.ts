import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/base/utils';
import { PickersActionBarProps } from '../PickersActionBar';
import { DateOrTimeView } from '../internals/models/views';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../internals/models/props/toolbar';
import { BaseTabsProps, ExportedBaseTabsProps } from '../internals/models/props/tabs';
import { UsePickerLayoutPropsResponseLayoutProps } from '../internals/hooks/usePicker/usePickerLayoutProps';
import { PickersLayoutClasses } from './pickersLayoutClasses';
import { WrapperVariant } from '../internals/components/wrappers/WrapperVariantContext';
import { PickersShortcutsProps } from '../PickersShortcuts';

export interface ExportedPickersLayoutSlotsComponent<TValue, TView extends DateOrTimeView> {
  /**
   * Custom component for the action bar, it is placed bellow the picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
  /**
   * Custom component for the shortcuts.
   * @default PickersShortcuts
   */
  Shortcuts?: React.JSXElementConstructor<PickersShortcutsProps<any, TView>>;
  /**
   * Custom component for wrapping the layout.
   * It wrapps the toolbar, views, and action bar
   */
  Layout?: React.JSXElementConstructor<
    PickersLayoutProps<TValue, TView> & React.RefAttributes<HTMLDivElement>
  >;
}

interface PickersLayoutActionBarOwnerState<TValue, TView extends DateOrTimeView>
  extends PickersLayoutProps<TValue, TView> {
  wrapperVariant: WrapperVariant;
}

interface PickersShortcutsOwnerState<TValue, TView extends DateOrTimeView>
  extends PickersShortcutsProps<TValue, TView> {
  wrapperVariant: WrapperVariant;
}

export interface ExportedPickersLayoutSlotsComponentsProps<TValue, TView extends DateOrTimeView> {
  /**
   * Props passed down to the action bar component.
   */
  actionBar?: SlotComponentProps<
    React.ComponentType<
      Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>
    >,
    {},
    PickersLayoutActionBarOwnerState<TValue, TView>
  >;
  /**
   * Props passed down to the action bar component.
   */
  shortcuts?: SlotComponentProps<
    React.ComponentType<PickersShortcutsProps<TValue, TView>>,
    {},
    PickersShortcutsOwnerState<TValue, TView>
  >;
  /**
   * Props passed down to the layoutRoot component.
   */
  layout?: Partial<PickersLayoutProps<TValue, TView>>;
}

export interface PickersLayoutSlotsComponent<TValue, TView extends DateOrTimeView>
  extends ExportedPickersLayoutSlotsComponent<TValue, TView> {
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

export interface PickersLayoutSlotsComponentsProps<TValue, TView extends DateOrTimeView>
  extends ExportedPickersLayoutSlotsComponentsProps<TValue, TView> {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedBaseTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedBaseToolbarProps;
}

export interface PickersLayoutProps<TValue, TView extends DateOrTimeView>
  extends UsePickerLayoutPropsResponseLayoutProps<TValue, TView> {
  className?: string;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  classes?: Partial<PickersLayoutClasses>;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: PickersLayoutSlotsComponent<any, any>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: PickersLayoutSlotsComponentsProps<TValue, TView>;
}

export interface SubComponents {
  toolbar: React.ReactNode;
  content: React.ReactNode;
  tabs: React.ReactNode;
  actionBar: React.ReactNode;
  shortcuts: React.ReactNode;
}
