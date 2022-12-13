import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { PickersLayoutProps } from './PickersLayout.types';
import { pickersLayoutClasses } from './pickersLayoutClasses';
import usePickerLayout from './usePickerLayout';

export const PickersLayoutRoot = styled('div', {
  name: 'MuiPickersLayout',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: { isLandscape: boolean } }>(({ theme, ownerState }) => ({
  display: 'grid',
  gridAutoColumns: 'max-content 1fr max-content',
  gridAutoRows: 'max-content 1fr max-content',

  [`.${pickersLayoutClasses.toolbar}`]: ownerState.isLandscape
    ? {
        gridColumn: theme.direction === 'rtl' ? 3 : 1,
        gridRow: '2 / 3',
      }
    : { gridColumn: '2 / 4', gridRow: 1 },
  [`.${pickersLayoutClasses.shortcuts}`]: ownerState.isLandscape
    ? { gridColumn: '2 / 4', gridRow: 1 }
    : {
        gridColumn: theme.direction === 'rtl' ? 3 : 1,
        gridRow: '2 / 3',
      },
  [`& .${pickersLayoutClasses.actionBar}`]: { gridColumn: '1 / 4', gridRow: 3 },
}));

export const PickersLayoutContentWrapper = styled('div', {
  name: 'MuiPickersLayout',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.contentWrapper,
})({
  gridColumn: 2,
  gridRow: 2,
  display: 'flex',
  flexDirection: 'column',
});

export const PickersLayout = React.forwardRef(function PickersLayout(
  inProps: PickersLayoutProps<any, any>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersLayout' });

  const { toolbar, content, tabs, actionBar, shortcuts } = usePickerLayout(props);
  const { sx, className, isLandscape } = props;

  return (
    <PickersLayoutRoot
      ref={ref}
      sx={sx}
      className={clsx(className, pickersLayoutClasses.root)}
      ownerState={{ isLandscape }}
    >
      {isLandscape ? shortcuts : toolbar}
      {isLandscape ? toolbar : shortcuts}
      <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>
        {tabs}
        {content}
      </PickersLayoutContentWrapper>
      {actionBar}
    </PickersLayoutRoot>
  );
});
