'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import type { SlotComponentProps } from '@mui/utils/types';
import useSlotProps from '@mui/utils/useSlotProps';
import {
  useChat,
  useChatStatus,
  useMessage,
  useMessageIds,
  type ChatMessage as ChatMessageModel,
} from '@mui/x-chat-headless';
import { ChatLayout, ChatRoot, type ChatRootProps } from '@mui/x-chat-unstyled';
import { useChatLocaleText } from '@mui/x-chat-unstyled/chat';
import {
  ChatConversationInput,
  type ChatConversationInputProps,
  type ChatConversationInputSlotProps as StyledChatConversationInputSlotProps,
  type ChatConversationInputSlots as StyledChatConversationInputSlots,
} from '../ChatConversationInput';
import {
  ChatConversations,
  type ChatConversationsProps,
  type ChatConversationsSlotProps as StyledChatConversationsSlotProps,
  type ChatConversationsSlots as StyledChatConversationsSlots,
} from '../ChatConversations';
import {
  ChatScrollToBottomAffordance,
  ChatTypingIndicator,
  ChatUnreadMarker,
  type ChatScrollToBottomAffordanceSlotProps,
  type ChatScrollToBottomAffordanceSlots,
  type ChatTypingIndicatorSlotProps,
  type ChatTypingIndicatorSlots,
  type ChatUnreadMarkerSlotProps,
  type ChatUnreadMarkerSlots,
} from '../ChatIndicators';
import {
  ChatDateDivider,
  ChatMessage as StyledChatMessage,
  type ChatDateDividerSlotProps,
  type ChatDateDividerSlots,
  type ChatMessageActionsSlotProps,
  type ChatMessageActionsSlots,
  type ChatMessageAvatarSlotProps,
  type ChatMessageAvatarSlots,
  type ChatMessageContentSlotProps,
  type ChatMessageContentSlots,
  type ChatMessageGroupSlotProps,
  type ChatMessageGroupSlots,
  type ChatMessageMetaSlotProps,
  type ChatMessageMetaSlots,
  type ChatMessageRootSlotProps,
  type ChatMessageRootSlots,
} from '../ChatMessage';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { chatCssVarKeys, getChatCssVars } from '../internals/material/chatThemeVars';
import {
  ChatConversation,
  type ChatConversationProps,
  type ChatConversationSlotProps as StyledChatConversationSlotProps,
  type ChatConversationSlots as StyledChatConversationSlots,
} from '../ChatConversation';
import { chatMessageClasses } from '../ChatMessage/chatMessageClasses';
import { getCopyableText, joinClassNames } from '../internals/utils';
import { chatBoxClasses } from './chatBoxClasses';

function parseTimestamp(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);

  return Number.isNaN(parsed) ? null : parsed;
}

function getAuthorIdentity(message: ChatMessageModel | null) {
  if (!message) {
    return null;
  }

  return {
    id: message.author?.id,
    role: message.role,
  };
}

function areMessagesGrouped(
  left: ChatMessageModel | null,
  right: ChatMessageModel | null,
  groupingWindowMs: number,
) {
  if (!left || !right) {
    return false;
  }

  const leftAuthor = getAuthorIdentity(left);
  const rightAuthor = getAuthorIdentity(right);

  if (!leftAuthor || !rightAuthor) {
    return false;
  }

  const sameAuthor =
    leftAuthor.id && rightAuthor.id
      ? leftAuthor.id === rightAuthor.id
      : leftAuthor.role === rightAuthor.role;

  if (!sameAuthor) {
    return false;
  }

  const leftTimestamp = parseTimestamp(left.createdAt);
  const rightTimestamp = parseTimestamp(right.createdAt);

  if (leftTimestamp == null || rightTimestamp == null) {
    return true;
  }

  return Math.abs(rightTimestamp - leftTimestamp) <= groupingWindowMs;
}

function getAuthorLabel(message: ChatMessageModel | null) {
  if (!message) {
    return null;
  }

  return message.author?.displayName ?? message.author?.id ?? message.role;
}

function hasConversationSource<Cursor>(
  props: Pick<ChatBoxProps<Cursor>, 'adapter' | 'conversations' | 'defaultConversations'>,
) {
  return (
    props.conversations != null ||
    props.defaultConversations != null ||
    props.adapter?.listConversations != null
  );
}

interface ChatBoxMessageGroupOwnerState {
  isFirst: boolean;
  isLast: boolean;
  authorRole?: ChatMessageModel['role'];
  authorId?: string;
}

export interface ChatBoxOwnerState {
  hasBlockingError: boolean;
  isBootstrapping: boolean;
}

