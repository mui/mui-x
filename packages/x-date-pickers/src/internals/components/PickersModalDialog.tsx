import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import DialogContent from '@mui/material/DialogContent';
import Fade from '@mui/material/Fade';
import MuiDialog, { DialogProps as MuiDialogProps, dialogClasses } from '@mui/material/Dialog';
import { PaperProps as MuiPaperProps } from '@mui/material/Paper/Paper';
import { TransitionProps as MuiTransitionProps } from '@mui/material/transitions/transition';
import { styled } from '@mui/material/styles';
import { DIALOG_WIDTH } from '../constants/dimensions';
import { PickersActionBar, PickersActionBarAction } from '../../PickersActionBar';
import { PickerStateWrapperProps } from '../hooks/usePickerState';
import { PickersSlotsComponent, PickersSlotsComponentsProps } from './wrappers/WrapperProps';
import { UncapitalizeObjectKeys } from '../utils/slots-migration';

export interface PickersModalDialogSlotsComponent extends Pick<PickersSlotsComponent, 'ActionBar'> {
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

export interface PickersModalDialogSlotsComponentsProps
  extends Pick<PickersSlotsComponentsProps, 'actionBar'> {
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
   * @deprecated Please use `slots`.
   */
  components?: PickersModalDialogSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: PickersModalDialogSlotsComponentsProps;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<PickersModalDialogSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PickersModalDialogSlotsComponentsProps;
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

export function PickersModalDialog(props: React.PropsWithChildren<PickersModalDialogProps>) {
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
    slots,
    slotProps,
  } = props;

  const ActionBar = slots?.actionBar ?? components?.ActionBar ?? PickersActionBar;
  const actionBarProps = useSlotProps({
    elementType: ActionBar,
    externalSlotProps: slotProps?.actionBar ?? componentsProps?.actionBar,
    additionalProps: {
      onAccept,
      onClear,
      onCancel,
      onSetToday,
      actions: ['cancel', 'accept'] as PickersActionBarAction[],
    },
    ownerState: { wrapperVariant: 'mobile' },
  });

  const Dialog = slots?.dialog ?? components?.Dialog ?? PickersModalDialogRoot;
  const Transition = slots?.mobileTransition ?? components?.MobileTransition ?? Fade;

  return (
    <Dialog
      open={open}
      onClose={onDismiss}
      {...componentsProps?.dialog}
      TransitionComponent={Transition}
      TransitionProps={slotProps?.mobileTransition ?? componentsProps?.mobileTransition}
      PaperComponent={slots?.mobilePaper ?? components?.MobilePaper}
      PaperProps={slotProps?.mobilePaper ?? componentsProps?.mobilePaper}
    >
      <PickersModalDialogContent>{children}</PickersModalDialogContent>
      <ActionBar {...actionBarProps} />
    </Dialog>
  );
}
