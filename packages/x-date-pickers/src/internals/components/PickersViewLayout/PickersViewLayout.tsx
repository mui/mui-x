import * as React from 'react';
import clsx from 'clsx';
import { useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled, useThemeProps } from '@mui/material/styles';
import { PickersActionBar } from '../../../PickersActionBar';
import { DateOrTimeView } from '../../models/views';
import { PickersViewLayoutSlotOwnerState, PickersViewLayoutProps } from './PickersViewLayout.types';
import {
  getPickersViewLayoutUtilityClass,
  pickersViewLayoutClasses,
} from './pickersViewLayoutClasses';

export const PickersViewLayoutRoot = styled('div', {
  name: 'MuiPickersViewLayout',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  display: 'grid',
  gridAutoColumns: 'max-content auto max-content',
  gridAutoRows: 'max-content auto max-content',
  [`&.${pickersViewLayoutClasses.landscape} .${pickersViewLayoutClasses.toolbar}`]: {
    gridColumn: theme.direction === 'rtl' ? '3' : '1',
    gridRow: '1 / 3',
  },
}));

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
})({
  gridColumn: '1 / 4',
  gridRow: '1',
});

export const PickersViewLayoutActionBar = styled('div', {
  name: 'MuiPickersViewLayout',
  slot: 'ActionBar',
  overridesResolver: (props, styles) => styles.actionBar,
})({
  gridColumn: '1 / 4',
  gridRow: '3',
});

const useUtilityClasses = (ownerState: PickersViewLayoutProps<any, any>) => {
  const { classes, isLandscape } = ownerState;
  const slots = {
    root: ['root', isLandscape && 'landscape'],
    content: ['content'],
    toolbar: ['toolbar'],
    actionBar: ['actionBar'],
  };

  return composeClasses(slots, getPickersViewLayoutUtilityClass, classes);
};

function DefaultPickersViewLayout(props: PickersViewLayoutSlotOwnerState<any, any>) {
  const { toolbar, content, actionBar, children, sx, className } = props;

  return (
    <PickersViewLayoutRoot sx={sx} className={className}>
      {children ?? [toolbar, content, actionBar]}
    </PickersViewLayoutRoot>
  );
}

type PickersViewLayoutComponent = <TValue, TView extends DateOrTimeView>(
  props: PickersViewLayoutProps<TValue, TView> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element;

export const PickersViewLayout = React.forwardRef(function PickersViewLayout<
  TValue,
  TView extends DateOrTimeView,
>(inProps: PickersViewLayoutProps<TValue, TView>, ref: React.Ref<HTMLDivElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersViewLayout' });

  const { children, components, componentsProps, ...other } = props;
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
    className,
  } = other;
  const classes = useUtilityClasses(props);

  const ActionBar = components?.ActionBar ?? PickersActionBar;
  const Tabs = components?.Tabs;

  const shouldRenderToolbar = showToolbar ?? wrapperVariant !== 'desktop';
  const Toolbar = components?.Toolbar;

  const subComponents = {
    toolbar:
      view && shouldRenderToolbar && !!Toolbar ? (
        <PickersViewLayoutToolbar className={classes.toolbar} key="MUI-X_toolbar">
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
      ) : null,
    content: view && (
      <PickersViewLayoutContent className={classes.content} key="MUI-X_content">
        {!!Tabs && <Tabs view={view} onViewChange={onViewChange} {...componentsProps?.tabs} />}
        {children}
      </PickersViewLayoutContent>
    ),
    actionBar: (
      <PickersViewLayoutActionBar className={classes.actionBar} key="MUI-X_actionBar">
        <ActionBar
          onAccept={onAccept}
          onClear={onClear}
          onCancel={onCancel}
          onSetToday={onSetToday}
          actions={wrapperVariant === 'desktop' ? [] : ['cancel', 'accept']}
          {...componentsProps?.actionBar}
        />
      </PickersViewLayoutActionBar>
    ),
  };

  const Layout = components?.Layout ?? DefaultPickersViewLayout;
  const layoutProps = useSlotProps<
    React.JSXElementConstructor<PickersViewLayoutSlotOwnerState<any, any>>,
    PickersViewLayoutProps<any, any>,
    any,
    any
  >({
    elementType: Layout,
    externalSlotProps: componentsProps?.layout,
    additionalProps: {
      ref,
      className: clsx(className, classes.root),
      ...subComponents,
    },
    externalForwardedProps: other,
    ownerState: { ...props, ...subComponents },
  });

  if (view == null) {
    return null;
  }

  return <Layout {...layoutProps} />;
}) as PickersViewLayoutComponent;
