'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import {
  MessageGroup,
  type MessageGroupProps,
  useChatVariant,
  useMessage,
} from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';
import { ChatMessage } from './ChatMessage';
import { ChatMessageAvatar } from './ChatMessageAvatar';
import { ChatMessageContent } from './ChatMessageContent';
import { ChatMessageMeta } from './ChatMessageMeta';
import { ChatMessageInlineMeta } from './ChatMessageInlineMeta';

const useThemeProps = createUseThemeProps('MuiChatMessage');

export interface ChatMessageGroupProps extends MessageGroupProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageClasses>;
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
  };
});

const ChatMessageGroupAuthorNameStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'GroupAuthorName',
})<{ ownerState?: { authorRole?: string; variant?: string } }>(({ theme, ownerState }) => ({
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
        // Default: offset by avatar width, user right-aligned
        ...(ownerState?.authorRole === 'user'
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

/**
 * Default content rendered inside ChatMessageGroup when no children are provided.
 * Uses the variant-aware styled components (avatar, content bubble, meta).
 */
function ChatMessageGroupDefaultContent({ messageId }: { messageId: string }) {
  const variant = useChatVariant();
  const isCompact = variant === 'compact';
  const message = useMessage(messageId);
  const isStreaming = message?.status === 'streaming';
  const hasMeta =
    Boolean(message?.createdAt) || Boolean(message?.editedAt) || Boolean(message?.status);
  // In the default variant, meta is rendered inline inside the bubble.
  // Skip it during streaming — there is no timestamp yet, and the streaming state
  // is already communicated via the MuiChatMessage-streaming CSS class.
  const afterContent =
    !isCompact && !isStreaming && hasMeta ? <ChatMessageInlineMeta /> : undefined;

  return (
    <React.Fragment>
      <ChatMessageAvatar />
      <ChatMessageContent afterContent={afterContent} />
      {isCompact && <ChatMessageMeta />}
    </React.Fragment>
  );
}

const ChatMessageGroup = React.forwardRef<HTMLDivElement, ChatMessageGroupProps>(
  function ChatMessageGroup(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessage' });
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

    // When no children are provided, render the default styled message layout.
    // This ensures ChatMessageGroup works as a standalone component with proper
    // styling for both default and compact variants.
    const resolvedChildren =
      children ??
      (messageId ? (
        <ChatMessage messageId={messageId}>
          <ChatMessageGroupDefaultContent messageId={messageId} />
        </ChatMessage>
      ) : null);

    return (
      <MessageGroup
        ref={ref}
        messageId={messageId}
        {...other}
        slots={{
          group: slots?.group ?? ChatMessageGroupStyled,
          authorName: slots?.authorName ?? ChatMessageGroupAuthorNameStyled,
          groupTimestamp: slots?.groupTimestamp ?? ChatMessageGroupTimestampStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          group: {
            className: clsx(classes.group, className),
            sx,
            ...(slotProps?.group as object),
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
   * @default (message) => message.author?.id ?? message.role
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
