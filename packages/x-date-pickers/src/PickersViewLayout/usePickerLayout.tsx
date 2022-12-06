import * as React from 'react';
import clsx from 'clsx';
import { useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { PickersActionBar, PickersActionBarAction } from '../PickersActionBar';
import { PickersViewLayoutProps, SubComponents } from './PickersViewLayout.types';
import {
  getPickersViewLayoutUtilityClass,
  PickersViewLayoutClassKey,
} from './pickersViewLayoutClasses';

const useUtilityClasses = (ownerState: PickersViewLayoutProps) => {
  const { classes, isLandscape } = ownerState;
  const slots = {
    root: ['root', isLandscape && 'landscape'],
    contentWrapper: ['contentWrapper'],
    toolbar: ['toolbar'],
    actionBar: ['actionBar'],
    tabs: ['tabs'],
    landscape: ['landscape'],
  };

  return composeClasses(slots, getPickersViewLayoutUtilityClass, classes);
};
interface UsePickerLayoutResponse extends SubComponents {
  classes: Record<PickersViewLayoutClassKey, string>;
}

const usePickerLayout = (props: PickersViewLayoutProps): UsePickerLayoutResponse => {
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
    showToolbar,
    children,
    components,
    componentsProps,
  } = props;

  const classes = useUtilityClasses(props);

  const ActionBar = components?.ActionBar ?? PickersActionBar;
  const actionBarProps = useSlotProps({
    elementType: ActionBar,
    externalSlotProps: componentsProps?.actionBar,
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

  const Tabs = components?.Tabs;

  const shouldRenderToolbar = showToolbar ?? wrapperVariant !== 'desktop';
  const Toolbar = components?.Toolbar;

  const toolbar =
    view && shouldRenderToolbar && !!Toolbar ? (
      <Toolbar
        isLandscape={isLandscape}
        onChange={onChange}
        value={value}
        view={view}
        onViewChange={onViewChange}
        views={views}
        disabled={disabled}
        readOnly={readOnly}
        {...componentsProps?.toolbar}
        className={clsx(classes.toolbar, componentsProps?.toolbar?.className)}
      />
    ) : null;

  const content = children;

  const tabs =
    view && Tabs ? (
      <Tabs view={view} onViewChange={onViewChange} {...componentsProps?.tabs} />
    ) : null;

  const actionBar = (
    <ActionBar
      {...actionBarProps}
      onAccept={onAccept}
      onClear={onClear}
      onCancel={onCancel}
      onSetToday={onSetToday}
      actions={wrapperVariant === 'desktop' ? [] : ['cancel', 'accept']}
      {...componentsProps?.actionBar}
      className={clsx(classes.actionBar, componentsProps?.actionBar?.className)}
    />
  );

  return {
    toolbar,
    content,
    tabs,
    actionBar,
    classes,
  };
};

export default usePickerLayout;
