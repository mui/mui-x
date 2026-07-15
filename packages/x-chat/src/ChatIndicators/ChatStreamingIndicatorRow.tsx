'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import {
  MessageContextProvider,
  chatSelectors,
  useChatDensity,
  useChatStore,
  useChatVariant,
  useStreamingIndicatorVisibility,
  type ChatMessage,
  type MessageOwnerState,
  type StreamingIndicatorMode,
} from '@mui/x-chat-headless';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import { styled } from '../internals/zero-styled';
import { ChatMessageAvatar } from '../ChatMessage/ChatMessageAvatar';
import { ChatStreamingIndicator, type ChatStreamingIndicatorProps } from './ChatStreamingIndicator';
import { useChatStreamingIndicatorUtilityClasses } from './chatStreamingIndicatorClasses';

export interface ChatStreamingIndicatorRowProps {
  /** Resolved `features.streamingIndicator` mode forwarded to the dots. */
  mode?: StreamingIndicatorMode;
  /** Row contract shared with the divider slots. */
  messageId: string;
  index?: number;
  items?: string[];
  /** Whether the `messageAvatar` slot is enabled for the surrounding list. */
  hasAvatar?: boolean;
  /** Consumer `slotProps.streamingIndicator`, forwarded to the dots. */
  slotProps?: Partial<ChatStreamingIndicatorProps>;
}

const PLACEHOLDER_MESSAGE_ID = 'streaming-indicator-placeholder';

// Minimal synthetic assistant message: `ChatMessageAvatar` reads the
// `MessageContext` and renders only when a message is in scope.
const placeholderMessage: ChatMessage = {
  id: PLACEHOLDER_MESSAGE_ID,
  role: 'assistant',
  parts: [],
};

const densityRowSpacing: Record<string, [start: number, end: number]> = {
  compact: [0.25, 0.25],
  standard: [1, 1],
  comfortable: [2, 2],
};

// Mirrors the non-own, non-grouped `ChatMessageStyled` grid (avatar track +
// content lane) so the typing bubble lines up exactly where the incoming
// assistant bubble will appear.
const ChatStreamingIndicatorRowStyled = styled('div', {
  name: 'MuiChatStreamingIndicator',
  slot: 'Row',
  overridesResolver: (_, styles) => styles.row,
  shouldForwardProp: (prop) => prop !== 'ownerState',
})<{
  ownerState?: { variant?: string; density?: string; hasAvatar?: boolean };
}>(({ theme, ownerState }) => {
  const isCompact = ownerState?.variant === 'compact';
  const [marginStart, paddingEnd] = densityRowSpacing[ownerState?.density ?? 'standard'];
  let avatarSize = isCompact ? '28px' : '36px';
  if (ownerState?.hasAvatar === false) {
    avatarSize = '0px';
  }

  return {
    '--MuiChatMessage-avatarSize': avatarSize,
    display: 'grid',
    gridTemplateColumns: isCompact ? 'var(--MuiChatMessage-avatarSize) 1fr' : 'auto 1fr',
    gridTemplateAreas: '"avatar content"',
    columnGap: theme.spacing(isCompact ? 1 : 0.5),
    width: '100%',
    boxSizing: 'border-box',
    paddingInline: theme.spacing(2),
    // Phantom column: reserve the avatar width on the opposite side, like
    // real message rows, so the content lane width matches the bubbles above.
    paddingInlineEnd: `calc(${theme.spacing(2)} + var(--MuiChatMessage-avatarSize))`,
    marginBlockStart: theme.spacing(marginStart),
    paddingBlockEnd: theme.spacing(paddingEnd),
    fontFamily: theme.typography.fontFamily,
  };
});

const ChatStreamingIndicatorBubbleStyled = styled('div', {
  name: 'MuiChatStreamingIndicator',
  slot: 'Bubble',
  overridesResolver: (_, styles) => styles.bubble,
  shouldForwardProp: (prop) => prop !== 'ownerState',
})<{ ownerState?: { variant?: string } }>(({ theme, ownerState }) => ({
  gridArea: 'content',
  justifySelf: 'start',
  display: 'flex',
  alignItems: 'center',
  // The dots' own top margin is for in-bubble (after streamed text) placement;
  // here the bubble padding provides the spacing.
  '& .MuiChatStreamingIndicator-root': {
    marginTop: 0,
  },
  // Compact messages render without bubble chrome — match that.
  ...(ownerState?.variant !== 'compact' && {
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: (theme.vars || theme).palette.grey[100],
    ...theme.applyStyles('dark', {
      backgroundColor: (theme.vars || theme).palette.grey[800],
    }),
  }),
}));

/**
 * Waiting-phase presentation of the streaming indicator: an incoming assistant
 * row (avatar + typing bubble with the animated dots) rendered after the last
 * message while the response is in flight and no assistant message exists yet.
 */
function ChatStreamingIndicatorRow(props: ChatStreamingIndicatorRowProps) {
  const { mode = 'auto', messageId, index, items, hasAvatar = true, slotProps } = props;
  const variant = useChatVariant();
  const density = useChatDensity();
  const store = useChatStore();
  // Reactive read so participants that load after mount still resolve the
  // assistant avatar (`store.assistantUser` reads the active conversation).
  useStore(store, chatSelectors.activeConversation);
  const assistantUser = store.assistantUser;
  const { waiting } = useStreamingIndicatorVisibility(mode);
  const classes = useChatStreamingIndicatorUtilityClasses(undefined);

  const showAvatar = hasAvatar && assistantUser?.avatarUrl != null;
  const messageContextValue = React.useMemo<MessageOwnerState>(
    () => ({
      messageId: PLACEHOLDER_MESSAGE_ID,
      message: placeholderMessage,
      role: 'assistant',
      status: 'streaming',
      streaming: true,
      error: false,
      isGrouped: false,
      variant,
      density,
      resolvedAuthor: assistantUser
        ? {
            id: assistantUser.id,
            displayName: assistantUser.displayName,
            avatarUrl: assistantUser.avatarUrl,
            isOwnMessage: false,
          }
        : null,
      showAvatar,
      isOwnMessage: false,
    }),
    [assistantUser, density, showAvatar, variant],
  );

  // Trailing-row contract shared with the headless `StreamingIndicator`.
  if (items != null && index != null && index !== items.length - 1) {
    return null;
  }

  if (!waiting) {
    return null;
  }

  return (
    <ChatStreamingIndicatorRowStyled
      className={classes.row}
      ownerState={{ variant, density, hasAvatar }}
      aria-hidden
    >
      {showAvatar && (
        <MessageContextProvider value={messageContextValue}>
          <ChatMessageAvatar />
        </MessageContextProvider>
      )}
      <ChatStreamingIndicatorBubbleStyled className={classes.bubble} ownerState={{ variant }}>
        <ChatStreamingIndicator
          mode={mode}
          message={null}
          messageId={messageId}
          index={index}
          items={items}
          {...resolveComponentProps(slotProps ?? {}, { messageId, index, items })}
        />
      </ChatStreamingIndicatorBubbleStyled>
    </ChatStreamingIndicatorRowStyled>
  );
}

export { ChatStreamingIndicatorRow };
