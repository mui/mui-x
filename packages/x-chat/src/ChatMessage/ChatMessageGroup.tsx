'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { MessageGroup, type MessageGroupProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';
import {
  ChatMessage,
  type ChatMessageProps,
  type ChatMessageSlots,
  type ChatMessageSlotProps,
} from './ChatMessage';

const useThemeProps = createUseThemeProps('MuiChatMessageGroup');

export interface ChatMessageGroupSlots extends Partial<ChatMessageSlots> {
  /** Override the inner ChatMessage component used for the single message in this group. */
  message: React.ElementType;
}

export interface ChatMessageGroupSlotProps extends ChatMessageSlotProps {
  message?: Partial<ChatMessageProps>;
}

export interface ChatMessageGroupProps extends Omit<MessageGroupProps, 'slots' | 'slotProps'> {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageClasses>;
  slots?: Partial<ChatMessageGroupSlots>;
  slotProps?: ChatMessageGroupSlotProps;
}

const ChatMessageGroupStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Group',
  overridesResolver: (_, styles) => styles.group,
})<{
  ownerState?: {
    variant?: string;
    isFirst?: boolean;
    isFirstInList?: boolean;
    density?: string;
  };
}>(({ theme, ownerState }) => {
  const densityMarginBlockStart: Record<string, string> = {
    compact: theme.spacing(0.25),
    standard: theme.spacing(1),
    comfortable: theme.spacing(2),
  };
  const marginBlockStart =
    ownerState?.isFirst && !ownerState?.isFirstInList
      ? densityMarginBlockStart[ownerState?.density ?? 'standard']
      : 0;

  return {
    '--MuiChatMessage-avatarSize': ownerState?.variant === 'compact' ? '28px' : '36px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    width: '100%',
    marginBlockStart,
    // When the avatar slot is hidden, drop the reserved avatar size so any
    // descendant relying on the variable (padding, author-name offset) collapses too.
    '&.MuiChatMessage-noAvatar': {
      '--MuiChatMessage-avatarSize': '0px',
    },
  };
});

const ChatMessageGroupAuthorNameStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'GroupAuthorName',
})<{ ownerState?: { isOwnMessage?: boolean; variant?: string } }>(({ theme, ownerState }) => ({
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.secondary,
  marginBottom: 0,
  ...(ownerState?.variant === 'compact'
    ? {
        // Compact: author name lives inside the message grid in the "authorName" area.
        // It shares a row with the avatar. Flex to push timestamp to the right.
        gridArea: 'authorName',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing(1),
        lineHeight: 1,
        color: (theme.vars || theme).palette.primary.main,
      }
    : {
        // Default: offset by avatar width; align to the same side as the bubble.
        ...(ownerState?.isOwnMessage
          ? {
              textAlign: 'right' as const,
              paddingInlineEnd: `calc(var(--MuiChatMessage-avatarSize) + ${theme.spacing(2)} + ${theme.spacing(0.5)})`,
            }
          : {
              paddingInlineStart: `calc(var(--MuiChatMessage-avatarSize) + ${theme.spacing(2)} + ${theme.spacing(0.5)})`,
            }),
      }),
}));

const ChatMessageGroupTimestampStyled = styled('span', {
  name: 'MuiChatMessage',
  slot: 'GroupTimestamp',
})(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightRegular,
  color: (theme.vars || theme).palette.text.disabled,
  whiteSpace: 'nowrap',
  flexShrink: 0,
}));

const ChatMessageGroup = React.forwardRef<HTMLDivElement, ChatMessageGroupProps>(
  function ChatMessageGroup(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessageGroup' });
    const {
      slots,
      slotProps,
      className,
      classes: classesProp,
      sx,
      children,
      messageId,
      ...other
    } = props;
    const classes = useChatMessageUtilityClasses(classesProp);

    // Slot-driven path: split the `message` slot from the inner-message slots.
    // The inner-message slots flow into the ChatMessage instance so consumers can
    // hide / replace avatar, content, meta, actions, etc. by passing them at the
    // ChatMessageGroup level (or all the way from ChatBox).
    const MessageSlot = (slots?.message ?? ChatMessage) as typeof ChatMessage;
    const innerSlots: Partial<ChatMessageSlots> = {
      avatar: slots?.avatar,
      content: slots?.content,
      meta: slots?.meta,
      inlineMeta: slots?.inlineMeta,
      error: slots?.error,
      actions: slots?.actions,
      root: slots?.root,
    };
    const innerSlotProps: ChatMessageSlotProps = {
      avatar: slotProps?.avatar,
      content: slotProps?.content,
      meta: slotProps?.meta,
      inlineMeta: slotProps?.inlineMeta,
      error: slotProps?.error,
      actions: slotProps?.actions,
      root: slotProps?.root,
    };

    // Track whether the avatar slot is explicitly nulled — used to mirror the
    // `noAvatar` class on the group wrapper so any descendant CSS that reads
    // `var(--MuiChatMessage-avatarSize)` can collapse the reserved space.
    const hasAvatar = slots?.avatar !== null;

    // Render priority:
    // 1. Explicit `children` (legacy: caller provided their own composition)
    // 2. `slots.message` (or default ChatMessage) with the inner slot map
    const resolvedChildren =
      children ??
      (messageId ? (
        <MessageSlot
          messageId={messageId}
          slots={innerSlots}
          slotProps={innerSlotProps}
          {...(slotProps?.message ?? {})}
        />
      ) : null);

    return (
      <MessageGroup
        ref={ref}
        messageId={messageId}
        {...other}
        slots={{
          group: ChatMessageGroupStyled,
          authorName: ChatMessageGroupAuthorNameStyled,
          groupTimestamp: ChatMessageGroupTimestampStyled,
        }}
        slotProps={{
          group: {
            className: clsx(classes.group, !hasAvatar && classes.noAvatar, className),
            sx,
          } as any,
        }}
      >
        {resolvedChildren}
      </MessageGroup>
    );
  },
);

ChatMessageGroup.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * A function that maps a message to a group key.
   * Messages that resolve to the same key are visually grouped (shared avatar, author name, etc.).
   * Use `createTimeWindowGroupKey(windowMs)` to replicate time-window-based grouping.
   * @default (message) => message.author?.id ?? message.role ?? ''
   */
  groupKey: PropTypes.func,
  index: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.string),
  messageId: PropTypes.string.isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatMessageGroup };
