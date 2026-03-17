import * as React from 'react';
import {
  Chat,
  Composer,
  ConversationList,
  Message,
  MessageGroup,
  MessageList,
  Thread,
} from '@mui/x-chat-unstyled';
import {
  createEchoAdapter,
  cloneConversations,
  cloneThreadMap,
  syncConversationPreview,
  formatConversationTime,
  formatMessageTime,
} from '../shared/demoUtils';
import { demoUsers, inboxConversations, inboxThreads } from '../shared/demoData';
import { DemoToolbarButton } from '../shared/DemoPrimitives';

const brand = {
  background: '#fff8ef',
  surface: '#fffdf8',
  rail: '#fff3dc',
  border: '#efcc8f',
  text: '#3d2500',
  muted: '#7a5a24',
  accent: '#b55400',
  accentSoft: '#fff0d6',
  user: '#3d2500',
} as const;

const BrandConversationItem = React.forwardRef(function BrandConversationItem(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: {
      selected?: boolean;
      unread?: boolean;
      focused?: boolean;
    };
    conversation?: unknown;
    selected?: boolean;
    unread?: boolean;
    focused?: boolean;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    ownerState,
    conversation: _,
    selected: _s,
    unread: _u,
    focused: _f,
    style,
    ...other
  } = props;
  let borderColor = 'transparent';

  if (ownerState?.selected) {
    borderColor = brand.accent;
  } else if (ownerState?.focused) {
    borderColor = brand.border;
  }

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '44px minmax(0, 1fr) auto',
        gap: 10,
        alignItems: 'center',
        padding: 12,
        borderRadius: 18,
        background: ownerState?.selected ? brand.surface : 'transparent',
        border: `1px solid ${borderColor}`,
        boxShadow: ownerState?.focused ? '0 0 0 3px rgba(181, 84, 0, 0.12)' : 'none',
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

const BrandConversationAvatar = React.forwardRef(function BrandConversationAvatar(
  props: React.HTMLAttributes<HTMLDivElement> & {
    conversation?: {
      participants?: Array<{
        avatarUrl?: string;
        displayName?: string;
      }>;
    };
    ownerState?: unknown;
    selected?: boolean;
    unread?: boolean;
    focused?: boolean;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    conversation,
    ownerState: _,
    selected: _s,
    unread: _u,
    focused: _f,
    style,
    ...other
  } = props;
  const participant = conversation?.participants?.[0];

  return (
    <div
      ref={ref}
      style={{
        width: 44,
        height: 44,
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${brand.border}`,
        background: brand.surface,
        ...style,
      }}
      {...other}
    >
      {participant?.avatarUrl ? (
        <img
          alt={participant.displayName ?? ''}
          src={participant.avatarUrl}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : null}
    </div>
  );
});

const BrandConversationText = React.forwardRef(function BrandConversationText(
  props: React.HTMLAttributes<HTMLDivElement> & {
    conversation?: {
      title?: string;
      subtitle?: string;
    };
    ownerState?: {
      unread?: boolean;
    };
    selected?: boolean;
    unread?: boolean;
    focused?: boolean;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    conversation,
    ownerState,
    selected: _s,
    unread: _u,
    focused: _f,
    style,
    ...other
  } = props;

  return (
    <div
      ref={ref}
      style={{ minWidth: 0, display: 'grid', gap: 4, ...style }}
      {...other}
    >
      <div
        style={{
          fontWeight: 800,
          color: brand.text,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {conversation?.title}
      </div>
      <div
        style={{
          color: ownerState?.unread ? brand.text : brand.muted,
          fontSize: 12,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {conversation?.subtitle}
      </div>
    </div>
  );
});

const BrandConversationMeta = React.forwardRef(function BrandConversationMeta(
  props: React.HTMLAttributes<HTMLDivElement> & {
    conversation?: {
      unreadCount?: number;
      lastMessageAt?: string;
    };
    ownerState?: unknown;
    selected?: boolean;
    unread?: boolean;
    focused?: boolean;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    conversation,
    ownerState: _,
    selected: _s,
    unread: _u,
    focused: _f,
    style,
    ...other
  } = props;

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        justifyItems: 'end',
        gap: 6,
        color: brand.muted,
        fontSize: 11,
        ...style,
      }}
      {...other}
    >
      <div>{formatConversationTime(conversation?.lastMessageAt)}</div>
      {(conversation?.unreadCount ?? 0) > 0 ? (
        <div
          style={{
            borderRadius: 999,
            background: brand.accent,
            color: '#ffffff',
            minWidth: 22,
            padding: '2px 7px',
            textAlign: 'center',
            fontWeight: 800,
          }}
        >
          {conversation?.unreadCount}
        </div>
      ) : null}
    </div>
  );
});

const BrandMessageAuthor = React.forwardRef(function BrandMessageAuthor(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: unknown;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState: _, style, ...other } = props;

  return (
    <div
      ref={ref}
      style={{
        marginLeft: 46,
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

const BrandMessageGroup = React.forwardRef(function BrandMessageGroup(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: {
      isFirst?: boolean;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
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

const BrandMessageRoot = React.forwardRef(function BrandMessageRoot(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: {
      role?: 'user' | 'assistant' | 'system';
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, style, ...other } = props;
  const isUser = ownerState?.role === 'user';

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-end',
        flexDirection: isUser ? 'row-reverse' : 'row',
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

const BrandMessageAvatar = React.forwardRef(function BrandMessageAvatar(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: unknown;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState: _, style, ...other } = props;

  return (
    <div
      ref={ref}
      style={{
        width: 34,
        height: 34,
        borderRadius: 14,
        overflow: 'hidden',
        border: `1px solid ${brand.border}`,
        background: brand.surface,
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

const BrandMessageContent = React.forwardRef(function BrandMessageContent(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: {
      role?: 'user' | 'assistant' | 'system';
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, style, ...other } = props;
  const isUser = ownerState?.role === 'user';

  return (
    <div
      ref={ref}
      style={{
        maxWidth: '70%',
        padding: '12px 14px',
        borderRadius: 20,
        background: isUser ? brand.user : brand.surface,
        color: isUser ? '#ffffff' : brand.text,
        border: `1px solid ${isUser ? brand.user : brand.border}`,
        boxShadow: '0 12px 24px rgba(61, 37, 0, 0.08)',
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

const BrandMessageMeta = React.forwardRef(function BrandMessageMeta(
  props: React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: {
      message?: {
        createdAt?: string;
        status?: string;
      };
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { ownerState, style, ...other } = props;

  return (
    <div ref={ref} style={{ color: brand.muted, fontSize: 11, ...style }} {...other}>
      {formatMessageTime(ownerState?.message?.createdAt)}{' '}
      {ownerState?.message?.status ? `· ${ownerState.message.status}` : ''}
    </div>
  );
});

const BrandComposerRoot = React.forwardRef(function BrandComposerRoot(
  props: React.PropsWithChildren<React.FormHTMLAttributes<HTMLFormElement>> & {
    ownerState?: unknown;
  },
  ref: React.Ref<HTMLFormElement>,
) {
  const { children, ownerState: _, style, ...other } = props;

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

const BrandComposerInput = React.forwardRef(function BrandComposerInput(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ownerState?: unknown;
  },
  ref: React.Ref<HTMLTextAreaElement>,
) {
  const { ownerState: _, style, ...other } = props;

  return (
    <textarea
      ref={ref}
      style={{
        width: '100%',
        minHeight: 86,
        maxHeight: 180,
        resize: 'none',
        borderRadius: 18,
        background: brand.surface,
        border: `1px solid ${brand.border}`,
        color: brand.text,
        padding: '12px 14px',
        fontFamily: 'inherit',
        fontSize: 14,
        outline: 'none',
        ...style,
      }}
      {...other}
    />
  );
});

const BrandComposerButton = React.forwardRef(function BrandComposerButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { ownerState?: unknown },
  ref: React.Ref<HTMLButtonElement>,
) {
  const { ownerState: _, style, children, ...other } = props;
  const isPrimary = other['data-variant'] === 'primary';

  return (
    <button
      ref={ref}
      style={{
        borderRadius: 999,
        border: `1px solid ${isPrimary ? brand.accent : brand.border}`,
        background: isPrimary ? brand.accent : brand.surface,
        color: isPrimary ? '#ffffff' : brand.text,
        padding: '8px 14px',
        fontWeight: 800,
        ...style,
      }}
      type={other.type === 'submit' ? 'submit' : 'button'}
      {...other}
    >
      {children}
    </button>
  );
});

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
            border: `1px solid ${brand.border}`,
            borderRadius: 28,
            padding: 18,
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
          root: { style: { minHeight: 600 } },
          conversationsPane: {
            style: {
              width: 300,
              padding: 16,
              borderRadius: 24,
              background: brand.rail,
              border: `1px solid ${brand.border}`,
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
            itemMeta: BrandConversationMeta,
            itemText: BrandConversationText,
          }}
        />
        <Thread.Root
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
          <Thread.Header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              paddingBottom: 14,
              borderBottom: `1px solid ${brand.border}`,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <Thread.Title style={{ fontSize: 19, fontWeight: 900 }} />
              <Thread.Subtitle
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
            <Thread.Actions style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                style={{
                  borderRadius: 999,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 700,
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
                  borderRadius: 999,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  border: `1px solid ${brand.border}`,
                  background: brand.surface,
                  color: brand.muted,
                  cursor: 'pointer',
                }}
              >
                Archive
              </button>
            </Thread.Actions>
          </Thread.Header>
          <MessageList.Root
            estimatedItemSize={100}
            renderItem={({ id, index }) => (
              <MessageGroup
                index={index}
                key={id}
                messageId={id}
                slots={{ authorName: BrandMessageAuthor, root: BrandMessageGroup }}
              >
                <Message.Root messageId={id} slots={{ root: BrandMessageRoot }}>
                  <Message.Avatar slots={{ root: BrandMessageAvatar }} />
                  <Message.Content slots={{ root: BrandMessageContent }} />
                  <Message.Meta slots={{ root: BrandMessageMeta }} />
                </Message.Root>
              </MessageGroup>
            )}
            style={{ minHeight: 0 }}
            virtualization={false}
          />
          <Composer.Root slots={{ root: BrandComposerRoot }}>
            <Composer.Input
              aria-label="Brand message"
              placeholder="Reply using the product-specific markup"
              slots={{ root: BrandComposerInput }}
            />
            <div
              style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}
            >
              <Composer.AttachButton slots={{ root: BrandComposerButton }}>
                Attach
              </Composer.AttachButton>
              <Composer.SendButton
                data-variant="primary"
                slots={{ root: BrandComposerButton }}
              >
                Send
              </Composer.SendButton>
            </div>
          </Composer.Root>
        </Thread.Root>
      </Chat.Layout>
    </Chat.Root>
  );
}