export interface ChatBoxStateOwnerState extends ChatBoxOwnerState {
  errorMessage?: string;
  state: 'loading' | 'error';
}

export interface ChatBoxSlots {
  root: React.ElementType;
  conversationsPane: React.ElementType;
  threadPane: React.ElementType;
  conversations: React.ElementType;
  conversationsRoot: StyledChatConversationsSlots['root'];
  conversationItem: StyledChatConversationsSlots['item'];
  conversationItemAvatar: StyledChatConversationsSlots['itemAvatar'];
  conversationTitle: StyledChatConversationsSlots['title'];
  conversationPreview: StyledChatConversationsSlots['preview'];
  conversationTimestamp: StyledChatConversationsSlots['timestamp'];
  conversationUnreadBadge: StyledChatConversationsSlots['unreadBadge'];
  conversationsLoadingState: StyledChatConversationsSlots['loadingState'];
  conversationsEmptyState: StyledChatConversationsSlots['emptyState'];
  conversationsErrorState: StyledChatConversationsSlots['errorState'];
  thread: React.ElementType;
  threadRoot: StyledChatConversationSlots['root'];
  threadHeader: StyledChatConversationSlots['header'];
  threadTitle: StyledChatConversationSlots['title'];
  threadSubtitle: StyledChatConversationSlots['subtitle'];
  threadActions: StyledChatConversationSlots['actions'];
  threadLoadingState: StyledChatConversationSlots['loadingState'];
  threadEmptyState: StyledChatConversationSlots['emptyState'];
  threadErrorState: StyledChatConversationSlots['errorState'];
  historyLoading: StyledChatConversationSlots['historyLoading'];
  historyError: StyledChatConversationSlots['historyError'];
  messageList: StyledChatConversationSlots['messageList'];
  messageListScroller: StyledChatConversationSlots['messageListScroller'];
  messageListContent: StyledChatConversationSlots['messageListContent'];
  messageListOverlay: StyledChatConversationSlots['messageListOverlay'];
  messageGroup: ChatMessageGroupSlots['group'];
  messageAuthorName: ChatMessageGroupSlots['authorName'];
  messageRoot: ChatMessageRootSlots['root'];
  messageAvatar: ChatMessageAvatarSlots['avatar'];
  messageContent: ChatMessageContentSlots['content'];
  messageBubble: ChatMessageContentSlots['bubble'];
  messageMeta: ChatMessageMetaSlots['meta'];
  messageTimestamp: ChatMessageMetaSlots['timestamp'];
  messageStatus: ChatMessageMetaSlots['status'];
  messageEdited: ChatMessageMetaSlots['edited'];
  messageActions: ChatMessageActionsSlots['actions'];
  dateDivider: ChatDateDividerSlots['divider'];
  dateDividerLabel: ChatDateDividerSlots['label'];
  dateDividerLine: ChatDateDividerSlots['line'];
  unreadMarker: ChatUnreadMarkerSlots['root'];
  unreadMarkerLabel: ChatUnreadMarkerSlots['label'];
  typingIndicator: ChatTypingIndicatorSlots['root'];
  scrollToBottomAffordance: ChatScrollToBottomAffordanceSlots['root'];
  scrollToBottomBadge: ChatScrollToBottomAffordanceSlots['badge'];
  composer: React.ElementType;
  composerRoot: StyledChatConversationInputSlots['root'];
  composerInput: StyledChatConversationInputSlots['input'];
  composerSendButton: StyledChatConversationInputSlots['sendButton'];
  composerAttachButton: StyledChatConversationInputSlots['attachButton'];
  composerAttachInput: StyledChatConversationInputSlots['attachInput'];
  composerToolbar: StyledChatConversationInputSlots['toolbar'];
  composerHelperText: StyledChatConversationInputSlots['helperText'];
  loadingState: React.ElementType;
  errorState: React.ElementType;
}

