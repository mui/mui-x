import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled, useThemeProps } from '@mui/material/styles';
import { PickersActionBar } from '../../../PickersActionBar';
import { CalendarOrClockPickerView } from '../../models/views';
import { PickersViewLayoutProps } from './PickersViewLayout.types';
import {
  getPickersViewLayoutUtilityClass,
  pickersViewLayoutClasses,
} from './pickersViewLayoutClasses';

export const PickersViewLayoutRoot = styled('div', {
  name: 'MuiPickersViewLayout',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  display: 'flex',
  flexDirection: 'column',
});

export const PickersViewLayoutContent = styled('div', {
  name: 'MuiPickersViewLayout',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
})({
  display: 'flex',
  flexDirection: 'column',
  [`&.${pickersViewLayoutClasses['content--landscape']}`]: {
    flexDirection: 'row',
  },
});

const useUtilityClasses = (ownerState: PickersViewLayoutProps<any, any>) => {
  const { classes, isLandscape } = ownerState;
  const slots = {
    root: ['root'],
    content: ['content', isLandscape && 'content--landscape'],
  };

  return composeClasses(slots, getPickersViewLayoutUtilityClass, classes);
};

type PickersViewLayoutComponent = <TValue, TView extends CalendarOrClockPickerView>(
  props: PickersViewLayoutProps<TValue, TView> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element;

export const PickersViewLayout = React.forwardRef(function PickersViewLayout<
  TValue,
  TView extends CalendarOrClockPickerView,
>(inProps: PickersViewLayoutProps<TValue, TView>, ref: React.Ref<HTMLDivElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersViewLayout' });

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

  const classes = useUtilityClasses(props);

  const ActionBar = components?.ActionBar ?? PickersActionBar;
  const Tabs = components?.Tabs;

  const shouldRenderToolbar = showToolbar ?? wrapperVariant !== 'desktop';
  const Toolbar = components?.Toolbar;

  if (view == null) {
    return null;
  }

  return (
    <PickersViewLayoutRoot className={clsx(className, classes.root)} ref={ref}>
      <PickersViewLayoutContent className={classes.content}>
        {shouldRenderToolbar && !!Toolbar && (
          <Toolbar
            {...componentsProps?.toolbar}
            isLandscape={isLandscape}
            onChange={onChange}
            value={value}
            view={view}
            onViewChange={onViewChange}
            views={views}
            disabled={disabled}
            readOnly={readOnly}
          />
        )}
        {!!Tabs && <Tabs view={view} onViewChange={onViewChange} {...componentsProps?.tabs} />}
        {children}
      </PickersViewLayoutContent>
      <ActionBar
        onAccept={onAccept}
        onClear={onClear}
        onCancel={onCancel}
        onSetToday={onSetToday}
        actions={wrapperVariant === 'desktop' ? [] : ['cancel', 'accept']}
        {...componentsProps?.actionBar}
      />
    </PickersViewLayoutRoot>
  );
}) as PickersViewLayoutComponent;
