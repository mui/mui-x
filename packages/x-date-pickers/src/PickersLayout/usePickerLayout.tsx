import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { PickersActionBar, PickersActionBarAction } from '../PickersActionBar';
import { PickersLayoutProps, SubComponents } from './PickersLayout.types';
import { getPickersLayoutUtilityClass } from './pickersLayoutClasses';
import { PickersShortcuts } from '../PickersShortcuts';
import { BaseToolbarProps } from '../internals/models/props/toolbar';
import { uncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import { DateOrTimeViewWithMeridiem } from '../internals/models';

function toolbarHasView<TValue, TView extends DateOrTimeViewWithMeridiem>(
  toolbarProps: BaseToolbarProps<TValue, TView> | any,
): toolbarProps is BaseToolbarProps<TValue, TView> {
  return toolbarProps.view !== null;
}

const useUtilityClasses = (ownerState: PickersLayoutProps<any, any, any>) => {
  const { classes, isLandscape } = ownerState;
  const slots = {
    root: ['root', isLandscape && 'landscape'],
    contentWrapper: ['contentWrapper'],
    toolbar: ['toolbar'],
    actionBar: ['actionBar'],
    tabs: ['tabs'],
    landscape: ['landscape'],
    shortcuts: ['shortcuts'],
  };

  return composeClasses(slots, getPickersLayoutUtilityClass, classes);
};

interface PickersLayoutPropsWithValueRequired<
  TValue,
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends PickersLayoutProps<TValue, TDate, TView> {
  value: TValue;
}
interface UsePickerLayoutResponse extends SubComponents {}

const usePickerLayout = <TValue, TDate, TView extends DateOrTimeViewWithMeridiem>(
  props: PickersLayoutProps<TValue, TDate, TView>,
): UsePickerLayoutResponse => {
  const {
    wrapperVariant,
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
    isLandscape,
    disabled,
    readOnly,
    children,
    components,
    componentsProps,
    slots: innerSlots,
    slotProps: innerSlotProps,
    // TODO: Remove this "as" hack. It get introduced to mark `value` prop in PickersLayoutProps as not required.
    // The true type should be
    // - For pickers value: TDate | null
    // - For range pickers value: [TDate | null, TDate | null]
  } = props as PickersLayoutPropsWithValueRequired<TValue, TDate, TView>;

  const slots = innerSlots ?? uncapitalizeObjectKeys(components);
  const slotProps = innerSlotProps ?? componentsProps;

  const classes = useUtilityClasses(props);

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
      actions:
        wrapperVariant === 'desktop' ? [] : (['cancel', 'accept'] as PickersActionBarAction[]),
      className: classes.actionBar,
    },
    ownerState: { ...props, wrapperVariant },
  });
  const actionBar = <ActionBar {...actionBarProps} />;

  // Toolbar

  const Toolbar = slots?.toolbar;
  const toolbarProps = useSlotProps({
    elementType: Toolbar!,
    externalSlotProps: slotProps?.toolbar,
    additionalProps: {
      isLandscape,
      onChange,
      value,
      view,
      onViewChange,
      views,
      disabled,
      readOnly,
      className: classes.toolbar,
    },
    ownerState: { ...props, wrapperVariant },
  });
  const toolbar = toolbarHasView(toolbarProps) && !!Toolbar ? <Toolbar {...toolbarProps} /> : null;

  // Content

  const content = children;

  // Tabs

  const Tabs = slots?.tabs;
  const tabs =
    view && Tabs ? <Tabs view={view} onViewChange={onViewChange} {...slotProps?.tabs} /> : null;

  // Shortcuts

  const Shortcuts = slots?.shortcuts ?? PickersShortcuts;
  const shortcutsProps = useSlotProps({
    elementType: Shortcuts!,
    externalSlotProps: slotProps?.shortcuts,
    additionalProps: {
      isValid,
      isLandscape,
      onChange: onSelectShortcut,
      className: classes.shortcuts,
    },
    ownerState: {
      isValid,
      isLandscape,
      onChange: onSelectShortcut,
      className: classes.shortcuts,
      wrapperVariant,
    },
  });

  const shortcuts = view && !!Shortcuts ? <Shortcuts {...shortcutsProps} /> : null;

  return {
    toolbar,
    content,
    tabs,
    actionBar,
    shortcuts,
  };
};

export default usePickerLayout;
