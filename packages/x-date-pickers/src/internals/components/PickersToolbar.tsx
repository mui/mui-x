import * as React from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { shouldForwardProp } from '@mui/system/createStyled';
import { BaseToolbarProps } from '../models/props/toolbar';
import { getPickersToolbarUtilityClass, PickersToolbarClasses } from './pickersToolbarClasses';
import { PickerToolbarOwnerState, useToolbarOwnerState } from '../hooks/useToolbarOwnerState';

export interface PickersToolbarProps extends Pick<BaseToolbarProps, 'hidden' | 'titleId'> {
  className?: string;
  landscapeDirection?: 'row' | 'column';
  toolbarTitle: React.ReactNode;
  classes?: Partial<PickersToolbarClasses>;
}

const useUtilityClasses = (classes: Partial<PickersToolbarClasses> | undefined) => {
  const slots = {
    root: ['root'],
    content: ['content'],
  };

  return composeClasses(slots, getPickersToolbarUtilityClass, classes);
};

const PickersToolbarRoot = styled('div', {
  name: 'MuiPickersToolbar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: PickerToolbarOwnerState }>(({ theme }) => ({
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
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'landscapeDirection',
})<{
  ownerState: PickerToolbarOwnerState;
  landscapeDirection: 'row' | 'column' | undefined;
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

type PickersToolbarComponent = ((
  props: React.PropsWithChildren<PickersToolbarProps> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const PickersToolbar = React.forwardRef(function PickersToolbar(
  inProps: React.PropsWithChildren<PickersToolbarProps>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersToolbar' });
  const {
    children,
    className,
    classes: classesProp,
    toolbarTitle,
    hidden,
    titleId,
    classes: inClasses,
    landscapeDirection,
    ...other
  } = props;

  const ownerState = useToolbarOwnerState();
  const classes = useUtilityClasses(classesProp);

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
      <PickersToolbarContent
        className={classes.content}
        ownerState={ownerState}
        landscapeDirection={landscapeDirection}
      >
        {children}
      </PickersToolbarContent>
    </PickersToolbarRoot>
  );
}) as PickersToolbarComponent;
