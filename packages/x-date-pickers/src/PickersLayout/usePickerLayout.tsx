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
import { PickerValidValue } from '../internals/models';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { usePickerContext } from '../hooks';

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
  const { ownerState: pickerOwnerState } = usePickerPrivateContext();
  const { variant, view } = usePickerContext();
  const isRtl = useRtl();

  const { children, slots, slotProps, classes: classesProp } = props;

  const ownerState = React.useMemo<PickerLayoutOwnerState>(
    () => ({ ...pickerOwnerState, layoutDirection: isRtl ? 'rtl' : 'ltr' }),
    [pickerOwnerState, isRtl],
  );
  const classes = useUtilityClasses(classesProp, ownerState);

  // Action bar
  const ActionBar = slots?.actionBar ?? PickersActionBar;
  const actionBarProps = useSlotProps({
    elementType: ActionBar,
    externalSlotProps: slotProps?.actionBar,
    additionalProps: {
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
    className: classes.toolbar,
    ownerState,
  });
  const toolbar = toolbarHasView(toolbarProps) && !!Toolbar ? <Toolbar {...toolbarProps} /> : null;

  // Content
  const content = children;

  // Tabs
  const Tabs = slots?.tabs;
  const tabs = view && Tabs ? <Tabs className={classes.tabs} {...slotProps?.tabs} /> : null;

  // Shortcuts
  const Shortcuts = slots?.shortcuts ?? PickersShortcuts;
  const shortcutsProps = useSlotProps({
    elementType: Shortcuts!,
    externalSlotProps: slotProps?.shortcuts,
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
