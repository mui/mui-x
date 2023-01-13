import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/base/utils';
import { PickersActionBarProps } from '../PickersActionBar';
import { DateOrTimeView } from '../internals/models/views';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../internals/models/props/toolbar';
import { BaseTabsProps, ExportedBaseTabsProps } from '../internals/models/props/tabs';
import { UsePickerLayoutPropsResponseLayoutProps } from '../internals/hooks/usePicker/usePickerLayoutProps';
import { PickersLayoutClasses } from './pickersLayoutClasses';
import { WrapperVariant } from '../internals/models/common';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';

export interface ExportedPickersLayoutSlotsComponent<TValue, TView extends DateOrTimeView> {
  /**
   * Custom component for the action bar, it is placed bellow the picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
  /**
   * Custom component for wrapping the layout.
   * It wraps the toolbar, views, and action bar.
   */
  Layout?: React.JSXElementConstructor<PickersLayoutProps<TValue, TView>>;
}

interface PickersLayoutActionBarOwnerState<TValue, TView extends DateOrTimeView>
  extends PickersLayoutProps<TValue, TView> {
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
  extends Omit<UsePickerLayoutPropsResponseLayoutProps<TValue, TView>, 'value'> {
  value?: TValue;
  className?: string;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  /**
   * Ref to pass to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
  classes?: Partial<PickersLayoutClasses>;
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: PickersLayoutSlotsComponent<TValue, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotsProps`.
   */
  componentsProps?: PickersLayoutSlotsComponentsProps<TValue, TView>;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<PickersLayoutSlotsComponent<TValue, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: PickersLayoutSlotsComponentsProps<TValue, TView>;
}

export interface SubComponents {
  toolbar: React.ReactNode;
  content: React.ReactNode;
  tabs: React.ReactNode;
  actionBar: React.ReactNode;
}
