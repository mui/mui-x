'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  useChatConfirmationUtilityClasses,
  type ChatConfirmationClasses,
} from './chatConfirmationClasses';

export interface ChatConfirmationProps {
  /**
   * The question or warning message to display. Required.
   */
  message: string;
  /**
   * Label for the confirm button.
   * @default 'Confirm'
   */
  confirmLabel?: string;
  /**
   * Label for the cancel button.
   * @default 'Cancel'
   */
  cancelLabel?: string;
  /**
   * Called when the user clicks the confirm button.
   */
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Called when the user clicks the cancel button.
   */
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  classes?: Partial<ChatConfirmationClasses>;
}

const useThemeProps = createUseThemeProps('MuiChatConfirmation');

// Inline SVG — avoids @mui/icons-material dependency
function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1.25em" height="1.25em" aria-hidden="true">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  );
}

const ChatConfirmationRoot = styled('div', {
  name: 'MuiChatConfirmation',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${(theme.vars || theme).palette.warning.main}`,
  padding: theme.spacing(2),
  backgroundColor: (theme.vars || theme).palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

const ChatConfirmationIcon = styled('span', {
  name: 'MuiChatConfirmation',
  slot: 'Icon',
  overridesResolver: (_, styles) => styles.icon,
})(({ theme }) => ({
  display: 'flex',
  color: (theme.vars || theme).palette.warning.main,
  fontSize: 20,
}));

const ChatConfirmationMessage = styled('p', {
  name: 'MuiChatConfirmation',
  slot: 'Message',
  overridesResolver: (_, styles) => styles.message,
})(({ theme }) => ({
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.primary,
  margin: 0,
}));

const ChatConfirmationActions = styled('div', {
  name: 'MuiChatConfirmation',
  slot: 'Actions',
  overridesResolver: (_, styles) => styles.actions,
})(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'flex-end',
}));

const ChatConfirmationCancelButton = styled('button', {
  name: 'MuiChatConfirmation',
  slot: 'CancelButton',
  overridesResolver: (_, styles) => styles.cancelButton,
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.625, 1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: 'transparent',
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
  fontFamily: theme.typography.fontFamily,
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color']),
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

const ChatConfirmationConfirmButton = styled('button', {
  name: 'MuiChatConfirmation',
  slot: 'ConfirmButton',
  overridesResolver: (_, styles) => styles.confirmButton,
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.625, 1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${(theme.vars || theme).palette.warning.main}`,
  backgroundColor: (theme.vars || theme).palette.warning.main,
  color: (theme.vars || theme).palette.warning.contrastText,
  fontSize: theme.typography.body2.fontSize,
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightMedium,
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color', 'border-color']),
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.warning.dark,
    borderColor: (theme.vars || theme).palette.warning.dark,
  },
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.warning.main}`,
    outlineOffset: 2,
  },
}));

const ChatConfirmation = React.forwardRef<HTMLDivElement, ChatConfirmationProps>(
  function ChatConfirmation(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatConfirmation' });
    const {
      message,
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      onConfirm,
      onCancel,
      className,
      classes: classesProp,
      ...other
    } = props;
    const classes = useChatConfirmationUtilityClasses(classesProp);

    return (
      <ChatConfirmationRoot ref={ref} className={clsx(classes.root, className)} {...other}>
        <ChatConfirmationIcon className={classes.icon}>
          <WarningIcon />
        </ChatConfirmationIcon>
        <ChatConfirmationMessage className={classes.message}>{message}</ChatConfirmationMessage>
        <ChatConfirmationActions className={classes.actions}>
          <ChatConfirmationCancelButton
            type="button"
            className={classes.cancelButton}
            onClick={onCancel}
          >
            {cancelLabel}
          </ChatConfirmationCancelButton>
          <ChatConfirmationConfirmButton
            type="button"
            className={classes.confirmButton}
            onClick={onConfirm}
          >
            {confirmLabel}
          </ChatConfirmationConfirmButton>
        </ChatConfirmationActions>
      </ChatConfirmationRoot>
    );
  },
);

ChatConfirmation.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Label for the cancel button.
   * @default 'Cancel'
   */
  cancelLabel: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Label for the confirm button.
   * @default 'Confirm'
   */
  confirmLabel: PropTypes.string,
  /**
   * The question or warning message to display. Required.
   */
  message: PropTypes.string.isRequired,
  /**
   * Called when the user clicks the cancel button.
   */
  onCancel: PropTypes.func,
  /**
   * Called when the user clicks the confirm button.
   */
  onConfirm: PropTypes.func,
} as any;

export { ChatConfirmation };
