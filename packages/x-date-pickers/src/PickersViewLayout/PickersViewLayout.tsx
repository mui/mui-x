import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { PickersViewLayoutProps } from './PickersViewLayout.types';
import { pickersViewLayoutClasses } from './pickersViewLayoutClasses';
import usePickerLayout from './usePickerLayout';

export const PickersViewLayoutRoot = styled('div', {
  name: 'MuiPickersViewLayout',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: { isLandscape: boolean } }>(({ theme, ownerState }) => ({
  display: 'grid',
  gridAutoColumns: 'max-content auto max-content',
  gridAutoRows: 'max-content auto max-content',

  [`& .${pickersViewLayoutClasses.toolbar}`]: ownerState.isLandscape
    ? {
        gridColumn: theme.direction === 'rtl' ? 3 : 1,
        gridRow: '1 / 3',
      }
    : { gridColumn: '1 / 4', gridRow: 1 },
  [`& .${pickersViewLayoutClasses.actionBar}`]: { gridColumn: '1 / 4', gridRow: 3 },
}));

export const PickersViewLayoutContentWrapper = styled('div', {
  name: 'MuiPickersViewLayout',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
})({
  gridColumn: 2,
  gridRow: 2,
  display: 'flex',
  flexDirection: 'column',
});

export const PickersViewLayout = React.forwardRef(function PickersViewLayout(
  inProps: PickersViewLayoutProps<any, any>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersViewLayout' });

  const { toolbar, content, tabs, actionBar, classes } = usePickerLayout(props);
  const { sx, className, isLandscape } = props;

  return (
    <PickersViewLayoutRoot
      ref={ref}
      sx={sx}
      className={clsx(className, classes.root)}
      ownerState={{ isLandscape }}
    >
      {toolbar}
      <PickersViewLayoutContentWrapper className={classes.contentWrapper}>
        {tabs}
        {content}
      </PickersViewLayoutContentWrapper>
      {actionBar}
    </PickersViewLayoutRoot>
  );
});
