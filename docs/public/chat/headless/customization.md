---
productId: x-chat
title: Chat - Headless customization
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Headless customization

<p class="description">Customize the headless primitives through slots, <code>slotProps</code>, and owner state while keeping the built-in structure and behavior.</p>

```tsx
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
});

const BrandConversationItemContent = React.forwardRef(
  function BrandConversationItemContent(
    props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
      conversation?: unknown;
      ownerState?: unknown;
      selected?: boolean;
      unread?: boolean;
      focused?: boolean;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
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

const BrandConversationTitle = React.forwardRef(function BrandConversationTitle(
  props: React.HTMLAttributes<HTMLDivElement> & {
    conversation?: { title?: string };
    ownerState?: unknown;
    selected?: boolean;
    unread?: boolean;
    focused?: boolean;
  },
  ref: React.Ref<HTMLDivElement>,
) {
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
});

const BrandConversationPreview = React.forwardRef(function BrandConversationPreview(
  props: React.HTMLAttributes<HTMLDivElement> & {
    conversation?: { subtitle?: string };
    ownerState?: { unread?: boolean };
    selected?: boolean;
    unread?: boolean;
    focused?: boolean;
  },
  ref: React.Ref<HTMLDivElement>,
) {
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
});

const BrandConversationTimestamp = React.forwardRef(
  function BrandConversationTimestamp(
    props: React.HTMLAttributes<HTMLDivElement> & {
      conversation?: { lastMessageAt?: string };
      ownerState?: unknown;
      selected?: boolean;
      unread?: boolean;
      focused?: boolean;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
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
  function BrandConversationUnreadBadge(
    props: React.HTMLAttributes<HTMLSpanElement> & {
      conversation?: { unreadCount?: number };
      ownerState?: unknown;
      selected?: boolean;
      unread?: boolean;
      focused?: boolean;
    },
    ref: React.Ref<HTMLSpanElement>,
  ) {
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

const BrandMessageAuthor = React.forwardRef(function BrandMessageAuthor(
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

const BrandMessageAvatar = React.forwardRef(function BrandMessageAvatar(
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
});

const BrandMessageMeta = React.forwardRef(function BrandMessageMeta(
  props: React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: {
      role?: 'user' | 'assistant' | 'system';
      message?: {
        createdAt?: string;
        status?: string;
      };
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
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

const BrandComposerRoot = React.forwardRef(function BrandComposerRoot(
  props: React.PropsWithChildren<React.FormHTMLAttributes<HTMLFormElement>> & {
    ownerState?: unknown;
  },
  ref: React.Ref<HTMLFormElement>,
) {
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

const BrandComposerInput = React.forwardRef(function BrandComposerInput(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ownerState?: unknown;
  },
  ref: React.Ref<HTMLTextAreaElement>,
) {
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

const BrandComposerButton = React.forwardRef(function BrandComposerButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { ownerState?: unknown },
  ref: React.Ref<HTMLButtonElement>,
) {
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
                slots={{ authorName: BrandMessageAuthor, root: BrandMessageGroup }}
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
        </Conversation.Root>
      </Chat.Layout>
    </Chat.Root>
  );
}
```

## Customization model

`@mui/x-chat/headless` is designed to let you keep the shipped semantics and interaction logic while replacing most of the rendered structure.

The main tools are:

- `slots` to replace structural subcomponents
- `slotProps` to pass props into those replacements
- owner state to style custom slots based on runtime-aware structural state

## `slots`

Use `slots` when you want to replace the element or React component used for a specific region.

Examples:

- replace the conversation list root with a custom container
- replace the conversation row component while preserving listbox behavior
- replace the composer attach button or hidden file input
- replace the unread marker label or scroll-to-bottom badge

```tsx
<ConversationList.Root
  slots={{
    root: 'aside',
    item: CustomConversationRow,
  }}
/>
```

## `slotProps`

Use `slotProps` when you want to keep the slot structure but add attributes, styling hooks, or local event behavior.

```tsx
<Composer.AttachButton
  slotProps={{
    input: {
      accept: 'image/*,.pdf',
    },
    root: {
      'aria-label': 'Upload files',
    },
  }}
/>
```

`slotProps` is also the place to pass attributes such as `id`, `className`, ARIA labels, and design-system-specific props into the replaced slot.

## Owner state

Custom slot components receive owner state that describes the structural state of the primitive.

Common examples include:

- conversation item state such as `selected`, `unread`, and `focused`
- thread state such as `conversationId` and `hasConversation`
- message-list state such as `isAtBottom` and `messageCount`
- message state such as `role`, `status`, `streaming`, and `isGrouped`
- composer state such as `hasValue`, `isSubmitting`, `isStreaming`, and `attachmentCount`
- indicator state such as typing users, unread boundaries, and unseen-message counts

### Owner-state example

```tsx
const CustomSendButton = React.forwardRef(function CustomSendButton(props, ref) {
  const { ownerState, ...other } = props;

  return (
    <button
      data-streaming={String(ownerState?.isStreaming)}
      data-submitting={String(ownerState?.isSubmitting)}
      ref={ref}
      {...other}
    />
  );
});
```

This pattern is the main bridge between the headless package and a product-specific visual language.

## Replace slots or rebuild from core

:::info
If you need a ready-made visual design, use the [Material layer](/x/react-chat/material/). If you want full control over the DOM, use the [Core layer](/x/react-chat/core/). The headless layer sits between the two: it gives you structural primitives with built-in semantics and interaction behavior while leaving visual decisions to your code.
:::

Use slot replacement when:

- the shipped behavior is correct
- the overall structure is close to what you need
- you want the package to keep handling semantics, focus, and state-derived structural logic

Use headless primitives or custom composition when:

- the interaction model changes substantially
- the component hierarchy is fundamentally different
- the built-in keyboard or list behavior no longer matches the product surface

## Styling strategy

The headless docs stay design-system agnostic on purpose.
Typical styling approaches include:

- utility classes
- CSS Modules
- CSS-in-JS wrappers
- custom design-system components passed through slots

The important boundary is:

- headless owns runtime state and contracts
- headless owns structure, semantics, and interaction behavior
- your app owns visual design

## See also

- Continue with [Conversation list](/x/react-chat/headless/conversation-list/) to see owner state on row-level slots.
- Continue with [Messages](/x/react-chat/headless/messages/) for selective message-part replacement.
- Continue with [Slot customization](/x/react-chat/headless/examples/slot-customization/) for a full demo that replaces multiple slots in one surface.

## API

- [ChatRoot](/x/api/chat/chat-root/)
