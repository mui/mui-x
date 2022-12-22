import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import { PickersActionBarProps } from '../../../PickersActionBar';
import { DateOrTimeView } from '../../models/views';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../../models/props/toolbar';
import { BaseTabsProps, ExportedBaseTabsProps } from '../../models/props/tabs';
import { UsePickerLayoutResponseLayoutProps } from '../../hooks/usePicker/usePickerLayout';
import { PickersViewLayoutClasses } from './pickersViewLayoutClasses';
import { WrapperVariant } from '../wrappers/WrapperVariantContext';

export interface ExportedPickersViewLayoutSlotsComponent {
  /**
   * Custom component for the action bar, it is placed bellow the picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
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
}

export interface PickersViewLayoutSlotsComponent<TValue, TView extends DateOrTimeView>
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
  componentsProps?: PickersViewLayoutSlotsComponentsProps<TValue, TView>;
}
