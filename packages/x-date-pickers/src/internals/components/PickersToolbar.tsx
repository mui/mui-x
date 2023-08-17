import * as React from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { BaseToolbarProps } from '../models/props/toolbar';
import { getPickersToolbarUtilityClass, PickersToolbarClasses } from './pickersToolbarClasses';
import { DateOrTimeViewWithMeridiem } from '../models';

export interface PickersToolbarProps<TValue, TView extends DateOrTimeViewWithMeridiem>
  extends Pick<BaseToolbarProps<TValue, TView>, 'isLandscape' | 'hidden' | 'titleId'> {
  className?: string;
  landscapeDirection?: 'row' | 'column';
  toolbarTitle: React.ReactNode;
  classes?: Partial<PickersToolbarClasses>;
}

const useUtilityClasses = (ownerState: PickersToolbarProps<any, any>) => {
  const { classes, isLandscape } = ownerState;
  const slots = {
    root: ['root'],
    content: ['content'],
    penIconButton: ['penIconButton', isLandscape && 'penIconButtonLandscape'],
  };

  return composeClasses(slots, getPickersToolbarUtilityClass, classes);
};

const PickersToolbarRoot = styled('div', {
  name: 'MuiPickersToolbar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{
  ownerState: PickersToolbarProps<any, any>;
}>(({ theme, ownerState }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  ...(ownerState.isLandscape && {
    height: 'auto',
    maxWidth: 160,
    padding: 16,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  }),
}));

const PickersToolbarContent = styled('div', {
  name: 'MuiPickersToolbar',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
})<{
  ownerState: PickersToolbarProps<any, any>;
}>(({ ownerState }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  justifyContent: ownerState.isLandscape ? 'flex-start' : 'space-between',
  flexDirection: ownerState.isLandscape ? ownerState.landscapeDirection ?? 'column' : 'row',
  flex: 1,
  alignItems: ownerState.isLandscape ? 'flex-start' : 'center',
}));

type PickersToolbarComponent = (<TValue, TView extends DateOrTimeViewWithMeridiem>(
  props: React.PropsWithChildren<PickersToolbarProps<TValue, TView>> &
    React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const PickersToolbar = React.forwardRef(function PickersToolbar<
  TValue,
  TView extends DateOrTimeViewWithMeridiem,
>(
  inProps: React.PropsWithChildren<PickersToolbarProps<TValue, TView>>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersToolbar' });
  const { children, className, toolbarTitle, hidden, titleId } = props;

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  if (hidden) {
    return null;
  }

  return (
    <PickersToolbarRoot
      ref={ref}
      data-mui-test="picker-toolbar"
      className={clsx(classes.root, className)}
      ownerState={ownerState}
    >
      <Typography
        data-mui-test="picker-toolbar-title"
        color="text.secondary"
        variant="overline"
        id={titleId}
      >
        {toolbarTitle}
      </Typography>
      <PickersToolbarContent className={classes.content} ownerState={ownerState}>
        {children}
      </PickersToolbarContent>
    </PickersToolbarRoot>
  );
}) as PickersToolbarComponent;
