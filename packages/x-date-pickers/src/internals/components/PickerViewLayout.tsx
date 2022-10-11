import * as React from 'react';
import { PickersActionBar, PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { WrapperVariant } from './wrappers/WrapperVariantContext';
import { UsePickerValueActions } from '../hooks/usePicker/usePickerValue';
import { CalendarOrClockPickerView } from '../models/views';
import { PickerViewsRendererProps } from '../hooks/usePicker/usePickerViews';

export interface PickerViewLayoutSlotsComponent<TView extends CalendarOrClockPickerView> {
  /**
   * Custom component for the action bar, it is placed bellow the picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
  /**
   * Tabs enabling toggling between views.
   */
  Tabs?: React.ElementType;
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
}

export interface PickerViewLayoutProps<TView extends CalendarOrClockPickerView>
  extends UsePickerValueActions,
    Pick<PickerViewsRendererProps<any, TView, {}>, 'view' | 'onViewChange'> {
  children: React.ReactNode;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: PickerViewLayoutSlotsComponent<TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: PickerViewLayoutSlotsComponentsProps;
  wrapperVariant: WrapperVariant;
  hideTabs?: boolean;
}

// For now the `ActionBar` is rendered on the variant wrapper.
const shouldRenderActionBar = false;

/**
 * TODO: Add `ActionBar` here once it has been removed from the `PickersPopper`, `PickersModalDialog` and `PickersStaticWrapper`.
 * @constructor
 */
export const PickerViewLayout = <TView extends CalendarOrClockPickerView>(
  props: PickerViewLayoutProps<TView>,
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
    onViewChange,
  } = props;

  const ActionBar = components?.ActionBar ?? PickersActionBar;

  const Tabs = components?.Tabs;
  const shouldRenderTabs = !hideTabs && typeof window !== 'undefined' && window.innerHeight > 667;

  return (
    <React.Fragment>
      {children}
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
