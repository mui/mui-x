'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import { useRtl } from '@mui/system/RtlProvider';
import { PickersActionBar, PickersActionBarAction } from '../PickersActionBar';
import { PickerLayoutOwnerState, PickersLayoutProps, SubComponents } from './PickersLayout.types';
import { getPickersLayoutUtilityClass, PickersLayoutClasses } from './pickersLayoutClasses';
import { PickersShortcuts } from '../PickersShortcuts';
import { BaseToolbarProps } from '../internals/models/props/toolbar';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { usePickerContext } from '../hooks';

function toolbarHasView<TValue, TView extends DateOrTimeViewWithMeridiem>(
  toolbarProps: BaseToolbarProps<TValue, TView> | any,
): toolbarProps is BaseToolbarProps<TValue, TView> {
  return toolbarProps.view !== null;
}

const useUtilityClasses = (
  classes: Partial<PickersLayoutClasses> | undefined,
  ownerState: PickerLayoutOwnerState,
) => {
  const { pickerOrientation } = ownerState;
  const slots = {
    root: ['root', pickerOrientation === 'landscape' && 'landscape'],
    contentWrapper: ['contentWrapper'],
    toolbar: ['toolbar'],
    actionBar: ['actionBar'],
    tabs: ['tabs'],
    landscape: ['landscape'],
    shortcuts: ['shortcuts'],
  };

  return composeClasses(slots, getPickersLayoutUtilityClass, classes);
};

interface PickersLayoutPropsWithValueRequired<TValue, TView extends DateOrTimeViewWithMeridiem>
  extends PickersLayoutProps<TValue, TView> {
  value: TValue;
}

interface UsePickerLayoutResponse<TValue> extends SubComponents<TValue> {
  ownerState: PickerLayoutOwnerState;
}

const usePickerLayout = <TValue, TView extends DateOrTimeViewWithMeridiem>(
  props: PickersLayoutProps<TValue, TView>,
): UsePickerLayoutResponse<TValue> => {
  const { ownerState: pickerOwnerState } = usePickerPrivateContext();
  const { variant, orientation } = usePickerContext();
  const isRtl = useRtl();

  const {
    onAccept,
    onClear,
    onCancel,
    onSetToday,
    view,
    views,
    onViewChange,
    value,
    onChange,
    onSelectShortcut,
    isValid,
    children,
    slots,
    slotProps,
    classes: classesProp,
    // TODO: Remove this "as" hack. It get introduced to mark `value` prop in PickersLayoutProps as not required.
    // The true type should be
    // - For pickers value: PickerValidDate | null
    // - For range pickers value: [PickerValidDate | null, PickerValidDate | null]
  } = props as PickersLayoutPropsWithValueRequired<TValue, TView>;

  const ownerState: PickerLayoutOwnerState = { ...pickerOwnerState, isRtl };
  const classes = useUtilityClasses(classesProp, ownerState);

  // Action bar
  const ActionBar = slots?.actionBar ?? PickersActionBar;
  const actionBarProps = useSlotProps({
    elementType: ActionBar,
    externalSlotProps: slotProps?.actionBar,
    additionalProps: {
      onAccept,
      onClear,
      onCancel,
      onSetToday,
      actions: variant === 'desktop' ? [] : (['cancel', 'accept'] as PickersActionBarAction[]),
    },
    className: classes.actionBar,
    ownerState,
  });
  const actionBar = <ActionBar {...actionBarProps} />;

  // Toolbar
  const Toolbar = slots?.toolbar;
  const toolbarProps = useSlotProps({
    elementType: Toolbar!,
    externalSlotProps: slotProps?.toolbar,
    additionalProps: {
      isLandscape: orientation === 'landscape', // Will be removed in a follow up PR?
      onChange,
      value,
      view,
      onViewChange,
      views,
    },
    className: classes.toolbar,
    ownerState,
  });
  const toolbar = toolbarHasView(toolbarProps) && !!Toolbar ? <Toolbar {...toolbarProps} /> : null;

  // Content
  const content = children;

  // Tabs
  const Tabs = slots?.tabs;
  const tabs =
    view && Tabs ? (
      <Tabs view={view} onViewChange={onViewChange} className={classes.tabs} {...slotProps?.tabs} />
    ) : null;

  // Shortcuts
  const Shortcuts = slots?.shortcuts ?? PickersShortcuts;
  const shortcutsProps = useSlotProps({
    elementType: Shortcuts!,
    externalSlotProps: slotProps?.shortcuts,
    additionalProps: {
      isValid,
      isLandscape: orientation === 'landscape', // Will be removed in a follow up PR?
      onChange: onSelectShortcut,
    },
    className: classes.shortcuts,
    ownerState,
  });
  const shortcuts = view && !!Shortcuts ? <Shortcuts {...shortcutsProps} /> : null;

  return {
    toolbar,
    content,
    tabs,
    actionBar,
    shortcuts,
    ownerState,
  };
};

export default usePickerLayout;
