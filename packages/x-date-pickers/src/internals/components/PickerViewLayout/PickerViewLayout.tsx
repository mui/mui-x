import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled, useThemeProps } from '@mui/material/styles';
import { PickersActionBar } from '../../../PickersActionBar';
import { CalendarOrClockPickerView } from '../../models/views';
import { PickerViewLayoutProps } from './PickerViewLayout.types';
import {
  getPickerViewLayoutUtilityClass,
  pickerViewLayoutClasses,
} from './pickerViewLayoutClasses';

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
})({
  display: 'flex',
  flexDirection: 'column',
  [`&.${pickerViewLayoutClasses['content--landscape']}`]: {
    flexDirection: 'row',
  },
});

const useUtilityClasses = (ownerState: PickerViewLayoutProps<any, any>) => {
  const { classes, isLandscape } = ownerState;
  const slots = {
    root: ['root'],
    content: ['content', isLandscape && 'content--landscape'],
  };

  return composeClasses(slots, getPickerViewLayoutUtilityClass, classes);
};

export const PickerViewLayout = React.forwardRef(function PickerViewLayout<
  TValue,
  TView extends CalendarOrClockPickerView,
>(inProps: PickerViewLayoutProps<TValue, TView>, ref: React.Ref<HTMLDivElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickerViewLayout' });

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
    <PickerViewLayoutRoot className={clsx(className, classes.root)} ref={ref}>
      <PickerViewLayoutContent className={classes.content}>
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
});
