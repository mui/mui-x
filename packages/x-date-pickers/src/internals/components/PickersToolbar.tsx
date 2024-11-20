import * as React from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { BaseToolbarProps } from '../models/props/toolbar';
import { getPickersToolbarUtilityClass, PickersToolbarClasses } from './pickersToolbarClasses';
import { DateOrTimeViewWithMeridiem } from '../models';
import { PickerOwnerState } from '../../models';
import { usePickerPrivateContext } from '../hooks/usePickerPrivateContext';

export interface PickersToolbarProps<TValue, TView extends DateOrTimeViewWithMeridiem>
  extends Pick<BaseToolbarProps<TValue, TView>, 'hidden' | 'titleId'> {
  className?: string;
  landscapeDirection?: 'row' | 'column';
  toolbarTitle: React.ReactNode;
  classes?: Partial<PickersToolbarClasses>;
}

const useUtilityClasses = (
  classes: Partial<PickersToolbarClasses> | undefined,
  ownerState: PickerOwnerState,
) => {
  const slots = {
    root: ['root'],
    content: ['content'],
    penIconButton: [
      'penIconButton',
      ownerState.pickerOrientation === 'landscape' && 'penIconButtonLandscape',
    ],
  };

  return composeClasses(slots, getPickersToolbarUtilityClass, classes);
};

const PickersToolbarRoot = styled('div', {
  name: 'MuiPickersToolbar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{
  ownerState: PickerOwnerState;
}>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  variants: [
    {
      props: { pickerOrientation: 'landscape' },
      style: {
        height: 'auto',
        maxWidth: 160,
        padding: 16,
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
      },
    },
  ],
}));

const PickersToolbarContent = styled('div', {
  name: 'MuiPickersToolbar',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
})<{
  ownerState: PickerOwnerState;
}>({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  variants: [
    {
      props: { pickerOrientation: 'landscape' },
      style: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
      },
    },
    {
      props: { pickerOrientation: 'landscape', landscapeDirection: 'row' },
      style: {
        flexDirection: 'row',
      },
    },
  ],
});

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
  const {
    children,
    className,
    toolbarTitle,
    hidden,
    titleId,
    classes: classesProp,
    landscapeDirection,
    ...other
  } = props;

  const { ownerState } = usePickerPrivateContext();
  const classes = useUtilityClasses(classesProp, ownerState);

  if (hidden) {
    return null;
  }

  return (
    <PickersToolbarRoot
      ref={ref}
      data-testid="picker-toolbar"
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      <Typography
        data-testid="picker-toolbar-title"
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
