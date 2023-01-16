import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { PickersActionBar, PickersActionBarAction } from '../PickersActionBar';
import { PickersLayoutProps, SubComponents } from './PickersLayout.types';
import { getPickersLayoutUtilityClass } from './pickersLayoutClasses';
import { DateOrTimeView } from '../internals/models';
import { BaseToolbarProps } from '../internals/models/props/toolbar';
import { uncapitalizeObjectKeys } from '../internals/utils/slots-migration';

function toolbarHasView<TValue, TView extends DateOrTimeView>(
  toolbarProps: BaseToolbarProps<TValue, TView> | any,
): toolbarProps is BaseToolbarProps<TValue, TView> {
  return toolbarProps.view !== null;
}

// TODO: Remove this functions. It get introduced to mark `value` prop in PickersLayoutProps as not required.
// The true type should be
// - For pickers value: TDate | null
// - For rangepickers value: [TDate | null, TDate | null]
function toolbarHasValue<TValue, TView extends DateOrTimeView>(
  toolbarProps: BaseToolbarProps<TValue | undefined, TView> | any,
): toolbarProps is BaseToolbarProps<TValue, TView> {
  return toolbarProps.value !== undefined;
}

const useUtilityClasses = (ownerState: PickersLayoutProps<any, any>) => {
  const { classes, isLandscape } = ownerState;
  const slots = {
    root: ['root', isLandscape && 'landscape'],
    contentWrapper: ['contentWrapper'],
    toolbar: ['toolbar'],
    actionBar: ['actionBar'],
    tabs: ['tabs'],
    landscape: ['landscape'],
  };

  return composeClasses(slots, getPickersLayoutUtilityClass, classes);
};

interface UsePickerLayoutResponse extends SubComponents {}

const usePickerLayout = <TValue, TView extends DateOrTimeView>(
  props: PickersLayoutProps<TValue, TView>,
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
    isLandscape,
    disabled,
    readOnly,
    children,
    components,
    componentsProps,
    slots: innerSlots,
    slotProps: innerslotProps,
  } = props;
  const slots = innerSlots ?? uncapitalizeObjectKeys(components);
  const slotProps = innerslotProps ?? componentsProps;

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
  const toolbar =
    toolbarHasView(toolbarProps) && toolbarHasValue<TValue, TView>(toolbarProps) && !!Toolbar ? (
      <Toolbar {...toolbarProps} />
    ) : null;

  // Content

  const content = children;

  // Tabs

  const Tabs = slots?.tabs;
  const tabs =
    view && Tabs ? <Tabs view={view} onViewChange={onViewChange} {...slotProps?.tabs} /> : null;

  return {
    toolbar,
    content,
    tabs,
    actionBar,
  };
};

export default usePickerLayout;