export interface ChatBoxSlotProps {
  root?: SlotComponentProps<'div', {}, ChatBoxOwnerState>;
  conversationsPane?: SlotComponentProps<'div', {}, ChatBoxOwnerState>;
  threadPane?: SlotComponentProps<'div', {}, ChatBoxOwnerState>;
  conversations?: Partial<ChatConversationsProps>;
  conversationsRoot?: StyledChatConversationsSlotProps['root'];
  conversationItem?: StyledChatConversationsSlotProps['item'];
  conversationItemAvatar?: StyledChatConversationsSlotProps['itemAvatar'];
  conversationTitle?: StyledChatConversationsSlotProps['title'];
  conversationPreview?: StyledChatConversationsSlotProps['preview'];
  conversationTimestamp?: StyledChatConversationsSlotProps['timestamp'];
  conversationUnreadBadge?: StyledChatConversationsSlotProps['unreadBadge'];
  conversationsLoadingState?: StyledChatConversationsSlotProps['loadingState'];
  conversationsEmptyState?: StyledChatConversationsSlotProps['emptyState'];
  conversationsErrorState?: StyledChatConversationsSlotProps['errorState'];
  thread?: Partial<ChatConversationProps>;
  threadRoot?: StyledChatConversationSlotProps['root'];
  threadHeader?: StyledChatConversationSlotProps['header'];
  threadTitle?: StyledChatConversationSlotProps['title'];
  threadSubtitle?: StyledChatConversationSlotProps['subtitle'];
  threadActions?: StyledChatConversationSlotProps['actions'];
  threadLoadingState?: StyledChatConversationSlotProps['loadingState'];
  threadEmptyState?: StyledChatConversationSlotProps['emptyState'];
  threadErrorState?: StyledChatConversationSlotProps['errorState'];
  historyLoading?: StyledChatConversationSlotProps['historyLoading'];
  historyError?: StyledChatConversationSlotProps['historyError'];
  messageList?: StyledChatConversationSlotProps['messageList'];
  messageListScroller?: StyledChatConversationSlotProps['messageListScroller'];
  messageListContent?: StyledChatConversationSlotProps['messageListContent'];
  messageListOverlay?: StyledChatConversationSlotProps['messageListOverlay'];
  messageGroup?: ChatMessageGroupSlotProps['group'];
  messageAuthorName?: ChatMessageGroupSlotProps['authorName'];
  messageRoot?: ChatMessageRootSlotProps['root'];
  messageAvatar?: ChatMessageAvatarSlotProps['avatar'];
  messageContent?: ChatMessageContentSlotProps['content'];
  messageBubble?: ChatMessageContentSlotProps['bubble'];
  messageMeta?: ChatMessageMetaSlotProps['meta'];
  messageTimestamp?: ChatMessageMetaSlotProps['timestamp'];
  messageStatus?: ChatMessageMetaSlotProps['status'];
  messageEdited?: ChatMessageMetaSlotProps['edited'];
  messageActions?: ChatMessageActionsSlotProps['actions'];
  dateDivider?: ChatDateDividerSlotProps['divider'];
  dateDividerLabel?: ChatDateDividerSlotProps['label'];
  dateDividerLine?: ChatDateDividerSlotProps['line'];
  unreadMarker?: ChatUnreadMarkerSlotProps['root'];
  unreadMarkerLabel?: ChatUnreadMarkerSlotProps['label'];
  typingIndicator?: ChatTypingIndicatorSlotProps['root'];
  scrollToBottomAffordance?: ChatScrollToBottomAffordanceSlotProps['root'];
  scrollToBottomBadge?: ChatScrollToBottomAffordanceSlotProps['badge'];
  composer?: Partial<ChatConversationInputProps>;
  composerRoot?: StyledChatConversationInputSlotProps['root'];
  composerInput?: StyledChatConversationInputSlotProps['input'];
  composerSendButton?: StyledChatConversationInputSlotProps['sendButton'];
  composerAttachButton?: StyledChatConversationInputSlotProps['attachButton'];
  composerAttachInput?: StyledChatConversationInputSlotProps['attachInput'];
  composerToolbar?: StyledChatConversationInputSlotProps['toolbar'];
  composerHelperText?: StyledChatConversationInputSlotProps['helperText'];
  loadingState?: SlotComponentProps<'div', {}, ChatBoxStateOwnerState>;
  errorState?: SlotComponentProps<'div', {}, ChatBoxStateOwnerState>;
}

export interface ChatBoxProps<Cursor = string> extends Omit<
  ChatRootProps<Cursor>,
  'children' | 'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatBoxSlotProps;
  slots?: Partial<ChatBoxSlots>;
  sx?: SxProps<Theme>;
}

const ChatBoxRootSlot = styled('div', {
  name: 'MuiChatBox',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  ...getChatCssVars(theme),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
}));

const ChatBoxLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  minHeight: 0,
  minWidth: 0,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const ChatBoxConversationsPane = styled('div')(({ theme }) => ({
  borderInlineEnd: `1px solid var(${chatCssVarKeys.composerBorder})`,
  display: 'flex',
  flex: '0 0 320px',
  minHeight: 0,
  minWidth: 280,
  [theme.breakpoints.down('sm')]: {
    borderBottom: `1px solid var(${chatCssVarKeys.composerBorder})`,
    borderInlineEnd: 0,
    flexBasis: 'auto',
    minWidth: 0,
  },
}));

