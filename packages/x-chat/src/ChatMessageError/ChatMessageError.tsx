'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import Button from '@mui/material/Button';
import {
  MessageError,
  type MessageErrorProps,
  type MessageErrorOwnerState,
  useChatLocaleText,
  useChatStatus,
  useMessage,
} from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  useChatMessageErrorUtilityClasses,
  type ChatMessageErrorClasses,
} from './chatMessageErrorClasses';

const useThemeProps = createUseThemeProps('MuiChatMessageError');

function getErrorCardBackground(theme: Theme & { vars?: any }) {
  if (theme.vars) {
    return `rgba(${theme.vars.palette.error.mainChannel} / 0.08)`;
  }
  if (theme.palette.mode === 'dark') {
    return 'rgba(244, 67, 54, 0.16)';
  }
  return 'rgba(244, 67, 54, 0.08)';
}

export interface ChatMessageErrorProps extends MessageErrorProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageErrorClasses>;
}

const ChatMessageErrorRoot = styled('div', {
  name: 'MuiChatMessageError',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState?: MessageErrorOwnerState }>(({ theme, ownerState }) => ({
  // Inline error card anchored in the message's `error` grid area.
  gridArea: 'error',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBlock: theme.spacing(0.5),
  paddingBlock: theme.spacing(0.75),
  paddingInline: theme.spacing(1.25),
  maxWidth: '100%',
  boxSizing: 'border-box',
  border: `1px solid ${(theme.vars || theme).palette.error.main}`,
  borderRadius: theme.shape.borderRadius,
  color: (theme.vars || theme).palette.error.main,
  backgroundColor: getErrorCardBackground(theme),
  fontSize: theme.typography.body2.fontSize,
  lineHeight: theme.typography.body2.lineHeight,
  ...(ownerState?.role === 'user' && {
    justifySelf: 'end',
  }),
}));

const ChatMessageErrorMessage = styled('span', {
  name: 'MuiChatMessageError',
  slot: 'Message',
  overridesResolver: (_, styles) => styles.message,
})({
  flex: 1,
  minWidth: 0,
  wordBreak: 'break-word',
});

const ChatMessageErrorRetryButton = styled(Button, {
  name: 'MuiChatMessageError',
  slot: 'RetryButton',
  overridesResolver: (_, styles) => styles.retryButton,
})(({ theme }) => ({
  flexShrink: 0,
  minWidth: 0,
  color: (theme.vars || theme).palette.error.main,
}));

const ChatMessageErrorSlot = React.forwardRef<HTMLDivElement, any>(
  function ChatMessageErrorSlot(props, ref) {
    const { ownerState, className, children, ...other } = props as {
      ownerState: MessageErrorOwnerState;
      className?: string;
      children?: React.ReactNode;
    } & React.HTMLAttributes<HTMLDivElement>;
    const localeText = useChatLocaleText();
    const classes = useChatMessageErrorUtilityClasses(undefined);
    const message = useMessage(ownerState.messageId);
    const { isStreaming } = useChatStatus();

    // While any stream is in flight, or the message itself is busy, disable the
    // retry button to prevent double submissions.
    const disabled =
      !ownerState.retryable ||
      isStreaming ||
      message?.status === 'sending' ||
      message?.status === 'streaming';

    return (
      <ChatMessageErrorRoot ref={ref} ownerState={ownerState} className={className} {...other}>
        <ChatMessageErrorMessage className={classes.message}>
          {children ?? ownerState.chatError?.message}
        </ChatMessageErrorMessage>
        {ownerState.retryable ? (
          <ChatMessageErrorRetryButton
            type="button"
            size="small"
            variant="text"
            color="error"
            className={classes.retryButton}
            disabled={disabled}
            onClick={() => {
              void ownerState.retry();
            }}
          >
            {localeText.retryButtonLabel}
          </ChatMessageErrorRetryButton>
        ) : null}
      </ChatMessageErrorRoot>
    );
  },
);

const ChatMessageError = React.forwardRef<HTMLDivElement, ChatMessageErrorProps>(
  function ChatMessageError(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessageError' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatMessageErrorUtilityClasses(classesProp);

    return (
      <MessageError
        ref={ref}
        {...other}
        slots={{
          root: slots?.root ?? ChatMessageErrorSlot,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          root: {
            className: clsx(classes.root, className),
            sx,
            ...(slotProps?.root as object),
          } as any,
        }}
      />
    );
  },
);

ChatMessageError.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatMessageError };
