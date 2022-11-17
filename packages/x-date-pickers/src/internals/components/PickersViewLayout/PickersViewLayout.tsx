import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled, useThemeProps } from '@mui/material/styles';
import { PickersActionBar } from '../../../PickersActionBar';
import { DateOrTimeView } from '../../models/views';
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
  display: 'grid',
  gridAutoColumns: 'max-content auto max-content',
  gridAutoRows: 'max-content auto max-content',
});

export const PickersViewLayoutContent = styled('div', {
  name: 'MuiPickersViewLayout',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
})({
  gridColumn: '2',
  gridRow: '2',
  display: 'flex',
  flexDirection: 'column',
});

export const PickersViewLayoutToolbar = styled('div', {
  name: 'MuiPickersViewLayout',
  slot: 'Toolbar',
  overridesResolver: (props, styles) => styles.toolbar,
})(({ theme }) => ({
  gridColumn: '1 / 4',
  gridRow: '1',
  [`&.${pickersViewLayoutClasses['toolbar--landscape']}`]: {
    gridColumn: theme.direction === 'rtl' ? '3' : '1',
    gridRow: '1 / 3',
  },
}));

export const PickersViewLayoutActionBar = styled('div', {
  name: 'MuiPickersViewLayout',
  slot: 'ActionBar',
  overridesResolver: (props, styles) => styles.actionbar,
})({
  gridColumn: '1 / 4',
  gridRow: '3',
});

const useUtilityClasses = (ownerState: PickersViewLayoutProps<any, any>) => {
  const { classes, isLandscape } = ownerState;
  const slots = {
    root: ['root'],
    content: ['content', isLandscape && 'content--landscape'],
    toolbar: ['toolbar', isLandscape && 'toolbar--landscape'],
    actionbar: ['actionbar', isLandscape && 'actionbar--landscape'],
  };

  return composeClasses(slots, getPickersViewLayoutUtilityClass, classes);
};

type PickersViewLayoutComponent = <TValue, TView extends DateOrTimeView>(
  props: PickersViewLayoutProps<TValue, TView> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element;

export const PickersViewLayout = React.forwardRef(function PickersViewLayout<
  TValue,
  TView extends DateOrTimeView,
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

  const LayoutRoot = components?.LayoutRoot ?? PickersViewLayoutRoot;

  if (view == null) {
    return null;
  }

  return (
    <LayoutRoot
      className={clsx(className, classes.root)}
      ref={ref}
      {...componentsProps?.layoutRoot}
    >
      {shouldRenderToolbar && !!Toolbar && (
        <PickersViewLayoutToolbar className={classes.toolbar}>
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
        </PickersViewLayoutToolbar>
      )}
      <PickersViewLayoutContent className={classes.content}>
        {!!Tabs && <Tabs view={view} onViewChange={onViewChange} {...componentsProps?.tabs} />}
        {children}
      </PickersViewLayoutContent>
      <PickersViewLayoutActionBar className={classes.actionbar}>
        <ActionBar
          onAccept={onAccept}
          onClear={onClear}
          onCancel={onCancel}
          onSetToday={onSetToday}
          actions={wrapperVariant === 'desktop' ? [] : ['cancel', 'accept']}
          {...componentsProps?.actionBar}
        />
      </PickersViewLayoutActionBar>
    </LayoutRoot>
  );
}) as PickersViewLayoutComponent;