const ChatBoxThreadPane = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  minHeight: 0,
  minWidth: 0,
  [`& .${chatBoxClasses.thread}`]: {
    flex: '1 1 auto',
    minHeight: 0,
  },
  [`& .${chatBoxClasses.composer}`]: {
    flex: '0 0 auto',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: theme.spacing(50),
  },
}));

const ChatBoxStateSlot = styled('div')(({ theme }) => ({
  alignItems: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  justifyContent: 'center',
  minHeight: theme.spacing(56),
  minWidth: 0,
  padding: theme.spacing(4),
  textAlign: 'center',
}));

const ChatBoxMessageGroupSlot = styled('div')<{ ownerState: ChatBoxMessageGroupOwnerState }>(({
  theme,
  ownerState,
}) => {
  const connectedRadius = Math.max((Number(theme.shape.borderRadius) || 0) - 2, 4);
  const isUser = ownerState.authorRole === 'user';
  const isSystem = ownerState.authorRole === 'system';

  let firstRadiusOverride = {};
  if (!ownerState.isFirst && !isSystem) {
    firstRadiusOverride = isUser
      ? { borderStartEndRadius: connectedRadius }
      : { borderStartStartRadius: connectedRadius };
  }

  let lastRadiusOverride = {};
  if (!ownerState.isLast && !isSystem) {
    lastRadiusOverride = isUser
      ? { borderEndEndRadius: connectedRadius }
      : { borderEndStartRadius: connectedRadius };
  }

  return {
    marginBlockStart: ownerState.isFirst ? theme.spacing(2) : theme.spacing(0.5),
    width: '100%',
    ...(isSystem
      ? {}
      : {
          [`& .${chatMessageClasses.bubble}`]: {
            ...firstRadiusOverride,
            ...lastRadiusOverride,
          },
        }),
  };
});

const ChatBoxMessageAuthorNameSlot = styled('div')<{ ownerState: ChatBoxMessageGroupOwnerState }>(
  ({ theme, ownerState }) => ({
    ...theme.typography.caption,
    color: theme.palette.text.secondary,
    marginBlockEnd: theme.spacing(0.5),
    textAlign: ownerState.authorRole === 'user' ? 'end' : 'start',
  }),
);

