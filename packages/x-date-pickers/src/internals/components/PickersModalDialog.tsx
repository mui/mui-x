import * as React from 'react';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps as MuiDialogProps, dialogClasses } from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { DIALOG_WIDTH } from '../constants/dimensions';
import { PickersActionBar, PickersActionBarProps } from '../../PickersActionBar';

export interface PickersModalDialogSlotsComponent {
  ActionBar: React.ElementType<PickersActionBarProps>;
}
export interface PickersModalDialogSlotsComponentsProps {
  actionBar: Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>;
}

export interface ExportedPickerModalProps {
  /**
   * Props applied to the [`Dialog`](https://mui.com/material-ui/api/dialog/) element.
   */
  DialogProps?: Partial<MuiDialogProps>;
}

export interface PickersModalDialogProps extends ExportedPickerModalProps {
  onAccept: () => void;
  onClear: () => void;
  onDismiss: () => void;
  onCancel: () => void;
  onSetToday: () => void;
  open: boolean;
  components?: Partial<PickersModalDialogSlotsComponent>;
  componentsProps?: Partial<PickersModalDialogSlotsComponentsProps>;
}

const PickersModalDialogRoot = styled(Dialog)({
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
    DialogProps = {},
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
  return (
    <PickersModalDialogRoot open={open} onClose={onDismiss} {...DialogProps}>
      <PickersModalDialogContent>{children}</PickersModalDialogContent>
      <ActionBar
        onAccept={onAccept}
        onClear={onClear}
        onCancel={onCancel}
        onSetToday={onSetToday}
        actions={['cancel', 'accept']}
        {...componentsProps?.actionBar}
      />
    </PickersModalDialogRoot>
  );
};
