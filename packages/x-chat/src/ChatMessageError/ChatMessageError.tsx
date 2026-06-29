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
import { mergeSlotProps } from '../internals/mergeSlotProps';
import {
  useChatMessageErrorUtilityClasses,
  type ChatMessageErrorClasses,
} from './chatMessageErrorClasses';

const useThemeProps = createUseThemeProps('MuiChatMessageError');

function getErrorCardBackgroundStyles(
  theme: Theme & { vars?: any; alpha: (color: string, value: number) => string },
) {
  // Scheme-scoped via `applyStyles` so the dark-mode tint (0.16) actually applies
  // under runtime CSS-vars color-scheme switching, instead of the mode being read
  // once at styled time and baked from the default scheme. `theme.alpha` keeps the
  // color SSR-safe (and avoids the imported `alpha()` CSS-vars hazard).
  return {
    backgroundColor: theme.alpha(theme.palette.error.main, 0.08),
    ...theme.applyStyles('dark', {
      backgroundColor: theme.alpha(theme.palette.error.main, 0.16),
    }),
  };
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
  ...getErrorCardBackgroundStyles(theme),
  fontSize: theme.typography.body2.fontSize,
  lineHeight: theme.typography.body2.lineHeight,
  ...(ownerState?.isOwnMessage && {
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
    const { ownerState, className, children, messageClassName, retryButtonClassName, ...other } =
      props as {
        ownerState: MessageErrorOwnerState;
        className?: string;
        children?: React.ReactNode;
        messageClassName?: string;
        retryButtonClassName?: string;
      } & React.HTMLAttributes<HTMLDivElement>;
    const localeText = useChatLocaleText();
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
      <ChatMessageErrorRoot
        ref={ref}
        ownerState={ownerState}
        className={className}
        // The headless `MessageError` injects `role="alert"` (assertive implicit
        // live region). Loading a conversation that already contains failed
        // messages would otherwise blast every historical error on mount,
        // interrupting the screen reader. An explicit `aria-live="polite"` wins
        // over the role's implicit assertive value (per WAI-ARIA), keeping the
        // alert semantics while announcing politely. `{...other}` keeps the
        // headless `role`. `aria-atomic` reads the whole card as one unit.
        aria-live="polite"
        aria-atomic="true"
        {...other}
      >
        <ChatMessageErrorMessage className={messageClassName}>
          {children ?? ownerState.chatError?.message}
        </ChatMessageErrorMessage>
        {ownerState.retryable ? (
          <ChatMessageErrorRetryButton
            type="button"
            size="small"
            variant="text"
            color="error"
            className={retryButtonClassName}
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
    const hasCustomRoot = Boolean(slots?.root);

    return (
      <MessageError
        ref={ref}
        {...other}
        slots={{
          ...slots,
          root: slots?.root ?? ChatMessageErrorSlot,
        }}
        slotProps={{
          ...slotProps,
          root: mergeSlotProps(
            {
              className: clsx(classes.root, className),
              sx,
              // Private sub-element classNames only reach the built-in slot; a
              // custom `slots.root` shouldn't receive (and possibly leak to the
              // DOM) these internal props.
              ...(hasCustomRoot
                ? {}
                : {
                    messageClassName: classes.message,
                    retryButtonClassName: classes.retryButton,
                  }),
            },
            slotProps?.root,
          ) as any,
        }}
      />
    );
  },
);

ChatMessageError.propTypes /* remove-proptypes */ = {
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
