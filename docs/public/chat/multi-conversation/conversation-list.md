---
productId: x-chat
title: Conversation List
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatConversationList
---

# Chat - Conversation List

Render a sidebar that lists all available conversations, supports switching between them, and is fully customizable through slots and theme overrides.



The conversation list is the sidebar that shows all available conversations and lets users switch between them. `@mui/x-chat` ships `ChatConversationList`, a single component with fully themed styled slots for every visual sub-region: the scroller, each item row, the avatar, the title, the preview line, the timestamp, and the unread badge.

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import {
  createEchoAdapter,
  syncConversationPreview,
} from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/material/examples/shared/demoData';
import type { ChatConversation, ChatMessage } from '@mui/x-chat-headless';

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". Select a different conversation in the sidebar to see the two-pane layout.`,
});

export default function MultiConversation() {
  const [activeConversationId, setActiveConversationId] = React.useState(
    () => inboxConversations[0].id,
  );
  const [conversations, setConversations] = React.useState<ChatConversation[]>(() =>
    inboxConversations.map((c) => ({ ...c })),
  );
  const [threads, setThreads] = React.useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(
      Object.entries(inboxThreads).map(([id, msgs]) => [
        id,
        msgs.map((m) => ({ ...m })),
      ]),
    ),
  );

  const messages = threads[activeConversationId] ?? [];

  return (
    <ChatBox
      adapter={adapter}
      activeConversationId={activeConversationId}
      conversations={conversations}
      messages={messages}
      onActiveConversationChange={(nextId) => {
        if (nextId) {
          setActiveConversationId(nextId);
        }
      }}
      onMessagesChange={(nextMessages) => {
        setThreads((prev) => ({ ...prev, [activeConversationId]: nextMessages }));
        setConversations((prev) =>
          syncConversationPreview(prev, activeConversationId, nextMessages),
        );
      }}
      sx={{
        height: 560,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}

```

## Component anatomy

`ChatConversationList` renders one row per conversation. The default row structure is:

```text
ChatConversationList              <- scrolling listbox (role="listbox")
  [per conversation]
  item                            <- row container (role="option")
    itemAvatar                    <- 40x40 circular avatar
    itemContent                   <- flex column: title + preview
      title                       <- conversation name (bold when unread)
      preview                     <- last message text (caption, truncated)
    timestamp                     <- last-message time (caption, right-aligned)
    unreadBadge                   <- count badge (primary.main background)
```

All visual slots are owned by a single `ChatConversationList` instance. You do not need to compose sub-components manually — instead you replace any slot through the `slots` prop directly on `ChatConversationList`.

## Slot reference

| Slot key         | Default component                     | Purpose                                              |
| :--------------- | :------------------------------------ | :--------------------------------------------------- |
| `root`           | styled `div`                          | The outer list container                             |
| `scroller`       | styled `div`                          | Fixed-width scrolling column with `border-right`     |
| `viewport`       | styled `div`                          | Scrollable overflow container                        |
| `scrollbar`      | no-op `div`                           | Custom scrollbar track (replaced by native overflow) |
| `scrollbarThumb` | no-op `div`                           | Custom scrollbar thumb                               |
| `item`           | styled `div`                          | Individual row, receives selection/focus styles      |
| `itemAvatar`     | `ConversationListItemAvatar` wrapper  | Circular avatar element                              |
| `itemContent`    | `ConversationListItemContent` wrapper | Title + preview column                               |
| `title`          | `ConversationListTitle` wrapper       | Conversation name text                               |
| `preview`        | `ConversationListPreview` wrapper     | Preview line text                                    |
| `timestamp`      | `ConversationListTimestamp` wrapper   | Timestamp text                                       |
| `unreadBadge`    | `ConversationListUnreadBadge` wrapper | Unread count pill                                    |

Because the Material UI layer fills all slot defaults at instantiation, overriding a single slot only affects that region without disturbing the others.

## Switching conversations

The conversation list is rendered automatically when `ChatBox` is provided with more than one conversation. Clicking a row calls `onActiveConversationChange` with the conversation ID. Use controlled state to manage the active conversation:

```tsx
const [activeConversationId, setActiveConversationId] = React.useState('thread-a');

<ChatBox
  activeConversationId={activeConversationId}
  onActiveConversationChange={(nextId) => setActiveConversationId(nextId)}
  conversations={conversations}
/>;
```

If only one conversation is provided, `ChatBox` renders the thread pane directly without a sidebar.

## ownerState and how state flows

The item and all its sub-slots receive an `ownerState` prop that carries the current row's interaction state alongside the full conversation object.

### Item ownerState

| Field          | Type               | Description                            |
| :------------- | :----------------- | :------------------------------------- |
| `selected`     | `boolean`          | This conversation is the active thread |
| `unread`       | `boolean`          | The conversation has unread messages   |
| `focused`      | `boolean`          | This row currently has keyboard focus  |
| `conversation` | `ChatConversation` | The full conversation data object      |

The `selected` flag drives the row background (`palette.action.selected`). The `unread` flag drives bold title typography. The `focused` flag drives the `focus-visible` outline for keyboard accessibility.

Because the full `conversation` object is included, custom slot components can directly read fields such as `conversation.title`, `conversation.metadata`, `conversation.unreadCount`, and `conversation.lastMessageAt` without additional selectors.

### Root ownerState

| Field                  | Type                  | Description                        |
| :--------------------- | :-------------------- | :--------------------------------- |
| `conversationCount`    | `number`              | Total number of conversations      |
| `activeConversationId` | `string \| undefined` | Currently selected conversation ID |

## Overriding the avatar

Replace the avatar slot with a custom component to render initials or a status ring:

```tsx
import { ChatConversationList } from '@mui/x-chat';
import Avatar from '@mui/material/Avatar';

const ThemedAvatar = React.forwardRef(function ThemedAvatar(
  { ownerState, ...props },
  ref,
) {
  const title = ownerState?.conversation?.title ?? '';
  const initials = title
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <Avatar
      ref={ref}
      {...props}
      sx={{
        width: 40,
        height: 40,
        bgcolor: ownerState?.selected ? 'primary.main' : 'grey.400',
        fontSize: 'body2.fontSize',
        fontWeight: 'fontWeightMedium',
        ...props.sx,
      }}
    >
      {initials}
    </Avatar>
  );
});

<ChatConversationList slots={{ itemAvatar: ThemedAvatar }} />;
```

The `ownerState` prop arrives directly on the component because the Material UI layer passes it through `slotProps` using a function form. Destructure it before spreading `...props` to avoid forwarding a non-standard attribute to the DOM.

## Overriding the item content layout

Replace `itemContent` when you want to change the structural layout of the title and preview region — for example to add a participant count or an icon:

```tsx
import { ChatConversationList } from '@mui/x-chat';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GroupIcon from '@mui/icons-material/Group';

const RichItemContent = React.forwardRef(function RichItemContent(
  { ownerState, children, ...props },
  ref,
) {
  const { conversation, unread } = ownerState ?? {};

  return (
    <Box
      ref={ref}
      {...props}
      sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography
          variant="body2"
          fontWeight={unread ? 'fontWeightBold' : 'fontWeightMedium'}
          noWrap
          sx={{ flex: 1 }}
        >
          {conversation?.title}
        </Typography>
        {(conversation?.participants?.length ?? 0) > 2 && (
          <GroupIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
        )}
      </Box>
      <Typography variant="caption" color="text.secondary" noWrap>
        {conversation?.subtitle ?? 'No messages yet'}
      </Typography>
    </Box>
  );
});

<ChatConversationList slots={{ itemContent: RichItemContent }} />;
```

When you replace `itemContent`, the `title` and `preview` slots are no longer rendered (they are children of the default `itemContent`). Render any equivalent content directly inside your custom component.

## Overriding the full item row

Replace the `item` slot to take full control of a row's layout while still benefiting from the built-in selection, keyboard navigation, and `aria-selected` wiring:

```tsx
import { ChatConversationList } from '@mui/x-chat';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const CompactRow = React.forwardRef(function CompactRow(
  { ownerState, ...props },
  ref,
) {
  const { conversation, selected, unread } = ownerState ?? {};

  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.75,
        cursor: 'pointer',
        bgcolor: selected ? 'action.selected' : 'transparent',
        '&:hover': { bgcolor: selected ? 'action.selected' : 'action.hover' },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: -2,
        },
        borderRadius: 1,
        mx: 0.5,
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: unread ? 'primary.main' : 'transparent',
          flexShrink: 0,
        }}
      />
      <Typography
        variant="body2"
        fontWeight={unread ? 'fontWeightBold' : 'fontWeightRegular'}
        noWrap
        sx={{ flex: 1 }}
      >
        {conversation?.title ?? 'Untitled'}
      </Typography>
    </Box>
  );
});

<ChatConversationList slots={{ item: CompactRow }} />;
```

The `role="option"` and `aria-selected` attributes are set automatically before the slot renders, so they are present on the element even without the default styled item. Spread `...props` to pass them through.

## Full custom item renderer

The `conversation` object in `ownerState` lets you derive everything you need to render a rich row without additional data fetching or selectors. The following example builds a full item renderer that shows an avatar with initials, a bold title for unread conversations, a truncated preview, a human-readable timestamp, and a count badge:

```tsx
import * as React from 'react';
import { ChatConversationList } from '@mui/x-chat';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function formatRelativeTime(iso?: string) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff <= 0) return 'now';
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

const FullCustomRow = React.forwardRef(function FullCustomRow(
  { ownerState, ...props },
  ref,
) {
  const { conversation, selected, unread, focused } = ownerState ?? {};
  const title = conversation?.title ?? 'Untitled';
  const initials = title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1,
        cursor: 'pointer',
        bgcolor: selected ? 'action.selected' : 'transparent',
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: -2,
        },
        '&:hover': {
          bgcolor: selected ? 'action.selected' : 'action.hover',
        },
      }}
    >
      <Badge
        badgeContent={conversation?.unreadCount}
        color="primary"
        max={99}
        invisible={!unread}
      >
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light' }}>
          {initials}
        </Avatar>
      </Badge>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <Typography
            variant="body2"
            fontWeight={unread ? 'fontWeightBold' : 'fontWeightMedium'}
            noWrap
            sx={{ flex: 1 }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ ml: 1, flexShrink: 0 }}
          >
            {formatRelativeTime(conversation?.lastMessageAt)}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" noWrap display="block">
          {conversation?.subtitle ?? 'No messages yet'}
        </Typography>
      </Box>
    </Box>
  );
});
```

Pass it to `ChatBox` via `slotProps.conversationList`:

```tsx
<ChatBox
  slotProps={{
    conversationList: {
      slots: { item: FullCustomRow },
    },
  }}
