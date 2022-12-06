import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/base/utils';
import { PickersActionBarProps } from '../PickersActionBar';
import { DateOrTimeView } from '../internals/models/views';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../internals/models/props/toolbar';
import { BaseTabsProps, ExportedBaseTabsProps } from '../internals/models/props/tabs';
import { UsePickerLayoutPropsResponseLayoutProps } from '../internals/hooks/usePicker/usePickerLayoutProps';
import { PickersViewLayoutClasses } from './pickersViewLayoutClasses';
import { WrapperVariant } from '../internals/components/wrappers/WrapperVariantContext';

export interface ExportedPickersViewLayoutSlotsComponent<TValue, TView extends DateOrTimeView> {
  /**
   * Custom component for the action bar, it is placed bellow the picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
  /**
   * Custom component for wrapping the layout.
   * It wrapps the toolbar, views, and action bar
   */
  Layout?: React.JSXElementConstructor<
    PickersViewLayoutProps<TValue, TView> & React.RefAttributes<HTMLDivElement>
  >;
}

interface PickersViewLayoutActionBarOwnerState<TValue, TView extends DateOrTimeView>
  extends PickersViewLayoutProps<TValue, TView> {
  wrapperVariant: WrapperVariant;
}

export interface ExportedPickersViewLayoutSlotsComponentsProps<
  TValue,
  TView extends DateOrTimeView,
> {
  /**
   * Props passed down to the action bar component.
   */
  actionBar?: SlotComponentProps<
    React.ComponentType<
      Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>
    >,
    {},
    PickersViewLayoutActionBarOwnerState<TValue, TView>
  >;
  /**
   * Props passed down to the layoutRoot component.
   */
  layout?: Partial<PickersViewLayoutProps<TValue, TView>>;
}

export interface PickersViewLayoutSlotsComponent<TValue, TView extends DateOrTimeView>
  extends ExportedPickersViewLayoutSlotsComponent<TValue, TView> {
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

export interface PickersViewLayoutSlotsComponentsProps<TValue, TView extends DateOrTimeView>
  extends ExportedPickersViewLayoutSlotsComponentsProps<TValue, TView> {
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
  components?: PickersViewLayoutSlotsComponent<any, any>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: PickersViewLayoutSlotsComponentsProps<TValue, TView>;
}

export interface SubComponents {
  toolbar: React.ReactNode;
  content: React.ReactNode;
  tabs: React.ReactNode;
  actionBar: React.ReactNode;
}
