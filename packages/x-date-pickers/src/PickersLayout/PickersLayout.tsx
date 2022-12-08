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
  gridAutoColumns: 'max-content auto max-content',
  gridAutoRows: 'max-content auto max-content',

  [`& .${pickersLayoutClasses.toolbar}`]: ownerState.isLandscape
    ? {
        gridColumn: theme.direction === 'rtl' ? 3 : 1,
        gridRow: '1 / 3',
      }
    : { gridColumn: '1 / 4', gridRow: 1 },
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

  const { toolbar, content, tabs, actionBar } = usePickerLayout(props);
  const { sx, className, isLandscape } = props;

  return (
    <PickersLayoutRoot
      ref={ref}
      sx={sx}
      className={clsx(className, pickersLayoutClasses.root)}
      ownerState={{ isLandscape }}
    >
      {toolbar}
      <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>
        {tabs}
        {content}
      </PickersLayoutContentWrapper>
      {actionBar}
    </PickersLayoutRoot>
  );
});
