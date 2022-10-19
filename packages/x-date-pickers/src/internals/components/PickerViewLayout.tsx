import * as React from 'react';
import { styled } from '@mui/material/styles';
import { PickersActionBar, PickersActionBarProps } from '../../PickersActionBar';
import { CalendarOrClockPickerView } from '../models/views';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../models/props/toolbar';
import { BaseTabsProps, ExportedBaseTabsProps } from '../models/props/tabs';
import { UsePickerLayoutResponseLayoutProps } from '../hooks/usePicker/usePickerLayout';

export interface ExportedPickerViewLayoutSlotsComponent {
  /**
   * Custom component for the action bar, it is placed bellow the picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
}

export interface ExportedPickerViewLayoutSlotsComponentsProps {
  /**
   * Props passed down to the action bar component.
   */
  actionBar?: Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>;
}

export interface PickerViewLayoutSlotsComponent<TValue>
  extends ExportedPickerViewLayoutSlotsComponent {
  /**
   * Tabs enabling toggling between views.
   */
  Tabs?: React.ElementType<BaseTabsProps>;
  /**
   * Custom component for the toolbar.
   * It is placed above the picker views.
   */
  Toolbar?: React.JSXElementConstructor<BaseToolbarProps<TValue>>;
}

export interface PickerViewLayoutSlotsComponentsProps
  extends ExportedPickerViewLayoutSlotsComponentsProps {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedBaseTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedBaseToolbarProps;
}

interface PickerViewLayoutProps<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerLayoutResponseLayoutProps<TValue, TView> {
  className?: string;
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
}

export const PickerViewLayoutRoot = styled('div', {
  name: 'MuiPickerViewLayout',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  display: 'flex',
  flexDirection: 'column',
});

export const PickerViewLayoutContent = styled('div', {
  name: 'MuiPickerViewLayout',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
})<{ ownerState: { isLandscape: boolean } }>(({ ownerState }) => ({
  display: 'flex',
  flexDirection: 'column',
  ...(ownerState.isLandscape && {
    flexDirection: 'row',
  }),
}));

export const PickerViewLayout = <TValue, TView extends CalendarOrClockPickerView>(
  props: PickerViewLayoutProps<TValue, TView>,
) => {
  const {
    components,
    componentsProps,
    wrapperVariant,
    children,
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
    showToolbar,
    className,
  } = props;

  const ActionBar = components?.ActionBar ?? PickersActionBar;
  const Tabs = components?.Tabs;

  const shouldRenderToolbar = showToolbar ?? wrapperVariant !== 'desktop';
  const Toolbar = components?.Toolbar;

  if (view == null) {
    return null;
  }

  return (
    <PickerViewLayoutRoot className={className}>
      <PickerViewLayoutContent ownerState={{ isLandscape }}>
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
        {!!Tabs && (
          <Tabs
            view={view}
            onViewChange={onViewChange as (view: CalendarOrClockPickerView) => void}
            {...componentsProps?.tabs}
          />
        )}
        {children}
      </PickerViewLayoutContent>
      <ActionBar
        onAccept={onAccept}
        onClear={onClear}
        onCancel={onCancel}
        onSetToday={onSetToday}
        actions={wrapperVariant === 'desktop' ? [] : ['cancel', 'accept']}
        {...componentsProps?.actionBar}
      />
    </PickerViewLayoutRoot>
  );
};
