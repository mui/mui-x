'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ChatRoot, ChatVariantProvider, ChatDensityProvider } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatBoxUtilityClasses } from './chatBoxClasses';
import { ChatBoxContent } from './ChatBoxContent';
import type { ChatBoxProps } from './ChatBox.types';

const useThemeProps = createUseThemeProps('MuiChatBox');

const ChatBoxStyled = styled('div', {
  name: 'MuiChatBox',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  boxSizing: 'border-box',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  minHeight: 0,
  containerType: 'inline-size',
  containerName: 'chatbox',
  isolation: 'isolate',
  overflow: 'hidden',
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body2.fontSize,
  color: (theme.vars || theme).palette.text.primary,
  backgroundColor: (theme.vars || theme).palette.background.default,
  '*, *::before, *::after': {
    boxSizing: 'inherit',
  },
}));

type ChatBoxComponent = (<Cursor = string>(
  props: ChatBoxProps<Cursor> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const ChatBox = React.forwardRef(function ChatBox<Cursor = string>(
  inProps: ChatBoxProps<Cursor>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatBox' });
  const isActiveConversationIdControlled = Object.prototype.hasOwnProperty.call(
    props,
    'activeConversationId',
  );

  const {
    // ChatRoot / provider props
    adapter,
    members,
    currentUser,
    getMessageAuthorId,
    getMessageAuthorDisplayName,
    getMessageAuthorAvatarUrl,
    messages,
    initialMessages,
    onMessagesChange,
    conversations,
    initialConversations,
    onConversationsChange,
    activeConversationId,
    initialActiveConversationId,
    onActiveConversationChange,
    composerValue,
    initialComposerValue,
    onComposerValueChange,
    onToolCall,
    onFinish,
    onData,
    onError,
    streamFlushInterval,
    partRenderers,
    storeClass,
    localeText,
    // Suggestions
    suggestions,
    suggestionsAutoSubmit,
    // Styled / visual props
    variant = 'default',
    density = 'standard',
    className,
    classes: classesProp,
    sx,
    slots,
    slotProps,
    features,
    layoutMode,
    layoutModeBreakpoints,
    ...other
  } = props;

  const classes = useChatBoxUtilityClasses(classesProp);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = React.useMemo(() => {
    return (node: HTMLDivElement | null) => {
      (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };
  }, [ref]);

  return (
    <ChatRoot
      adapter={adapter}
      members={members}
      currentUser={currentUser}
      getMessageAuthorId={getMessageAuthorId}
      getMessageAuthorDisplayName={getMessageAuthorDisplayName}
      getMessageAuthorAvatarUrl={getMessageAuthorAvatarUrl}
      messages={messages}
      initialMessages={initialMessages}
      onMessagesChange={onMessagesChange}
      conversations={conversations}
      initialConversations={initialConversations}
      onConversationsChange={onConversationsChange}
      {...(isActiveConversationIdControlled ? { activeConversationId } : {})}
      initialActiveConversationId={initialActiveConversationId}
      onActiveConversationChange={onActiveConversationChange}
      composerValue={composerValue}
      initialComposerValue={initialComposerValue}
      onComposerValueChange={onComposerValueChange}
      onToolCall={onToolCall}
      onFinish={onFinish}
      onData={onData}
      onError={onError}
      streamFlushInterval={streamFlushInterval}
      partRenderers={partRenderers}
      storeClass={storeClass}
      localeText={localeText}
      slotProps={{ root: { style: { display: 'contents' } } }}
    >
      <ChatVariantProvider variant={variant}>
        <ChatDensityProvider density={density}>
          <ChatBoxStyled
            ref={handleRef}
            className={clsx(classes.root, className)}
            sx={sx}
            {...other}
          >
            <ChatBoxContent
              variant={variant}
              slots={slots}
              slotProps={slotProps}
              features={features}
              layoutMode={layoutMode}
              layoutModeBreakpoints={layoutModeBreakpoints}
              rootRef={innerRef}
              suggestions={suggestions}
              suggestionsAutoSubmit={suggestionsAutoSubmit}
              layoutClassName={classes.layout}
              conversationsPaneClassName={classes.conversationsPane}
              threadPaneClassName={classes.threadPane}
            />
          </ChatBoxStyled>
        </ChatDensityProvider>
      </ChatVariantProvider>
    </ChatRoot>
  );
}) as ChatBoxComponent;

ChatBox.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  activeConversationId: PropTypes.string,
  adapter: PropTypes.shape({
    addToolApprovalResponse: PropTypes.func,
    listConversations: PropTypes.func,
    listMessages: PropTypes.func,
    loadMore: PropTypes.func,
    markRead: PropTypes.func,
    reconnectToStream: PropTypes.func,
    sendMessage: PropTypes.func.isRequired,
    setTyping: PropTypes.func,
    stop: PropTypes.func,
    subscribe: PropTypes.func,
  }).isRequired,
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  composerValue: PropTypes.string,
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      avatarUrl: PropTypes.string,
      id: PropTypes.string.isRequired,
      lastMessageAt: PropTypes.string,
      metadata: PropTypes.object,
      participants: PropTypes.arrayOf(
        PropTypes.shape({
          avatarUrl: PropTypes.string,
          displayName: PropTypes.string,
          id: PropTypes.string.isRequired,
          isOnline: PropTypes.bool,
          metadata: PropTypes.object,
          role: PropTypes.oneOf(['assistant', 'system', 'user']),
        }),
      ),
      readState: PropTypes.oneOf(['read', 'unread']),
      subtitle: PropTypes.string,
      title: PropTypes.string,
      unreadCount: PropTypes.number,
    }),
  ),
  /**
   * The local user sending messages.
   * If omitted, derived from `members` by finding the entry with `role === 'user'`.
   * Also used to enrich message authors when a rendered message resolves to `currentUser.id`.
   */
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string,
    displayName: PropTypes.string,
    id: PropTypes.string.isRequired,
    isOnline: PropTypes.bool,
    metadata: PropTypes.object,
    role: PropTypes.oneOf(['assistant', 'system', 'user']),
  }),
  /**
   * The vertical spacing density of chat messages.
   * - `'compact'` – Reduced vertical spacing between messages.
   * - `'standard'` – Default spacing.
   * - `'comfortable'` – Increased vertical spacing between messages.
   * @default 'standard'
   */
  density: PropTypes.oneOf(['comfortable', 'compact', 'standard']),
  /**
   * Feature flags to enable or disable built-in ChatBox behaviours.
   */
  features: PropTypes.shape({
    attachments: PropTypes.oneOfType([
      PropTypes.shape({
        acceptedMimeTypes: PropTypes.arrayOf(PropTypes.string),
        maxFileCount: PropTypes.number,
        maxFileSize: PropTypes.number,
        onAttachmentReject: PropTypes.func,
      }),
      PropTypes.bool,
    ]),
    autoScroll: PropTypes.oneOfType([
      PropTypes.shape({
        buffer: PropTypes.number,
      }),
      PropTypes.bool,
    ]),
    conversationHeader: PropTypes.bool,
    conversationList: PropTypes.bool,
    helperText: PropTypes.bool,
    scrollToBottom: PropTypes.bool,
    suggestions: PropTypes.bool,
  }),
  /**
   * Used to determine the avatar URL for a given message author.
   * Falls back to `message.author?.avatarUrl`, then to the matched member's `avatarUrl`.
   * @default (message) => message.author?.avatarUrl
   */
  getMessageAuthorAvatarUrl: PropTypes.func,
  /**
   * Used to determine the display name for a given message author.
   * Falls back to `message.author?.displayName`, then to the matched member's `displayName`.
   * @default (message) => message.author?.displayName
   */
  getMessageAuthorDisplayName: PropTypes.func,
  /**
   * Used to determine the author id for a given message.
   * The resolved id is used to match message authors against `currentUser`,
   * `members`, and active conversation participants.
   * @default (message) => message.author?.id
   */
  getMessageAuthorId: PropTypes.func,
  /**
   * The initial active conversation ID when uncontrolled. Ignored after initialization and when `activeConversationId` is provided.
   */
  initialActiveConversationId: PropTypes.string,
  /**
   * The initial composer value when uncontrolled. Ignored after initialization and when `composerValue` is provided.
   */
  initialComposerValue: PropTypes.string,
  /**
   * The initial conversations when uncontrolled. Ignored after initialization and when `conversations` is provided.
   */
  initialConversations: PropTypes.arrayOf(
    PropTypes.shape({
      avatarUrl: PropTypes.string,
      id: PropTypes.string.isRequired,
      lastMessageAt: PropTypes.string,
      metadata: PropTypes.object,
      participants: PropTypes.arrayOf(
        PropTypes.shape({
          avatarUrl: PropTypes.string,
          displayName: PropTypes.string,
          id: PropTypes.string.isRequired,
          isOnline: PropTypes.bool,
          metadata: PropTypes.object,
          role: PropTypes.oneOf(['assistant', 'system', 'user']),
        }),
      ),
      readState: PropTypes.oneOf(['read', 'unread']),
      subtitle: PropTypes.string,
      title: PropTypes.string,
      unreadCount: PropTypes.number,
    }),
  ),
  /**
   * The initial messages when uncontrolled. Ignored after initialization and when `messages` is provided.
   */
  initialMessages: PropTypes.arrayOf(
    PropTypes.shape({
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
            state: PropTypes.oneOf(['done', 'streaming']),
            text: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['text']).isRequired,
          }),
          PropTypes.shape({
            state: PropTypes.oneOf(['done', 'streaming']),
            text: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['reasoning']).isRequired,
          }),
          PropTypes.shape({
            filename: PropTypes.string,
            mediaType: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['file']).isRequired,
            url: PropTypes.string.isRequired,
          }),
          PropTypes.shape({
            sourceId: PropTypes.string.isRequired,
            title: PropTypes.string,
            type: PropTypes.oneOf(['source-url']).isRequired,
            url: PropTypes.string.isRequired,
          }),
          PropTypes.shape({
            sourceId: PropTypes.string.isRequired,
            text: PropTypes.string,
            title: PropTypes.string,
            type: PropTypes.oneOf(['source-document']).isRequired,
          }),
          PropTypes.shape({
            data: PropTypes.any.isRequired,
            id: PropTypes.string,
            transient: PropTypes.bool,
            type: PropTypes.object.isRequired,
          }),
          PropTypes.shape({
            type: PropTypes.oneOf(['step-start']).isRequired,
          }),
          PropTypes.shape({
            toolInvocation: PropTypes.shape({
              approval: PropTypes.object,
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
            toolInvocation: PropTypes.shape({
              approval: PropTypes.object,
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
  ),
  /**
   * Forces the responsive layout mode instead of deriving it from the container width.
   * When omitted, ChatBox chooses the mode automatically using `layoutModeBreakpoints`.
   */
  layoutMode: PropTypes.oneOf(['overlay', 'split', 'standard']),
  /**
   * Container-width breakpoints used when `layoutMode` is not provided.
   */
  layoutModeBreakpoints: PropTypes.shape({
    overlay: PropTypes.number,
    split: PropTypes.number,
  }),
  localeText: PropTypes.object,
  /**
   * Known chat participants.
   * Used to derive the local user / assistant user when explicit props are omitted,
   * and to enrich message authors by resolved author id at render time.
   */
  members: PropTypes.arrayOf(
    PropTypes.shape({
      avatarUrl: PropTypes.string,
      displayName: PropTypes.string,
      id: PropTypes.string.isRequired,
      isOnline: PropTypes.bool,
      metadata: PropTypes.object,
      role: PropTypes.oneOf(['assistant', 'system', 'user']),
    }),
  ),
  messages: PropTypes.arrayOf(
    PropTypes.shape({
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
            state: PropTypes.oneOf(['done', 'streaming']),
            text: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['text']).isRequired,
          }),
          PropTypes.shape({
            state: PropTypes.oneOf(['done', 'streaming']),
            text: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['reasoning']).isRequired,
          }),
          PropTypes.shape({
            filename: PropTypes.string,
            mediaType: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['file']).isRequired,
            url: PropTypes.string.isRequired,
          }),
          PropTypes.shape({
            sourceId: PropTypes.string.isRequired,
            title: PropTypes.string,
            type: PropTypes.oneOf(['source-url']).isRequired,
            url: PropTypes.string.isRequired,
          }),
          PropTypes.shape({
            sourceId: PropTypes.string.isRequired,
            text: PropTypes.string,
            title: PropTypes.string,
            type: PropTypes.oneOf(['source-document']).isRequired,
          }),
          PropTypes.shape({
            data: PropTypes.any.isRequired,
            id: PropTypes.string,
            transient: PropTypes.bool,
            type: PropTypes.object.isRequired,
          }),
          PropTypes.shape({
            type: PropTypes.oneOf(['step-start']).isRequired,
          }),
          PropTypes.shape({
            toolInvocation: PropTypes.shape({
              approval: PropTypes.object,
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
            toolInvocation: PropTypes.shape({
              approval: PropTypes.object,
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
  ),
  onActiveConversationChange: PropTypes.func,
  onComposerValueChange: PropTypes.func,
  onConversationsChange: PropTypes.func,
  onData: PropTypes.func,
  onError: PropTypes.func,
  onFinish: PropTypes.func,
  onMessagesChange: PropTypes.func,
  onToolCall: PropTypes.func,
  partRenderers: PropTypes.shape({
    'dynamic-tool': PropTypes.func,
    file: PropTypes.func,
    reasoning: PropTypes.func,
    'source-document': PropTypes.func,
    'source-url': PropTypes.func,
    'step-start': PropTypes.func,
    text: PropTypes.func,
    tool: PropTypes.func,
  }),
  /**
   * The extra props for the slot components.
   */
  slotProps: PropTypes.object,
  /**
   * The components used for each slot inside the ChatBox.
   */
  slots: PropTypes.object,
  /**
   * The store class to use for this provider.
   * @default ChatStore
   */
  storeClass: PropTypes.func,
  /**
   * Flush interval in milliseconds for batching rapid streaming deltas before applying them to the store.
   * @default 16
   */
  streamFlushInterval: PropTypes.number,
  /**
   * Prompt suggestions displayed in the empty state.
   * Clicking a suggestion pre-fills the composer.
   */
  suggestions: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
      PropTypes.string,
    ]).isRequired,
  ),
  /**
   * Whether clicking a suggestion automatically submits the message.
   * @default false
   */
  suggestionsAutoSubmit: PropTypes.bool,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The visual layout variant of the chat.
   * - `'default'` – Standard layout with avatars, individual timestamps, and full spacing.
   * - `'compact'` – Messenger-style layout: no avatars, author + timestamp in group header, tighter spacing.
   * @default 'default'
   */
  variant: PropTypes.oneOf(['compact', 'default']),
} as any;

export { ChatBox };
