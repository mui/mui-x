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
import { InferPickerValue } from '../internals/models';

export interface ExportedPickersLayoutSlots<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
> {
  /**
   * Custom component for the action bar, it is placed below the picker views.
   * @default PickersActionBar
   */
  actionBar?: React.ElementType<PickersActionBarProps>;
  /**
   * Custom component for the shortcuts.
   * @default PickersShortcuts
   */
  shortcuts?: React.JSXElementConstructor<PickersShortcutsProps<TIsRange>>;
  /**
   * Custom component for wrapping the layout.
   * It wraps the toolbar, views, action bar, and shortcuts.
   */
  layout?: React.JSXElementConstructor<
    PickersLayoutProps<TIsRange, TView> & React.RefAttributes<HTMLDivElement>
  >;
}

export interface PickerLayoutOwnerState extends PickerOwnerState {
  wrapperVariant: WrapperVariant;
  isLandscape: boolean;
}

export interface ExportedPickersLayoutSlotProps<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
> {
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
  layout?: Partial<PickersLayoutProps<TIsRange, TView>>;
}

export interface PickersLayoutSlots<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
> extends ExportedPickersLayoutSlots<TIsRange, TView> {
  /**
   * Tabs enabling toggling between views.
   */
  tabs?: React.ElementType<BaseTabsProps<TView>>;
  /**
   * Custom component for the toolbar.
   * It is placed above the picker views.
   */
  toolbar?: React.JSXElementConstructor<BaseToolbarProps<TIsRange, TView>>;
}

export interface PickersLayoutSlotProps<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
> extends ExportedPickersLayoutSlotProps<TIsRange, TView> {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedBaseTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedBaseToolbarProps;
}

export interface PickersLayoutProps<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
> extends Omit<UsePickerLayoutPropsResponseLayoutProps<TIsRange, TView>, 'value'> {
  value?: InferPickerValue<TIsRange>;
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
  slots?: PickersLayoutSlots<TIsRange, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PickersLayoutSlotProps<TIsRange, TView>;
  /**
   * `true` if the application is in right-to-left direction.
   */
  isRtl: boolean;
}

export interface SubComponents<TIsRange extends boolean> {
  toolbar: React.ReactElement<ExportedBaseToolbarProps> | null;
  content: React.ReactNode;
  tabs: React.ReactElement<ExportedBaseTabsProps> | null;
  actionBar: React.ReactElement<PickersActionBarProps>;
  shortcuts: React.ReactElement<ExportedPickersShortcutProps<TIsRange>> | null;
}
