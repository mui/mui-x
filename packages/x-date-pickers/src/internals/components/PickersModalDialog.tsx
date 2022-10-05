import * as React from 'react';
import DialogContent from '@mui/material/DialogContent';
import Fade from '@mui/material/Fade';
import MuiDialog, { DialogProps as MuiDialogProps, dialogClasses } from '@mui/material/Dialog';
import { PaperProps as MuiPaperProps } from '@mui/material/Paper/Paper';
import { TransitionProps as MuiTransitionProps } from '@mui/material/transitions/transition';
import { styled } from '@mui/material/styles';
import { DIALOG_WIDTH } from '../constants/dimensions';
import { PickersActionBar, PickersActionBarProps } from '../../PickersActionBar';
import { PickerStateWrapperProps } from '../hooks/usePickerState';

export interface PickersModalDialogSlotsComponent {
  /**
   * Custom component for the action bar, it is placed bellow the picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
  /**
   * Custom component for the dialog inside which the views are rendered on mobile.
   * @default PickersModalDialogRoot
   */
  Dialog?: React.ElementType<MuiDialogProps>;
  /**
   * Custom component for the paper rendered inside the mobile picker's Dialog.
   * @default Paper from @mui/material
   */
  MobilePaper?: React.JSXElementConstructor<MuiPaperProps>;
  /**
   * Custom component for the mobile dialog [Transition](https://mui.com/material-ui/transitions).
   * @default Fade from @mui/material
   */
  MobileTransition?: React.JSXElementConstructor<MuiTransitionProps>;
}

export interface PickersModalDialogSlotsComponentsProps {
  /**
   * Props passed down to the action bar component.
   */
  actionBar?: Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>;
  /**
   * Props passed down to the [`Dialog`](https://mui.com/material-ui/api/dialog/) component.
   */
  dialog?: Partial<MuiDialogProps>;
  /**
   * Props passed down to the mobile [Paper](https://mui.com/material-ui/api/paper/) component.
   */
  mobilePaper?: Partial<MuiPaperProps>;
  /**
   * Props passed down to the mobile [Transition](https://mui.com/material-ui/transitions) component.
   */
  mobileTransition?: Partial<MuiTransitionProps>;
}

export interface PickersModalDialogProps extends PickerStateWrapperProps {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<PickersModalDialogSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<PickersModalDialogSlotsComponentsProps>;
}

const PickersModalDialogRoot = styled(MuiDialog)({
  [`& .${dialogClasses.container}`]: {
    outline: 0,
  },
  [`& .${dialogClasses.paper}`]: {
    outline: 0,
    minWidth: DIALOG_WIDTH,
  },
});

const PickersModalDialogContent = styled(DialogContent)({
  '&:first-of-type': {
    padding: 0,
  },
});

export const PickersModalDialog = (props: React.PropsWithChildren<PickersModalDialogProps>) => {
  const {
    children,
    onAccept,
    onClear,
    onDismiss,
    onCancel,
    onSetToday,
    open,
    components,
    componentsProps,
  } = props;

  const ActionBar = components?.ActionBar ?? PickersActionBar;
  const Dialog = components?.Dialog ?? PickersModalDialogRoot;
  const Transition = components?.MobileTransition ?? Fade;

  return (
    <Dialog
      open={open}
      onClose={onDismiss}
      {...componentsProps?.dialog}
      TransitionComponent={Transition}
      TransitionProps={componentsProps?.mobileTransition}
      PaperComponent={components?.MobilePaper}
      PaperProps={componentsProps?.mobilePaper}
    >
      <PickersModalDialogContent>{children}</PickersModalDialogContent>
      <ActionBar
        onAccept={onAccept}
        onClear={onClear}
        onCancel={onCancel}
        onSetToday={onSetToday}
        actions={['cancel', 'accept']}
        {...componentsProps?.actionBar}
      />
    </Dialog>
  );
};
