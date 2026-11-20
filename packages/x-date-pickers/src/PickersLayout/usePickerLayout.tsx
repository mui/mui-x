'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import { PickersActionBar } from '../PickersActionBar';
import type {
  PickerLayoutOwnerState,
  PickersLayoutProps,
  SubComponents,
} from './PickersLayout.types';
import type { PickersLayoutClasses } from './pickersLayoutClasses';
import { getPickersLayoutUtilityClass } from './pickersLayoutClasses';
import type { PickersShortcutsProps } from '../PickersShortcuts';
import { PickersShortcuts } from '../PickersShortcuts';
import type { BaseToolbarProps } from '../internals/models/props/toolbar';
import type { PickerValidValue } from '../internals/models';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { usePickerContext } from '../hooks';
import { usePickerLayoutOwnerState } from './usePickerLayoutOwnerState';

function toolbarHasView(toolbarProps: BaseToolbarProps | any): toolbarProps is BaseToolbarProps {
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

interface UsePickerLayoutResponse<TValue extends PickerValidValue> extends SubComponents<TValue> {
  ownerState: PickerLayoutOwnerState;
}

const usePickerLayout = <TValue extends PickerValidValue>(
  props: PickersLayoutProps<TValue>,
): UsePickerLayoutResponse<TValue> => {
  const { defaultActionBarActions } = usePickerPrivateContext();
  const { view } = usePickerContext();
  const baseOwnerState = usePickerLayoutOwnerState();

  const { children, slots, slotProps, classes: classesProp } = props;
  const classes = useUtilityClasses(classesProp, baseOwnerState);

  // Toolbar
  const Toolbar = slots?.toolbar;
  const toolbarProps = useSlotProps({
    elementType: Toolbar!,
    externalSlotProps: slotProps?.toolbar,
    className: classes.toolbar,
    ownerState: baseOwnerState,
  });
  const toolbar = toolbarHasView(toolbarProps) && !!Toolbar ? <Toolbar {...toolbarProps} /> : null;
  const hasToolbar = toolbar !== null && !(toolbarProps as BaseToolbarProps).hidden;

  // Shortcuts
  const Shortcuts = slots?.shortcuts ?? PickersShortcuts;
  const shortcutsProps = useSlotProps({
    elementType: Shortcuts!,
    externalSlotProps: slotProps?.shortcuts,
    className: classes.shortcuts,
    ownerState: baseOwnerState,
  }) as PickersShortcutsProps<TValue>;
  const hasShortcuts = Array.isArray(shortcutsProps?.items) && shortcutsProps.items.length > 0;

  const ownerState = React.useMemo<PickerLayoutOwnerState>(
    () => ({ ...baseOwnerState, hasShortcuts, hasToolbar }),
    [baseOwnerState, hasShortcuts, hasToolbar],
  );

  const shortcutsPropsWithOwnerState = { ...shortcutsProps, ownerState };
  const shortcuts = view && !!Shortcuts ? <Shortcuts {...shortcutsPropsWithOwnerState} /> : null;

  // Action bar
  const ActionBar = slots?.actionBar ?? PickersActionBar;
  const {
    // A prop breaks the memoization. PickersActionBar reads `PickerLayoutOwnerStateContext` instead.
    ownerState: destructuredOwnerState,
    ...actionBarProps
  } = useSlotProps({
    elementType: ActionBar,
    externalSlotProps: slotProps?.actionBar,
    additionalProps: {
      actions: defaultActionBarActions,
    },
    className: classes.actionBar,
    ownerState,
  });
  const actionBar = <ActionBar {...actionBarProps} />;

  // Content
  const content = children;

  // Tabs
  const Tabs = slots?.tabs;
  const tabs = view && Tabs ? <Tabs className={classes.tabs} {...slotProps?.tabs} /> : null;

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
