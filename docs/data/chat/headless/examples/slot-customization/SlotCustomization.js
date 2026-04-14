import * as React from 'react';
import {
  Chat,
  Conversation,
  Composer,
  ConversationList,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat/headless';
import {
  createEchoAdapter,
  cloneConversations,
  cloneThreadMap,
  syncConversationPreview,
  formatConversationTime,
  formatMessageTime,
} from 'docsx/data/chat/headless/examples/shared/demoUtils';
import {
  demoUsers,
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/headless/examples/shared/demoData';
import { DemoToolbarButton } from 'docsx/data/chat/headless/examples/shared/DemoPrimitives';

const brand = {
  background: '#f0f2f5',
  surface: '#ffffff',
  rail: '#e8ebed',
  border: '#d0d4da',
  text: '#1c1e21',
  muted: '#65676b',
  accent: '#333333',
  accentSoft: '#f0f2f5',
  user: '#333333',
};

const BrandConversationItem = React.forwardRef(
  function BrandConversationItem(props, ref) {
    const {
      children,
      ownerState,
      conversation,
      selected,
      unread,
      focused,
      style,
      ...other
    } = props;
    return (
      <div
        ref={ref}
        style={{
          display: 'grid',
          gridTemplateColumns: '44px minmax(0, 1fr) auto',
          gridTemplateRows: 'auto auto',
          columnGap: 10,
          rowGap: 2,
          padding: '10px 12px',
          background: ownerState?.selected ? brand.accentSoft : 'transparent',
          borderLeft: ownerState?.selected
            ? `2px solid ${brand.accent}`
            : '2px solid transparent',
          borderBottom: `1px solid ${brand.border}`,
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

const BrandConversationAvatar = React.forwardRef(
  function BrandConversationAvatar(props, ref) {
    const { conversation, ownerState, selected, unread, focused, style, ...other } =
      props;
    const participant = conversation?.participants?.[0];

    return (
      <div
        ref={ref}
        style={{
          gridColumn: 1,
          gridRow: '1 / 3',
          width: 40,
          height: 40,
          overflow: 'hidden',
          background: brand.border,
          ...style,
        }}
        {...other}
      >
        {participant?.avatarUrl ? (
          <img
            alt={participant.displayName ?? ''}
            src={participant.avatarUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(100%)',
            }}
          />
        ) : null}
      </div>
    );
  },
);

const BrandConversationItemContent = React.forwardRef(
  function BrandConversationItemContent(props, ref) {
    const {
      children,
      conversation,
      ownerState,
      selected,
      unread,
      focused,
      style,
      ...other
    } = props;
    return (
      <div
        ref={ref}
        style={{
          gridColumn: 2,
          gridRow: '1 / 3',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minWidth: 0,
          gap: 2,
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

const BrandConversationTitle = React.forwardRef(
  function BrandConversationTitle(props, ref) {
    const { conversation, ownerState, selected, unread, focused, style, ...other } =
      props;

    return (
      <div
        ref={ref}
        style={{
          minWidth: 0,
          fontWeight: 800,
          color: brand.text,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          ...style,
        }}
        {...other}
      >
        {conversation?.title}
      </div>
    );
  },
);

const BrandConversationPreview = React.forwardRef(
  function BrandConversationPreview(props, ref) {
    const { conversation, ownerState, selected, unread, focused, style, ...other } =
      props;

    if (!conversation?.subtitle) {
      return null;
    }

    return (
      <div
        ref={ref}
        style={{
          minWidth: 0,
          color: ownerState?.unread ? brand.text : brand.muted,
          fontSize: 12,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          ...style,
        }}
        {...other}
      >
        {conversation.subtitle}
      </div>
    );
  },
);

const BrandConversationTimestamp = React.forwardRef(
  function BrandConversationTimestamp(props, ref) {
    const { conversation, ownerState, selected, unread, focused, style, ...other } =
      props;

    if (!conversation?.lastMessageAt) {
      return null;
    }

    return (
      <div
        ref={ref}
        style={{
          gridColumn: 3,
          gridRow: 1,
          alignSelf: 'end',
          justifySelf: 'end',
          color: brand.muted,
          fontSize: 11,
          ...style,
        }}
        {...other}
      >
        {formatConversationTime(conversation.lastMessageAt)}
      </div>
    );
  },
);

const BrandConversationUnreadBadge = React.forwardRef(
  function BrandConversationUnreadBadge(props, ref) {
    const { conversation, ownerState, selected, unread, focused, style, ...other } =
      props;
    const unreadCount = conversation?.unreadCount ?? 0;

    if (unreadCount <= 0) {
      return null;
    }

    return (
      <span
        ref={ref}
        style={{
          gridColumn: 3,
          gridRow: 2,
          alignSelf: 'start',
          justifySelf: 'end',
          background: brand.accent,
          color: '#ffffff',
          minWidth: 18,
          padding: '1px 5px',
          textAlign: 'center',
          fontWeight: 800,
          fontSize: 11,
          ...style,
        }}
        {...other}
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    );
  },
);

const BrandMessageAuthor = React.forwardRef(function BrandMessageAuthor(props, ref) {
  const { children, ownerState, style, ...other } = props;
  const isUser = ownerState?.role === 'user';

  return (
    <div
      ref={ref}
      style={{
        marginLeft: isUser ? 0 : 44,
        marginRight: isUser ? 44 : 0,
        textAlign: isUser ? 'right' : 'left',
        color: brand.muted,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

const BrandMessageGroup = React.forwardRef(function BrandMessageGroup(props, ref) {
  const { children, ownerState, style, ...other } = props;

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gap: 4,
        marginTop: ownerState?.isFirst ? 16 : 6,
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

const BrandMessageRoot = React.forwardRef(function BrandMessageRoot(props, ref) {
  const { children, ownerState, style, ...other } = props;
  const isUser = ownerState?.role === 'user';

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: isUser ? 'minmax(0, 1fr) 32px' : '32px minmax(0, 1fr)',
        gridTemplateRows: 'auto auto',
        gap: '4px 12px',
        alignItems: 'start',
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

const BrandMessageAvatar = React.forwardRef(function BrandMessageAvatar(props, ref) {
  const { children, ownerState, style, ...other } = props;
  const isUser = ownerState?.role === 'user';

  return (
    <div
      ref={ref}
      style={{
        width: 32,
        height: 32,
        overflow: 'hidden',
        background: brand.border,
        gridColumn: isUser ? 2 : 1,
        gridRow: '1 / 3',
        alignSelf: 'start',
        filter: 'grayscale(100%)',
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

const BrandMessageContent = React.forwardRef(
  function BrandMessageContent(props, ref) {
    const { children, ownerState, style, ...other } = props;
    const isUser = ownerState?.role === 'user';

    return (
      <div
        ref={ref}
        style={{
          padding: '10px 14px',
          background: isUser ? brand.user : brand.surface,
          color: isUser ? '#ffffff' : brand.text,
          border: `1px solid ${isUser ? brand.user : brand.border}`,
          gridColumn: isUser ? 1 : 2,
          gridRow: 1,
          justifySelf: isUser ? 'end' : 'start',
          maxWidth: '90%',
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

const BrandMessageMeta = React.forwardRef(function BrandMessageMeta(props, ref) {
  const { ownerState, style, ...other } = props;
  const isUser = ownerState?.role === 'user';

  return (
    <div
      ref={ref}
      style={{
        color: brand.muted,
        fontSize: 11,
        gridColumn: isUser ? 1 : 2,
        gridRow: 2,
        justifySelf: isUser ? 'end' : 'start',
        ...style,
      }}
      {...other}
    >
      {formatMessageTime(ownerState?.message?.createdAt)}{' '}
      {ownerState?.message?.status ? `· ${ownerState.message.status}` : ''}
    </div>
  );
});

const BrandComposerRoot = React.forwardRef(function BrandComposerRoot(props, ref) {
  const { children, ownerState, style, ...other } = props;

  return (
    <form
      ref={ref}
      style={{
        display: 'grid',
        gap: 10,
        paddingTop: 14,
        borderTop: `1px solid ${brand.border}`,
        ...style,
      }}
      {...other}
    >
      {children}
    </form>
  );
});

const BrandComposerInput = React.forwardRef(function BrandComposerInput(props, ref) {
  const { ownerState, style, ...other } = props;

  return (
    <textarea
      ref={ref}
      style={{
        width: '100%',
        minHeight: 48,
        maxHeight: 180,
        resize: 'none',
        background: brand.rail,
        border: `1px solid ${brand.border}`,
        color: brand.text,
        padding: '10px 12px',
        fontFamily: 'inherit',
        fontSize: 14,
        outline: 'none',
        boxSizing: 'border-box',
        ...style,
      }}
      {...other}
    />
  );
});

const BrandComposerButton = React.forwardRef(
  function BrandComposerButton(props, ref) {
    const { ownerState, style, children, disabled, ...other } = props;
    const isPrimary = other['data-variant'] === 'primary';

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={{
          border: `1px solid ${isPrimary ? brand.accent : brand.border}`,
          background: isPrimary ? brand.accent : brand.surface,
          color: isPrimary ? '#ffffff' : brand.text,
          padding: '8px 18px',
          fontWeight: 600,
          fontSize: 13,
          fontFamily: 'inherit',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.4 : 1,
          ...style,
        }}
        type={other.type === 'submit' ? 'submit' : 'button'}
        {...other}
      >
        {children}
      </button>
    );
  },
);

export default function SlotCustomization() {
  const [activeConversationId, setActiveConversationId] = React.useState('design');
  const [conversations, setConversations] = React.useState(() =>
    cloneConversations(inboxConversations),
  );
  const [threads, setThreads] = React.useState(() => cloneThreadMap(inboxThreads));
  const adapter = React.useMemo(
    () =>
      createEchoAdapter({
        agent: demoUsers.agent,
        respond: (text) =>
          `Branded shell reply: ${text}. This example keeps the shipped interaction model while replacing the rendered structure with slot components.`,
      }),
    [],
  );

  const messages = threads[activeConversationId] ?? [];

  return (
    <Chat.Root
      activeConversationId={activeConversationId}
      adapter={adapter}
      conversations={conversations}
      messages={messages}
      onActiveConversationChange={(nextConversationId) => {
        if (nextConversationId) {
          setActiveConversationId(nextConversationId);
        }
      }}
      onMessagesChange={(nextMessages) => {
        setThreads((previous) => ({
          ...previous,
          [activeConversationId]: nextMessages,
        }));
        setConversations((previous) =>
          syncConversationPreview(previous, activeConversationId, nextMessages),
        );
      }}
      slotProps={{
        root: {
          style: {
            background: brand.surface,
            display: 'grid',
            gap: 16,
            color: brand.text,
          },
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Brand-adapted shell</div>
          <div style={{ fontSize: 13, color: brand.muted, marginTop: 4 }}>
            The runtime and accessibility behavior stay the same. Only the rendered
            slots change.
          </div>
        </div>
        <DemoToolbarButton tone="accent">Design system tokens</DemoToolbarButton>
      </div>
      <Chat.Layout
        style={{ display: 'grid', gridTemplateColumns: 'auto 1fr' }}
        slotProps={{
          root: { style: { height: 600 } },
          conversationsPane: {
            style: {
              width: 280,
              paddingRight: 16,
              borderRight: `1px solid ${brand.border}`,
              background: brand.rail,
            },
          },
          threadPane: {
            style: {
              minWidth: 0,
              paddingLeft: 16,
              display: 'grid',
              gridTemplateRows: 'minmax(0, 1fr)',
              gap: 14,
            },
          },
        }}
      >
        <ConversationList.Root
          aria-label="Brand threads"
          slotProps={{ root: { style: { display: 'grid', gap: 10 } } }}
          slots={{
            item: BrandConversationItem,
            itemAvatar: BrandConversationAvatar,
            itemContent: BrandConversationItemContent,
            preview: BrandConversationPreview,
            timestamp: BrandConversationTimestamp,
            title: BrandConversationTitle,
            unreadBadge: BrandConversationUnreadBadge,
          }}
        />
        <Conversation.Root
          slotProps={{
            root: {
              style: {
                minHeight: 0,
                display: 'grid',
                gridTemplateRows: 'auto minmax(0, 1fr) auto',
                gap: 14,
              },
            },
          }}
        >
          <Conversation.Header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              paddingBottom: 14,
              borderBottom: `1px solid ${brand.border}`,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <Conversation.Title style={{ fontSize: 19, fontWeight: 900 }} />
              <Conversation.Subtitle
                style={{
                  color: brand.muted,
                  fontSize: 13,
                  marginTop: 4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              />
            </div>
            <Conversation.HeaderActions style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                style={{
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${brand.border}`,
                  background: brand.surface,
                  color: brand.muted,
                  cursor: 'pointer',
                }}
              >
                Share
              </button>
              <button
                type="button"
                style={{
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${brand.border}`,
                  background: brand.surface,
                  color: brand.muted,
                  cursor: 'pointer',
                }}
              >
                Archive
              </button>
            </Conversation.HeaderActions>
          </Conversation.Header>
          <MessageList.Root
            estimatedItemSize={100}
            renderItem={({ id, index }) => (
              <MessageGroup
                index={index}
                key={id}
                messageId={id}
                slots={{ authorName: BrandMessageAuthor, group: BrandMessageGroup }}
              >
                <Message.Root messageId={id} slots={{ root: BrandMessageRoot }}>
                  <Message.Avatar slots={{ avatar: BrandMessageAvatar }} />
                  <Message.Content slots={{ bubble: BrandMessageContent }} />
                  <Message.Meta slots={{ meta: BrandMessageMeta }} />
                </Message.Root>
              </MessageGroup>
            )}
          />
          <Composer.Root slots={{ root: BrandComposerRoot }}>
            <Composer.TextArea
              aria-label="Brand message"
              placeholder="Reply using the product-specific markup"
              slots={{ input: BrandComposerInput }}
            />
            <div
              style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}
            >
              <Composer.AttachButton slots={{ attachButton: BrandComposerButton }}>
                Attach
              </Composer.AttachButton>
              <Composer.SendButton
                data-variant="primary"
                slots={{ sendButton: BrandComposerButton }}
              >
                Send
              </Composer.SendButton>
            </div>
          </Composer.Root>
        </Conversation.Root>
      </Chat.Layout>
    </Chat.Root>
  );
}
