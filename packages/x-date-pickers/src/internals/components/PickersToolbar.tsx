import * as React from 'react';
import clsx from 'clsx';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { Pen, Calendar, Clock } from './icons';
import { BaseToolbarProps } from '../models/props/baseToolbarProps';
import { useLocaleText } from '../hooks/useUtils';
import {
  getPickersToolbarUtilityClass,
  pickersToolbarClasses,
  PickersToolbarClasses,
} from './pickersToolbarClasses';

export interface PickersToolbarProps<TDate, TValue>
  extends Pick<
    BaseToolbarProps<TDate, TValue>,
    'getMobileKeyboardInputViewButtonText' | 'isMobileKeyboardViewOpen' | 'toggleMobileKeyboardView'
  > {
  className?: string;
  viewType?: 'calendar' | 'clock';
  isLandscape: boolean;
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

const PickersToolbarContent = styled(Grid, {
  name: 'MuiPickersToolbar',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
})<{
  ownerState: PickersToolbarProps<any, any>;
}>({
  flex: 1,
});

const PickersToolbarPenIconButton = styled(IconButton, {
  name: 'MuiPickersToolbar',
  slot: 'PenIconButton',
  overridesResolver: (props, styles) => [
    { [`&.${pickersToolbarClasses.penIconButtonLandscape}`]: styles.penIconButtonLandscape },
    styles.penIconButton,
  ],
})<{
  ownerState: PickersToolbarProps<any, any>;
}>({});

const getViewTypeIcon = (viewType: 'calendar' | 'clock') =>
  viewType === 'clock' ? <Clock color="inherit" /> : <Calendar color="inherit" />;

type PickersToolbarComponent = (<TDate, TValue>(
  props: React.PropsWithChildren<PickersToolbarProps<TDate, TValue>> &
    React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

export const PickersToolbar = React.forwardRef(function PickersToolbar<TDate, TValue>(
  inProps: React.PropsWithChildren<PickersToolbarProps<TDate, TValue>>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersToolbar' });
  const {
    children,
    className,
    getMobileKeyboardInputViewButtonText,
    isLandscape,
    isMobileKeyboardViewOpen,
    landscapeDirection = 'column',
    toggleMobileKeyboardView,
    toolbarTitle,
    viewType = 'calendar',
  } = props;

  const ownerState = props;
  const localeText = useLocaleText();
  const classes = useUtilityClasses(ownerState);

  return (
    <PickersToolbarRoot
      ref={ref}
      data-mui-test="picker-toolbar"
      className={clsx(classes.root, className)}
      ownerState={ownerState}
    >
      <Typography data-mui-test="picker-toolbar-title" color="text.secondary" variant="overline">
        {toolbarTitle}
      </Typography>
      <PickersToolbarContent
        container
        justifyContent="space-between"
        className={classes.content}
        ownerState={ownerState}
        direction={isLandscape ? landscapeDirection : 'row'}
        alignItems={isLandscape ? 'flex-start' : 'flex-end'}
      >
        {children}
        <PickersToolbarPenIconButton
          onClick={toggleMobileKeyboardView}
          className={classes.penIconButton}
          ownerState={ownerState}
          color="inherit"
          data-mui-test="toggle-mobile-keyboard-view"
          aria-label={
            getMobileKeyboardInputViewButtonText
              ? getMobileKeyboardInputViewButtonText(isMobileKeyboardViewOpen, viewType)
              : localeText.inputModeToggleButtonAriaLabel(isMobileKeyboardViewOpen, viewType)
          }
        >
          {isMobileKeyboardViewOpen ? getViewTypeIcon(viewType) : <Pen color="inherit" />}
        </PickersToolbarPenIconButton>
      </PickersToolbarContent>
    </PickersToolbarRoot>
  );
}) as PickersToolbarComponent;
