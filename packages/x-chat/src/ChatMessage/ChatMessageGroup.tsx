'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { MessageGroup, type MessageGroupProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';
import { ChatMessage, type ChatMessageSlots, type ChatMessageSlotProps } from './ChatMessage';
import type { ChatBoxSlots, ChatBoxSlotProps } from '../ChatBox/ChatBox.types';

const useThemeProps = createUseThemeProps('MuiChatMessageGroup');

/**
 * Flat slot keys for `ChatMessageGroup` — part of the message-rendering pipeline
 * vocabulary. `messageGroup` is the styled group wrapper (wrapper-only); the
 * `message*` keys are mapped onto the inner `ChatMessage`'s short local slots.
 * A subset of the public `ChatBoxSlots`.
 */
type ChatMessageGroupSlotKeys =
  | 'messageGroup'
  | 'messageRoot'
  | 'messageAvatar'
  | 'messageContent'
  | 'messageMeta'
  | 'messageInlineMeta'
  | 'messageError'
  | 'messageActions'
  | 'messageAuthorName';

export interface ChatMessageGroupSlots extends Pick<ChatBoxSlots, ChatMessageGroupSlotKeys> {}

export interface ChatMessageGroupSlotProps extends Pick<
  ChatBoxSlotProps,
  ChatMessageGroupSlotKeys
> {}

export interface ChatMessageGroupProps extends Omit<MessageGroupProps, 'slots' | 'slotProps'> {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageClasses>;
  slots?: ChatMessageGroupSlots;
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
        gridArea: 'authorName',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing(1),
        lineHeight: 1,
        color: (theme.vars || theme).palette.primary.main,
      }
    : {
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

function HiddenAuthorName() {
  return null;
}

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

    // Map the flat `message*` keys onto the inner `ChatMessage`'s short local
    // slots. `messageRoot` swaps ChatMessage's own styled root — it is applied by
    // ChatMessage (not hoisted to the row component), so a raw element (e.g.
    // `'section'`) never receives `messageId`/`slots` it can't read.
    const innerMessageSlots: Partial<ChatMessageSlots> = {
      root: slots?.messageRoot,
      avatar: slots?.messageAvatar,
      content: slots?.messageContent,
      meta: slots?.messageMeta,
      inlineMeta: slots?.messageInlineMeta,
      error: slots?.messageError,
      actions: slots?.messageActions,
      authorName: slots?.messageAuthorName,
    };
    const innerMessageSlotProps: ChatMessageSlotProps = {
      root: slotProps?.messageRoot,
      avatar: slotProps?.messageAvatar,
      content: slotProps?.messageContent,
      meta: slotProps?.messageMeta,
      inlineMeta: slotProps?.messageInlineMeta,
      error: slotProps?.messageError,
      actions: slotProps?.messageActions,
      authorName: slotProps?.messageAuthorName,
    };

    // Track whether the avatar slot is explicitly nulled — used to mirror the
    // `noAvatar` class on the group wrapper so any descendant CSS that reads
    // `var(--MuiChatMessage-avatarSize)` can collapse the reserved space.
    const hasAvatar = slots?.messageAvatar !== null;

    // `authorName` is rendered by the headless MessageGroup (group-level), but
    // consumer-facing it lives under the flat `messageAuthorName` key so all
    // per-row overrides cluster in one namespace. Null hides the label entirely.
    const authorNameOverride = slots?.messageAuthorName;
    const AuthorNameSlot =
      authorNameOverride === null
        ? (HiddenAuthorName as React.ElementType)
        : ((authorNameOverride ?? ChatMessageGroupAuthorNameStyled) as React.ElementType);

    // Render priority:
    // 1. Explicit `children` (legacy: caller provided their own composition)
    // 2. Inner ChatMessage instance with the mapped short slot map.
    const resolvedChildren =
      children ??
      (messageId ? (
        <ChatMessage
          messageId={messageId}
          slots={innerMessageSlots}
          slotProps={innerMessageSlotProps}
        />
      ) : null);

    return (
      <MessageGroup
        ref={ref}
        messageId={messageId}
        {...other}
        slots={{
          group: (slots?.messageGroup ?? ChatMessageGroupStyled) as React.ElementType,
          authorName: AuthorNameSlot,
          groupTimestamp: ChatMessageGroupTimestampStyled,
        }}
        slotProps={{
          group: {
            className: clsx(classes.group, !hasAvatar && classes.noAvatar, className),
            sx,
            ...(slotProps?.messageGroup ?? {}),
          } as any,
          authorName: slotProps?.messageAuthorName as any,
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
