'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import type { SxProps, Theme } from '@mui/system';
import { keyframes } from '@mui/system';
import { StreamingIndicator } from '@mui/x-chat-headless';
import type { StreamingIndicatorProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { mergeSlotProps } from '../internals/mergeSlotProps';
import { useChatStreamingIndicatorUtilityClasses } from './chatStreamingIndicatorClasses';
import type { ChatStreamingIndicatorClasses } from './chatStreamingIndicatorClasses';

const useThemeProps = createUseThemeProps('MuiChatStreamingIndicator');

export interface ChatStreamingIndicatorProps extends StreamingIndicatorProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatStreamingIndicatorClasses>;
}

// Wave: each dot scales up + brightens in sequence. Action is compressed
// into the first ~30% of a long cycle so there's a generous rest between
// turns — tuned to feel calm and unhurried rather than fidgety.
const wave = keyframes`
  0%, 30%, 100% { transform: scale(0.72); opacity: 0.42; }
  15%           { transform: scale(1.16); opacity: 0.92; }
`;

const ChatStreamingIndicatorStyled = styled('div', {
  name: 'MuiChatStreamingIndicator',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 14,
  marginTop: theme.spacing(0.5),
  '& > span': {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: (theme.vars || theme).palette.text.secondary,
    animation: `${wave} 2.6s ease-in-out infinite`,
  },
  '& > span:nth-of-type(2)': { animationDelay: '0.18s' },
  '& > span:nth-of-type(3)': { animationDelay: '0.36s' },
}));

/**
 * Animated dots shown while an assistant response is in flight: as a trailing
 * row while waiting for the response to start, then inside the assistant
 * message while it streams.
 */
const ChatStreamingIndicator = React.forwardRef<HTMLDivElement, ChatStreamingIndicatorProps>(
  function ChatStreamingIndicator(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatStreamingIndicator' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatStreamingIndicatorUtilityClasses(classesProp);

    return (
      <StreamingIndicator
        ref={ref}
        {...other}
        slots={{
          ...slots,
          root: slots?.root ?? ChatStreamingIndicatorStyled,
        }}
        slotProps={{
          ...slotProps,
          root: mergeSlotProps(
            {
              className: clsx(classes.root, className),
              sx,
            },
            slotProps?.root,
          ) as any,
        }}
      />
    );
  },
);

ChatStreamingIndicator.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  index: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.string),
  /**
   * The assistant message to reflect. Falls back to the surrounding
   * `MessageContext` when omitted (the default when mounted inside a chat
   * message). When a message is in scope, the indicator renders only while
   * that message is an assistant message with `status: 'streaming'`.
   */
  message: PropTypes.shape({
    author: PropTypes.shape({
      avatarUrl: PropTypes.string,
      displayName: PropTypes.string,
      id: PropTypes.string.isRequired,
      isOnline: PropTypes.bool,
      metadata: PropTypes.object,
      role: PropTypes.oneOf(['assistant', 'system', 'user']),
    }),
    conversationId: PropTypes.string,
    createdAt: PropTypes.string,
    editedAt: PropTypes.string,
    id: PropTypes.string.isRequired,
    metadata: PropTypes.object,
    parts: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          data: PropTypes.any.isRequired,
          id: PropTypes.string,
          transient: PropTypes.bool,
          type: PropTypes.object.isRequired,
        }),
        PropTypes.shape({
          filename: PropTypes.string,
          mediaType: PropTypes.string.isRequired,
          type: PropTypes.oneOf(['file']).isRequired,
          url: PropTypes.string.isRequired,
        }),
        PropTypes.shape({
          sourceId: PropTypes.string.isRequired,
          text: PropTypes.string,
          title: PropTypes.string,
          type: PropTypes.oneOf(['source-document']).isRequired,
        }),
        PropTypes.shape({
          sourceId: PropTypes.string.isRequired,
          title: PropTypes.string,
          type: PropTypes.oneOf(['source-url']).isRequired,
          url: PropTypes.string.isRequired,
        }),
        PropTypes.shape({
          state: PropTypes.oneOf(['done', 'streaming']),
          text: PropTypes.string.isRequired,
          type: PropTypes.oneOf(['reasoning']).isRequired,
        }),
        PropTypes.shape({
          state: PropTypes.oneOf(['done', 'streaming']),
          text: PropTypes.string.isRequired,
          type: PropTypes.oneOf(['text']).isRequired,
        }),
        PropTypes.shape({
          toolInvocation: PropTypes.shape({
            approval: PropTypes.object,
            approvalId: PropTypes.string,
            callProviderMetadata: PropTypes.object,
            errorText: PropTypes.string,
            input: PropTypes.any,
            output: PropTypes.any,
            preliminary: PropTypes.bool,
            providerExecuted: PropTypes.bool,
            state: PropTypes.oneOf([
              'approval-requested',
              'approval-responded',
              'input-available',
              'input-streaming',
              'output-available',
              'output-denied',
              'output-error',
            ]).isRequired,
            title: PropTypes.string,
            toolCallId: PropTypes.string.isRequired,
            toolName: PropTypes.string.isRequired,
          }).isRequired,
          type: PropTypes.oneOf(['dynamic-tool']).isRequired,
        }),
        PropTypes.shape({
          toolInvocation: PropTypes.shape({
            approval: PropTypes.object,
            approvalId: PropTypes.string,
            callProviderMetadata: PropTypes.object,
            errorText: PropTypes.string,
            input: PropTypes.any,
            output: PropTypes.any,
            preliminary: PropTypes.bool,
            providerExecuted: PropTypes.bool,
            state: PropTypes.oneOf([
              'approval-requested',
              'approval-responded',
              'input-available',
              'input-streaming',
              'output-available',
              'output-denied',
              'output-error',
            ]).isRequired,
            title: PropTypes.string,
            toolCallId: PropTypes.string.isRequired,
            toolName: PropTypes.string.isRequired,
          }).isRequired,
          type: PropTypes.oneOf(['tool']).isRequired,
        }),
        PropTypes.shape({
          type: PropTypes.oneOf(['step-start']).isRequired,
        }),
      ]).isRequired,
    ).isRequired,
    role: PropTypes.oneOf(['assistant', 'system', 'user']).isRequired,
    status: PropTypes.oneOf([
      'cancelled',
      'error',
      'pending',
      'read',
      'sending',
      'sent',
      'streaming',
    ]),
    updatedAt: PropTypes.string,
  }),
  /**
   * Row contract shared with the divider slots: when `index`/`items` are
   * provided, the indicator self-suppresses on every row except the last one.
   */
  messageId: PropTypes.string,
  /**
   * Controls when the indicator renders.
   * - `'auto'` – shown only in assistant-backed conversations (auto-detected).
   * - `true` – always shown while a response is in flight.
   * - `false` – never shown.
   * @default 'auto'
   */
  mode: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.bool]),
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatStreamingIndicator };
