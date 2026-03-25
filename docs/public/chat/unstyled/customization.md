---
productId: x-chat
title: Chat - Unstyled customization
packageName: '@mui/x-chat/unstyled'
---

# Unstyled customization

<p class="description">Customize the unstyled primitives through slots, <code>slotProps</code>, and owner state while keeping the built-in structure and behavior.</p>

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
} from '@mui/x-chat/unstyled';
import {
  createEchoAdapter,
  cloneConversations,
  cloneThreadMap,
  syncConversationPreview,
  formatConversationTime,
  formatMessageTime,
} from 'docsx/data/chat/unstyled/examples/shared/demoUtils';
import {
  demoUsers,
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/unstyled/examples/shared/demoData';
import { DemoToolbarButton } from 'docsx/data/chat/unstyled/examples/shared/DemoPrimitives';

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
    conversation,
    selected,
    unread,
    focused,
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
        gridTemplateRows: 'auto auto',
        columnGap: 10,
        rowGap: 2,
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
  const { conversation, ownerState, selected, unread, focused, style, ...other } =
    props;
  const participant = conversation?.participants?.[0];

  return (
    <div
      ref={ref}
      style={{
        gridColumn: 1,
        gridRow: '1 / 3',
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
        gridColumn: 2,
        gridRow: 1,
        alignSelf: 'end',
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
        gridColumn: 2,
        gridRow: 2,
        alignSelf: 'start',
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
          borderRadius: 999,
          background: brand.accent,
          color: '#ffffff',
          minWidth: 22,
          padding: '2px 7px',
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
    ownerState?: unknown;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, style, ...other } = props;

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
  const { children, ownerState, style, ...other } = props;

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
  const { ownerState, style, children, ...other } = props;
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
                  <Message.Avatar slots={{ root: BrandMessageAvatar }} />
                  <Message.Content slots={{ root: BrandMessageContent }} />
                  <Message.Meta slots={{ root: BrandMessageMeta }} />
                </Message.Root>
              </MessageGroup>
            )}
            style={{ minHeight: 0 }}
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

`@mui/x-chat/unstyled` is designed to let you keep the shipped semantics and interaction logic while replacing most of the rendered structure.

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

This pattern is the main bridge between the unstyled package and a product-specific visual language.

## Replace slots or rebuild from headless

Use slot replacement when:

- the shipped behavior is correct
- the overall structure is close to what you need
- you want the package to keep handling semantics, focus, and state-derived structural logic

Use headless primitives or custom composition when:

- the interaction model changes substantially
- the component hierarchy is fundamentally different
- the built-in keyboard or list behavior no longer matches the product surface

## Styling strategy

The unstyled docs stay design-system agnostic on purpose.
Typical styling approaches include:

- utility classes
- CSS modules
- CSS-in-JS wrappers
- custom design-system components passed through slots

The important boundary is:

- headless owns runtime state and contracts
- unstyled owns structure, semantics, and interaction behavior
- your app owns visual design

## Real-world examples

These examples show how slot customization can replicate the look and feel of well-known chat products:

- [Intercom-style widget](/x/react-chat/unstyled/examples/intercom-style/) — a compact support widget with branded header, bubble messages, and "Powered by" footer
- [ChatGPT-style layout](/x/react-chat/unstyled/examples/chatgpt-style/) — a full two-pane layout with dark sidebar, flat messages, and centered composer

## Adjacent pages

- Continue with [Conversation list](/x/react-chat/unstyled/conversation-list/) to see owner state on row-level slots.
- Continue with [Messages](/x/react-chat/unstyled/messages/) for selective message-part replacement.
- Continue with [Slot customization](/x/react-chat/unstyled/examples/slot-customization/) for a full recipe that replaces multiple slots in one surface.