function createDefaultRootSlot(sx: ChatBoxProps['sx']) {
  return React.forwardRef(function DefaultRoot(
    props: React.HTMLAttributes<HTMLDivElement> & {
      ownerState?: ChatBoxOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatBoxRootSlot
        className={joinClassNames(chatBoxClasses.root, className)}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}

function createDefaultStateSlot() {
  return React.forwardRef(function DefaultState(
    props: React.HTMLAttributes<HTMLDivElement> & {
      ownerState?: ChatBoxStateOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { children, className, ownerState, ...other } = props;

    return (
      <ChatBoxStateSlot className={className} ref={ref} {...other}>
        {ownerState?.state === 'loading' ? <CircularProgress size={32} /> : null}
        {children}
      </ChatBoxStateSlot>
    );
  });
}

function ChatBoxDefaultThreadRow(props: {
  id: string;
  index: number;
  items?: string[];
  slotProps?: ChatBoxSlotProps;
  slots?: Partial<ChatBoxSlots>;
}) {
  const { id, index, items: itemsProp, slotProps, slots } = props;
  const chat = useChat();
  const localeText = useChatLocaleText();
  const defaultItems = useMessageIds();
  const items = itemsProp ?? defaultItems;
  const message = useMessage(id);
  const previousMessage = useMessage(index > 0 ? (items[index - 1] ?? '') : '');
  const nextMessage = useMessage(index < items.length - 1 ? (items[index + 1] ?? '') : '');
  const copyableText = React.useMemo(() => getCopyableText(message), [message]);
  const hasRetry = message?.role === 'user' && message.status === 'error';
  const hasActions = Boolean(copyableText) || hasRetry;
  let inlineErrorText: string | null = null;
  if (hasRetry && chat.error?.source === 'send') {
    inlineErrorText = chat.error.message;
  } else if (hasRetry) {
    inlineErrorText = localeText.genericErrorLabel;
  }
  const isFirst = !areMessagesGrouped(previousMessage, message, 300_000);
  const isLast = !areMessagesGrouped(message, nextMessage, 300_000);
  const groupOwnerState = React.useMemo<ChatBoxMessageGroupOwnerState>(
    () => ({
      isFirst,
      isLast,
      authorId: message?.author?.id,
      authorRole: message?.role,
    }),
    [isFirst, isLast, message?.author?.id, message?.role],
  );
  const Group = slots?.messageGroup ?? ChatBoxMessageGroupSlot;
  const AuthorName = slots?.messageAuthorName ?? ChatBoxMessageAuthorNameSlot;
  const groupProps = useSlotProps({
    elementType: Group,
    externalSlotProps: slotProps?.messageGroup,
    ownerState: groupOwnerState,
  });
  const authorNameProps = useSlotProps({
    elementType: AuthorName,
    externalSlotProps: slotProps?.messageAuthorName,
    ownerState: groupOwnerState,
  });
  const authorLabel = getAuthorLabel(message);

  const handleCopy = React.useCallback(async () => {
    if (!copyableText || !navigator.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(copyableText);
  }, [copyableText]);

  const handleRetry = React.useCallback(() => {
    chat.retry(id);
  }, [chat, id]);

  return (
    <React.Fragment>
      <ChatUnreadMarker
        index={index}
        items={items}
        messageId={id}
        slotProps={{
          label: slotProps?.unreadMarkerLabel,
          root: slotProps?.unreadMarker,
        }}
        slots={{
          label: slots?.unreadMarkerLabel,
          root: slots?.unreadMarker,
        }}
      />
      <ChatDateDivider
        index={index}
        items={items}
        messageId={id}
        slotProps={{
          divider: slotProps?.dateDivider,
          label: slotProps?.dateDividerLabel,
          line: slotProps?.dateDividerLine,
        }}
        slots={{
          divider: slots?.dateDivider,
          label: slots?.dateDividerLabel,
          line: slots?.dateDividerLine,
        }}
      />
      <Group {...groupProps}>
        {isFirst && authorLabel ? (
          <AuthorName {...authorNameProps}>{authorLabel}</AuthorName>
        ) : null}
        <StyledChatMessage.Root
          isGrouped={!isFirst}
          messageId={id}
          slotProps={{ root: slotProps?.messageRoot }}
          slots={{ root: slots?.messageRoot }}
        >
          <StyledChatMessage.Avatar
            slotProps={{ avatar: slotProps?.messageAvatar }}
            slots={{ avatar: slots?.messageAvatar }}
          />
          <StyledChatMessage.Content
            slotProps={{
              bubble: slotProps?.messageBubble,
              content: slotProps?.messageContent,
            }}
            slots={{
              bubble: slots?.messageBubble,
              content: slots?.messageContent,
            }}
          />
          <StyledChatMessage.Meta
            slotProps={{
              edited: slotProps?.messageEdited,
              meta: slotProps?.messageMeta,
              status: slotProps?.messageStatus,
              timestamp: slotProps?.messageTimestamp,
            }}
            slots={{
              edited: slots?.messageEdited,
              meta: slots?.messageMeta,
              status: slots?.messageStatus,
              timestamp: slots?.messageTimestamp,
            }}
          />
          {inlineErrorText ? (
            <div
              style={{
                alignItems: 'center',
                color: 'inherit',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginTop: 6,
              }}
            >
              <Typography color="error" variant="caption">
                {inlineErrorText}
              </Typography>
              <Button color="error" onClick={handleRetry} size="small" type="button">
                {localeText.retryButtonLabel}
              </Button>
            </div>
          ) : null}
          {hasActions ? (
            <StyledChatMessage.Actions
              slotProps={{ actions: slotProps?.messageActions }}
              slots={{ actions: slots?.messageActions }}
            >
              {copyableText ? (
                <Button onClick={handleCopy} size="small" type="button">
                  Copy
                </Button>
              ) : null}
              {hasRetry && !inlineErrorText ? (
                <Button color="error" onClick={handleRetry} size="small" type="button">
                  {localeText.retryButtonLabel}
                </Button>
              ) : null}
            </StyledChatMessage.Actions>
          ) : null}
        </StyledChatMessage.Root>
      </Group>
    </React.Fragment>
  );
}

function ChatBoxContent(props: {
  hasConversationsPane: boolean;
  slotProps?: ChatBoxSlotProps;
  slots?: Partial<ChatBoxSlots>;
}) {
  const { hasConversationsPane, slotProps, slots } = props;
  const localeText = useChatLocaleText();
  const chat = useChat();
  const status = useChatStatus();
  const LoadingState = slots?.loadingState ?? createDefaultStateSlot();
  const ErrorState = slots?.errorState ?? createDefaultStateSlot();
  const ConversationsComponent = slots?.conversations ?? ChatConversations;
  const ThreadComponent = slots?.thread ?? ChatConversation;
  const ComposerComponent = slots?.composer ?? ChatConversationInput;

  const hasLoadedContent =
    (hasConversationsPane && chat.conversations.length > 0) || chat.messages.length > 0;
  const isBootstrapping =
    !hasLoadedContent &&
    ((hasConversationsPane && status.isLoadingConversations) ||
      status.isLoadingMessages ||
      status.isRealtimeConnecting);

  const blockingError = !hasLoadedContent
    ? ((hasConversationsPane ? chat.conversationError : null) ??
      chat.messageError ??
      chat.realtimeError)
    : null;

  const ownerState: ChatBoxOwnerState = {
    hasBlockingError: Boolean(blockingError),
    isBootstrapping,
  };

  if (isBootstrapping) {
    const loadingOwnerState: ChatBoxStateOwnerState = {
      ...ownerState,
      state: 'loading',
    };
    const resolvedLoadingProps =
      resolveComponentProps(slotProps?.loadingState, loadingOwnerState) ?? {};

    return (
      <LoadingState
        {...resolvedLoadingProps}
        className={joinClassNames(
          chatBoxClasses.loadingState,
          (resolvedLoadingProps as { className?: string }).className,
        )}
        ownerState={loadingOwnerState}
      >
        <Typography color="text.primary" variant="body1">
          {localeText.loadingLabel}
        </Typography>
      </LoadingState>
    );
  }

  if (blockingError) {
    const errorOwnerState: ChatBoxStateOwnerState = {
      ...ownerState,
      errorMessage: blockingError.message,
      state: 'error',
    };
    const resolvedErrorProps = resolveComponentProps(slotProps?.errorState, errorOwnerState) ?? {};
    let handleRetry: () => void;
    if (chat.conversationError != null) {
      handleRetry = () => void chat.reloadConversations();
    } else if (chat.messageError != null) {
      handleRetry = () => void chat.reloadMessages(chat.activeConversationId);
    } else {
      handleRetry = () => void chat.reconnectRealtime();
    }

    return (
      <ErrorState
        {...resolvedErrorProps}
        className={joinClassNames(
          chatBoxClasses.errorState,
          (resolvedErrorProps as { className?: string }).className,
        )}
        ownerState={errorOwnerState}
      >
        <Typography color="text.primary" variant="body1">
          {blockingError.message || localeText.genericErrorLabel}
        </Typography>
        <Button onClick={handleRetry} type="button" variant="outlined">
          {chat.realtimeError != null
            ? localeText.reconnectButtonLabel
            : localeText.retryButtonLabel}
        </Button>
      </ErrorState>
    );
  }

  const conversationsProps = slotProps?.conversations ?? {};
  const threadProps = slotProps?.thread ?? {};
  const composerProps = slotProps?.composer ?? {};

  const mergedConversationsSlots = {
    ...conversationsProps.slots,
    emptyState: slots?.conversationsEmptyState ?? conversationsProps.slots?.emptyState,
    errorState: slots?.conversationsErrorState ?? conversationsProps.slots?.errorState,
    item: slots?.conversationItem ?? conversationsProps.slots?.item,
    itemAvatar: slots?.conversationItemAvatar ?? conversationsProps.slots?.itemAvatar,
    loadingState: slots?.conversationsLoadingState ?? conversationsProps.slots?.loadingState,
    preview: slots?.conversationPreview ?? conversationsProps.slots?.preview,
    root: slots?.conversationsRoot ?? conversationsProps.slots?.root,
    timestamp: slots?.conversationTimestamp ?? conversationsProps.slots?.timestamp,
    title: slots?.conversationTitle ?? conversationsProps.slots?.title,
    unreadBadge: slots?.conversationUnreadBadge ?? conversationsProps.slots?.unreadBadge,
  };

  const mergedConversationsSlotProps = {
    ...conversationsProps.slotProps,
    emptyState: slotProps?.conversationsEmptyState ?? conversationsProps.slotProps?.emptyState,
    errorState: slotProps?.conversationsErrorState ?? conversationsProps.slotProps?.errorState,
    item: slotProps?.conversationItem ?? conversationsProps.slotProps?.item,
    itemAvatar: slotProps?.conversationItemAvatar ?? conversationsProps.slotProps?.itemAvatar,
    loadingState:
      slotProps?.conversationsLoadingState ?? conversationsProps.slotProps?.loadingState,
    preview: slotProps?.conversationPreview ?? conversationsProps.slotProps?.preview,
    root: slotProps?.conversationsRoot ?? conversationsProps.slotProps?.root,
    timestamp: slotProps?.conversationTimestamp ?? conversationsProps.slotProps?.timestamp,
    title: slotProps?.conversationTitle ?? conversationsProps.slotProps?.title,
    unreadBadge: slotProps?.conversationUnreadBadge ?? conversationsProps.slotProps?.unreadBadge,
  };

  const defaultTypingIndicator =
    threadProps.typingIndicator !== undefined ? (
      threadProps.typingIndicator
    ) : (
      <ChatTypingIndicator
        slotProps={{ root: slotProps?.typingIndicator }}
        slots={{ root: slots?.typingIndicator }}
      />
    );

  const defaultScrollToBottomAffordance =
    threadProps.scrollToBottomAffordance !== undefined ? (
      threadProps.scrollToBottomAffordance
    ) : (
      <ChatScrollToBottomAffordance
        slotProps={{
          badge: slotProps?.scrollToBottomBadge,
          root: slotProps?.scrollToBottomAffordance,
        }}
        slots={{
          badge: slots?.scrollToBottomBadge,
          root: slots?.scrollToBottomAffordance,
        }}
      />
    );

  const defaultRenderItem =
    threadProps.renderItem ??
    (({ id, index }: { id: string; index: number }) => (
      <ChatBoxDefaultThreadRow
        id={id}
        index={index}
        items={threadProps.items}
        slotProps={slotProps}
        slots={slots}
      />
    ));

  const mergedThreadSlots = {
    ...threadProps.slots,
    actions: slots?.threadActions ?? threadProps.slots?.actions,
    emptyState: slots?.threadEmptyState ?? threadProps.slots?.emptyState,
    errorState: slots?.threadErrorState ?? threadProps.slots?.errorState,
    header: slots?.threadHeader ?? threadProps.slots?.header,
    historyError: slots?.historyError ?? threadProps.slots?.historyError,
    historyLoading: slots?.historyLoading ?? threadProps.slots?.historyLoading,
    loadingState: slots?.threadLoadingState ?? threadProps.slots?.loadingState,
    messageList: slots?.messageList ?? threadProps.slots?.messageList,
    messageListContent: slots?.messageListContent ?? threadProps.slots?.messageListContent,
    messageListOverlay: slots?.messageListOverlay ?? threadProps.slots?.messageListOverlay,
    messageListScroller: slots?.messageListScroller ?? threadProps.slots?.messageListScroller,
    root: slots?.threadRoot ?? threadProps.slots?.root,
    subtitle: slots?.threadSubtitle ?? threadProps.slots?.subtitle,
    title: slots?.threadTitle ?? threadProps.slots?.title,
  };

  const mergedThreadSlotProps = {
    ...threadProps.slotProps,
    actions: slotProps?.threadActions ?? threadProps.slotProps?.actions,
    emptyState: slotProps?.threadEmptyState ?? threadProps.slotProps?.emptyState,
    errorState: slotProps?.threadErrorState ?? threadProps.slotProps?.errorState,
    header: slotProps?.threadHeader ?? threadProps.slotProps?.header,
    historyError: slotProps?.historyError ?? threadProps.slotProps?.historyError,
    historyLoading: slotProps?.historyLoading ?? threadProps.slotProps?.historyLoading,
    loadingState: slotProps?.threadLoadingState ?? threadProps.slotProps?.loadingState,
    messageList: slotProps?.messageList ?? threadProps.slotProps?.messageList,
    messageListContent: slotProps?.messageListContent ?? threadProps.slotProps?.messageListContent,
    messageListOverlay: slotProps?.messageListOverlay ?? threadProps.slotProps?.messageListOverlay,
    messageListScroller:
      slotProps?.messageListScroller ?? threadProps.slotProps?.messageListScroller,
    root: slotProps?.threadRoot ?? threadProps.slotProps?.root,
    subtitle: slotProps?.threadSubtitle ?? threadProps.slotProps?.subtitle,
    title: slotProps?.threadTitle ?? threadProps.slotProps?.title,
  };

  const mergedComposerSlots = {
    ...composerProps.slots,
    attachButton: slots?.composerAttachButton ?? composerProps.slots?.attachButton,
    attachInput: slots?.composerAttachInput ?? composerProps.slots?.attachInput,
    helperText: slots?.composerHelperText ?? composerProps.slots?.helperText,
    input: slots?.composerInput ?? composerProps.slots?.input,
    root: slots?.composerRoot ?? composerProps.slots?.root,
    sendButton: slots?.composerSendButton ?? composerProps.slots?.sendButton,
    toolbar: slots?.composerToolbar ?? composerProps.slots?.toolbar,
  };

  const mergedComposerSlotProps = {
    ...composerProps.slotProps,
    attachButton: slotProps?.composerAttachButton ?? composerProps.slotProps?.attachButton,
    attachInput: slotProps?.composerAttachInput ?? composerProps.slotProps?.attachInput,
    helperText: slotProps?.composerHelperText ?? composerProps.slotProps?.helperText,
    input: slotProps?.composerInput ?? composerProps.slotProps?.input,
    root: slotProps?.composerRoot ?? composerProps.slotProps?.root,
    sendButton: slotProps?.composerSendButton ?? composerProps.slotProps?.sendButton,
    toolbar: slotProps?.composerToolbar ?? composerProps.slotProps?.toolbar,
  };

  return (
    <ChatLayout
      slotProps={{
        conversationsPane: {
          className: chatBoxClasses.conversationsPane,
          ...resolveComponentProps(slotProps?.conversationsPane, ownerState),
        },
        threadPane: {
          className: chatBoxClasses.threadPane,
          ...resolveComponentProps(slotProps?.threadPane, ownerState),
        },
      }}
      slots={{
        conversationsPane: slots?.conversationsPane ?? ChatBoxConversationsPane,
        root: ChatBoxLayoutRoot,
        threadPane: slots?.threadPane ?? ChatBoxThreadPane,
      }}
    >
      {hasConversationsPane ? (
        <ConversationsComponent
          {...conversationsProps}
          className={joinClassNames(chatBoxClasses.conversations, conversationsProps.className)}
          slotProps={mergedConversationsSlotProps}
          slots={mergedConversationsSlots}
        />
      ) : null}
      <React.Fragment>
        <ThreadComponent
          {...threadProps}
          className={joinClassNames(chatBoxClasses.thread, threadProps.className)}
          renderItem={defaultRenderItem}
          scrollToBottomAffordance={defaultScrollToBottomAffordance}
          slotProps={mergedThreadSlotProps}
          slots={mergedThreadSlots}
          typingIndicator={defaultTypingIndicator}
        />
        <ComposerComponent
          {...composerProps}
          className={joinClassNames(chatBoxClasses.composer, composerProps.className)}
          slotProps={mergedComposerSlotProps}
          slots={mergedComposerSlots}
        />
      </React.Fragment>
    </ChatLayout>
  );
}

type ChatBoxComponent = (<Cursor = string>(
  props: ChatBoxProps<Cursor> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ChatBox = React.forwardRef(function ChatBox<Cursor = string>(
  inProps: ChatBoxProps<Cursor>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatBox',
  });
  const {
    adapter,
    activeConversationId,
    className,
    composerValue,
    conversations,
    defaultActiveConversationId,
    defaultComposerValue,
    defaultConversations,
    defaultMessages,
    localeText,
    messages,
    onActiveConversationChange,
    onComposerValueChange,
    onConversationsChange,
    onData,
    onError,
    onFinish,
    onMessagesChange,
    onToolCall,
    partRenderers,
    slotProps,
    slots,
    storeClass,
    streamFlushInterval,
    sx,
    ...other
  } = props;
  const Root = React.useMemo(() => slots?.root ?? createDefaultRootSlot(sx), [slots?.root, sx]);
  const ownerState: ChatBoxOwnerState = {
    hasBlockingError: false,
    isBootstrapping: false,
  };
  const showConversationsPane = hasConversationSource({
    adapter,
    conversations,
    defaultConversations,
  });

  return (
    <ChatRoot
      activeConversationId={activeConversationId}
      adapter={adapter}
      composerValue={composerValue}
      conversations={conversations}
      defaultActiveConversationId={defaultActiveConversationId}
      defaultComposerValue={defaultComposerValue}
      defaultConversations={defaultConversations}
      defaultMessages={defaultMessages}
      localeText={localeText}
      messages={messages}
      onActiveConversationChange={onActiveConversationChange}
      onComposerValueChange={onComposerValueChange}
      onConversationsChange={onConversationsChange}
      onData={onData}
      onError={onError}
      onFinish={onFinish}
      onMessagesChange={onMessagesChange}
      onToolCall={onToolCall}
      partRenderers={partRenderers}
      ref={ref}
      slotProps={{
        root: {
          className: joinClassNames(chatBoxClasses.root, className),
          ...resolveComponentProps(slotProps?.root, ownerState),
        },
      }}
      slots={{ root: Root }}
      storeClass={storeClass}
      streamFlushInterval={streamFlushInterval}
      {...other}
    >
      <ChatBoxContent
        hasConversationsPane={showConversationsPane}
        slotProps={slotProps}
        slots={slots}
      />
    </ChatRoot>
  );
}) as ChatBoxComponent;
