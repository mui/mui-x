import * as React from 'react';
import { PickersActionBar, PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { CalendarOrClockPickerView } from '../models/views';
import { BaseToolbarProps2, ExportedBaseToolbarProps } from '../models/props/baseToolbarProps';
import { UsePickerLayoutResponse } from '../hooks/usePicker/usePicker.types';

export interface PickerViewLayoutSlotsComponent<TValue> {
  /**
   * Custom component for the action bar, it is placed bellow the picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
  /**
   * Tabs enabling toggling between views.
   */
  Tabs?: React.ElementType;
  /**
   * Custom component for the toolbar.
   * It is placed above the picker views.
   */
  Toolbar?: React.JSXElementConstructor<BaseToolbarProps2<TValue>>;
}

export interface PickerViewLayoutSlotsComponentsProps {
  /**
   * Props passed down to the action bar component.
   */
  actionBar?: Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>;
  /**
   * Props passed down to the tabs component.
   */
  tabs?: Record<string, any>;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedBaseToolbarProps;
}

export interface PickerViewLayoutProps<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerLayoutResponse<TValue, TView> {
  children: React.ReactNode;
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
  hideTabs?: boolean;
}

// For now the `ActionBar` is rendered on the variant wrapper.
const shouldRenderActionBar = false;

// TODO v6: Clean
const showToolbar = true;

/**
 * TODO: Add `ActionBar` here once it has been removed from the `PickersPopper`, `PickersModalDialog` and `PickersStaticWrapper`.
 * @constructor
 */
export const PickerViewLayout = <TValue, TView extends CalendarOrClockPickerView>(
  props: PickerViewLayoutProps<TValue, TView>,
) => {
  const {
    components,
    componentsProps,
    wrapperVariant,
    children,
    hideTabs,
    onAccept,
    onClear,
    onCancel,
    onSetToday,
    view,
    views,
    onViewChange,
    value,
    onChange,
    isLandscape,
    disabled,
    readOnly,
  } = props;

  const ActionBar = components?.ActionBar ?? PickersActionBar;

  const shouldRenderTabs = !hideTabs && typeof window !== 'undefined' && window.innerHeight > 667;
  const Tabs = components?.Tabs;

  const shouldRenderToolbar = showToolbar ?? wrapperVariant !== 'desktop';
  const Toolbar = components?.Toolbar;

  if (view == null) {
    return null;
  }

  return (
    <React.Fragment>
      {children}
      {shouldRenderToolbar && !!Toolbar && (
        <Toolbar
          {...componentsProps?.toolbar}
          isLandscape={isLandscape}
          onChange={onChange}
          value={value}
          view={view}
          onViewChange={onViewChange as (view: CalendarOrClockPickerView) => void}
          views={views}
          disabled={disabled}
          readOnly={readOnly}
        />
      )}
      {shouldRenderTabs && !!Tabs && (
        <Tabs view={view} onViewChange={onViewChange} {...componentsProps?.tabs} />
      )}
      {shouldRenderActionBar && (
        <ActionBar
          onAccept={onAccept}
          onClear={onClear}
          onCancel={onCancel}
          onSetToday={onSetToday}
          actions={wrapperVariant === 'desktop' ? [] : ['cancel', 'accept']}
          {...componentsProps?.actionBar}
        />
      )}
    </React.Fragment>
  );
};
