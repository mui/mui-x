import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import { SxProps, Theme } from '@mui/material/styles';
import { PickersActionBarProps } from '../PickersActionBar';
import { DateOrTimeView } from '../internals/models/views';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../internals/models/props/toolbar';
import { BaseTabsProps, ExportedBaseTabsProps } from '../internals/models/props/tabs';
import { UsePickerLayoutPropsResponseLayoutProps } from '../internals/hooks/usePicker/usePickerLayoutProps';
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
  Layout?: React.JSXElementConstructor<PickersViewLayoutSlotOwnerState<any, any>>;
}

export interface ExportedPickersViewLayoutSlotsComponentsProps {
  /**
   * Props passed down to the action bar component.
   */
  actionBar?: Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>;
  /**
   * Props passed down to the layoutRoot component.
   */
  layout?: SlotComponentProps<
    React.JSXElementConstructor<PickersViewLayoutProps<any, any>>,
    {},
    PickersViewLayoutSlotOwnerState<any, any>
  >;
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
  extends UsePickerLayoutPropsResponseLayoutProps<TValue, TView> {
  className?: string;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
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

export interface SubComponents {
  toolbar: JSX.Element | null;
  content: JSX.Element | null;
  actionBar: JSX.Element | null;
}

export interface PickersViewLayoutSlotOwnerState<TValue, TView extends DateOrTimeView>
  extends PickersViewLayoutProps<TValue, TView>,
    SubComponents {}