/>
```

## Styling without slot replacement

If the default row structure suits your product but you only need to change colors or typography, use theme component overrides instead of replacing slots:

```tsx
import type {} from '@mui/x-chat/themeAugmentation';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiChatConversationList: {
      styleOverrides: {
        item: ({ ownerState }) => ({
          borderRadius: 8,
          marginInline: 4,
          ...(ownerState?.selected && {
            backgroundColor: 'var(--mui-palette-primary-main)',
            color: 'var(--mui-palette-primary-contrastText)',
          }),
        }),
        title: ({ ownerState }) => ({
          fontWeight: ownerState?.unread ? 700 : 400,
        }),
      },
    },
  },
});
```

Theme overrides apply globally across your application and are the lowest-friction option when you only need visual adjustments.

## Controlling the list width

The conversation list width is driven by the scroller slot. Override it through `slotProps`:

```tsx
<ChatConversationList
  slotProps={{
    scroller: { sx: { width: 320 } },
  }}
/>
```

Or set the CSS variable on a parent element to control the width from a layout level:

```tsx
<Box sx={{ '--ChatBox-conversationListWidth': '320px' }}>
  <ChatConversationList />
</Box>
```

## Accessibility notes

The default list uses `role="listbox"` on the root and `role="option"` with `aria-selected` on each row. The component manages roving focus: only one row is in the tab order at a time, and `ArrowUp`, `ArrowDown`, `Home`, `End`, and `Enter` are handled automatically.

Custom `item` slot components must forward all `...props` to the DOM element they render so the `role`, `aria-selected`, and keyboard handler props are preserved. Failing to spread `...props` breaks both keyboard navigation and screen-reader semantics.

Pass `aria-label` to the root through `slotProps`:

```tsx
<ChatConversationList slotProps={{ root: { 'aria-label': 'Conversations' } }} />
```

## See also

- [Conversation Header](/x/react-chat/multi-conversation/conversation-header/) for the header bar that accompanies the active thread.
- [Multi-conversation demo](/x/react-chat/demos/team-messaging/) for a two-pane inbox layout using controlled state.
- [Real-Time Sync](/x/react-chat/multi-conversation/real-time-sync/) for pushing conversation updates through subscriptions.

## API

- [`ChatConversationList`](/x/api/chat/chat-conversation-list/)
