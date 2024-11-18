import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/utils';
import { PickersActionBar, PickersActionBarProps } from '../PickersActionBar';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../internals/models/props/toolbar';
import { BaseTabsProps, ExportedBaseTabsProps } from '../internals/models/props/tabs';
import { UsePickerLayoutPropsResponseLayoutProps } from '../internals/hooks/usePicker/usePickerLayoutProps';
import { PickersLayoutClasses } from './pickersLayoutClasses';
import { DateOrTimeViewWithMeridiem, WrapperVariant } from '../internals/models/common';
import { PickersShortcutsProps } from '../PickersShortcuts';
import {
  ExportedPickersShortcutProps,
  PickersShortcuts,
} from '../PickersShortcuts/PickersShortcuts';
import { PickerOwnerState } from '../models';

export interface ExportedPickersLayoutSlots<TValue, TView extends DateOrTimeViewWithMeridiem> {
  /**
   * Custom component for the action bar, it is placed below the picker views.
   * @default PickersActionBar
   */
  actionBar?: React.ElementType<PickersActionBarProps>;
  /**
   * Custom component for the shortcuts.
   * @default PickersShortcuts
   */
  shortcuts?: React.JSXElementConstructor<PickersShortcutsProps<TValue>>;
  /**
   * Custom component for wrapping the layout.
   * It wraps the toolbar, views, action bar, and shortcuts.
   */
  layout?: React.JSXElementConstructor<
    PickersLayoutProps<TValue, TView> & React.RefAttributes<HTMLDivElement>
  >;
}

export interface PickerLayoutOwnerState extends PickerOwnerState {
  wrapperVariant: WrapperVariant;
  isLandscape: boolean;
}

export interface ExportedPickersLayoutSlotProps<TValue, TView extends DateOrTimeViewWithMeridiem> {
  /**
   * Props passed down to the action bar component.
   */
  actionBar?: SlotComponentProps<typeof PickersActionBar, {}, PickerLayoutOwnerState>;
  /**
   * Props passed down to the shortcuts component.
   */
  shortcuts?: SlotComponentProps<typeof PickersShortcuts, {}, PickerLayoutOwnerState>;
  /**
   * Props passed down to the layoutRoot component.
   */
  layout?: Partial<PickersLayoutProps<TValue, TView>>;
}

export interface PickersLayoutSlots<TValue, TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlots<TValue, TView> {
  /**
   * Tabs enabling toggling between views.
   */
  tabs?: React.ElementType<BaseTabsProps<TView>>;
  /**
   * Custom component for the toolbar.
   * It is placed above the picker views.
   */
  toolbar?: React.JSXElementConstructor<BaseToolbarProps<TValue, TView>>;
}

export interface PickersLayoutSlotProps<TValue, TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlotProps<TValue, TView> {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedBaseTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedBaseToolbarProps;
}

export interface PickersLayoutProps<TValue, TView extends DateOrTimeViewWithMeridiem>
  extends Omit<UsePickerLayoutPropsResponseLayoutProps<TValue, TView>, 'value'> {
  value?: TValue;
  className?: string;
  children?: React.ReactNode;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickersLayoutClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: PickersLayoutSlots<TValue, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PickersLayoutSlotProps<TValue, TView>;
  /**
   * `true` if the application is in right-to-left direction.
   */
  isRtl: boolean;
}

export interface SubComponents<TValue> {
  toolbar: React.ReactElement<ExportedBaseToolbarProps> | null;
  content: React.ReactNode;
  tabs: React.ReactElement<ExportedBaseTabsProps> | null;
  actionBar: React.ReactElement<PickersActionBarProps>;
  shortcuts: React.ReactElement<ExportedPickersShortcutProps<TValue>> | null;
}
