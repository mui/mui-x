import * as React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps as MuiDialogProps, dialogClasses } from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { DIALOG_WIDTH } from '../constants/dimensions';
import { buildDeprecatedPropsWarning } from '../utils/warning';
import { useLocaleText } from '../hooks/useUtils';

export interface ExportedPickerModalProps {
  /**
   * Ok button text.
   * @default 'OK'
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
   */
  okText?: React.ReactNode;
  /**
   * Cancel text message.
   * @default 'Cancel'
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
   */
  cancelText?: React.ReactNode;
  /**
   * Clear text message.
   * @default 'Clear'
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
   */
  clearText?: React.ReactNode;
  /**
   * Today text message.
   * @default 'Today'
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
   */
  todayText?: React.ReactNode;
  /**
   * If `true`, it shows the clear action in the picker dialog.
   * @default false
   */
  clearable?: boolean;
  /**
   * If `true`, the today button is displayed. **Note** that `showClearButton` has a higher priority.
   * @default false
   */
  showTodayButton?: boolean;
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

const PickersModalDialogActions = styled(DialogActions)<{
  ownerState: PickersModalDialogProps;
}>(({ ownerState }) => ({
  ...((ownerState.clearable || ownerState.showTodayButton) && {
    // set justifyContent to default value to fix IE11 layout bug
    // see https://github.com/mui-org/material-ui-pickers/pull/267
    justifyContent: 'flex-start',
    '& > *:first-of-type': {
      marginRight: 'auto',
    },
  }),
}));

const deprecatedPropsWarning = buildDeprecatedPropsWarning(
  'Props for translation are deprecated. See https://mui.com/x/react-date-pickers/localization for more information.',
);

export const PickersModalDialog = (props: React.PropsWithChildren<PickersModalDialogProps>) => {
  const {
    cancelText: cancelTextProp,
    children,
    clearable = false,
    clearText: clearTextProp,
    DialogProps = {},
    okText: okTextProp,
    onAccept,
    onClear,
    onDismiss,
    onCancel,
    onSetToday,
    open,
    showTodayButton = false,
    todayText: todayTextProp,
  } = props;

  deprecatedPropsWarning({
    cancelText: cancelTextProp,
    clearText: clearTextProp,
    okText: okTextProp,
    todayText: todayTextProp,
  });

  const localeText = useLocaleText();

  const cancelText = cancelTextProp ?? localeText.cancelButtonLabel;
  const clearText = clearTextProp ?? localeText.clearButtonLabel;
  const okText = okTextProp ?? localeText.okButtonLabel;
  const todayText = todayTextProp ?? localeText.todayButtonLabel;

  const ownerState = props;

  return (
    <PickersModalDialogRoot open={open} onClose={onDismiss} {...DialogProps}>
      <PickersModalDialogContent>{children}</PickersModalDialogContent>
      <PickersModalDialogActions ownerState={ownerState}>
        {clearable && (
          <Button data-mui-test="clear-action-button" onClick={onClear}>
            {clearText}
          </Button>
        )}
        {showTodayButton && (
          <Button data-mui-test="today-action-button" onClick={onSetToday}>
            {todayText}
          </Button>
        )}
        {cancelText && <Button onClick={onCancel}>{cancelText}</Button>}
        {okText && <Button onClick={onAccept}>{okText}</Button>}
      </PickersModalDialogActions>
    </PickersModalDialogRoot>
  );
};
