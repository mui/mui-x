---
productId: x-chat
title: Conversation List
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatConversationList
---

# Chat - Conversation List

<p class="description">Render a sidebar that lists all conversations and lets users switch between them.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

`ChatConversationList` is the inbox sidebar for multi-conversation apps — reach for it when users manage several threads; a single-thread assistant can use `ChatBox` without it. It's a single component with styled slots for every visual sub-region: the scroller, each item row, the avatar, the title, the preview line, the timestamp, the unread badge, and the per-row actions button.

## Interactive playground

Toggle the list variant, conversation count, and unread badges:

{{"demo": "ChatConversationListPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

The example below shows a complete two-pane inbox using controlled state:

{{"demo": "../../material/examples/multi-conversation/MultiConversation.js", "bg": "inline", "defaultCodeOpen": false}}

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

All visual slots are owned by a single `ChatConversationList` instance. You do not need to compose subcomponents manually—instead you replace any slot through the `slots` prop directly on `ChatConversationList`.

## Variants

The `variant` prop switches the row layout. It accepts `'default'` (the default) and `'compact'`:

- `'default'` renders the full row: avatar, title, preview line, timestamp, and unread badge.
- `'compact'` renders a denser row: the `unreadBadge` collapses to an 8px dot, `itemAvatar`, `preview`, and `timestamp` are not rendered, and the `itemActions` button appears on hover or keyboard focus.

The compact row structure is:

```text
ChatConversationList              <- scrolling listbox (role="listbox")
  [per conversation]
  item                            <- row container (role="option")
    unreadBadge                   <- collapses to an 8px dot
    itemContent                   <- flex column
      title                       <- conversation name (bold when unread)
    itemActions                   <- 3-dot button, revealed on hover/focus
```

When `variant="compact"`, the root carries the `.MuiChatConversationList-compact` class hook, so you can target the compact layout from a theme override or `sx`.

{{"demo": "ConversationListVariants.js", "bg": "inline", "defaultCodeOpen": false}}

## Slot reference

| Slot key         | Default component                     | CSS class                                  | Purpose                                                                                                  |
| :--------------- | :------------------------------------ | :----------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| `root`           | styled `div`                          | `.MuiChatConversationList-root`            | The outer list container                                                                                 |
| `scroller`       | styled `div`                          | `.MuiChatConversationList-scroller`        | Scrolling column with `border-right`; its width is set by the `ChatBox` layout                           |
| `viewport`       | styled `div`                          | —                                          | Scrollable overflow container                                                                            |
| `scrollbar`      | no-op `div`                           | —                                          | Custom scrollbar track (replaced by native overflow)                                                     |
| `scrollbarThumb` | no-op `div`                           | —                                          | Custom scrollbar thumb                                                                                   |
| `item`           | styled `div`                          | `.MuiChatConversationList-item`            | Individual row, receives selection/focus styles                                                          |
| `itemAvatar`     | `ConversationListItemAvatar` wrapper  | `.MuiChatConversationList-itemAvatar`      | Circular avatar element                                                                                  |
| `itemContent`    | `ConversationListItemContent` wrapper | `.MuiChatConversationList-itemContent`     | Title + preview column                                                                                   |
| `title`          | `ConversationListTitle` wrapper       | `.MuiChatConversationList-itemTitle`       | Conversation name text                                                                                   |
| `preview`        | `ConversationListPreview` wrapper     | `.MuiChatConversationList-itemPreview`     | Preview line text                                                                                        |
| `timestamp`      | `ConversationListTimestamp` wrapper   | `.MuiChatConversationList-itemTimestamp`   | Timestamp text                                                                                           |
| `unreadBadge`    | `ConversationListUnreadBadge` wrapper | `.MuiChatConversationList-itemUnreadBadge` | Unread count pill                                                                                        |
| `itemActions`    | `ConversationListItemActions` wrapper | `.MuiChatConversationList-itemActions`     | Per-row actions affordance (3-dot button); rendered only in the compact variant, revealed on hover/focus |

Sub-slot class suffixes carry an `item` prefix that the slot keys drop — `slots.title` styles via `.MuiChatConversationList-itemTitle`.

The `itemActions` slot only renders when `variant="compact"`; replace it to attach per-row menus (rename, delete, and so on). See [Variants](#variants) for the compact row layout.

Because `ChatConversationList` provides a default for every slot, overriding a single slot only affects that region without disturbing the others.

For the exhaustive prop and slot listing, see the [ChatConversationList API reference](/x/api/chat/chat-conversation-list/).

## Switching conversations

The conversation list is rendered when `ChatBox` is given `features={{ conversationList: true }}`.
Clicking a row calls `onActiveConversationChange` with the conversation ID. The callback receives `string | undefined` — it fires with `undefined` when the active conversation is cleared (for example, when the user navigates back from the thread pane on narrow layouts, or when the active conversation is removed by a real-time event), so guard before assigning it to non-nullable state.
Use controlled state to manage the active conversation:

```tsx
const [activeConversationId, setActiveConversationId] = React.useState('thread-a');

<ChatBox
  activeConversationId={activeConversationId}
  onActiveConversationChange={(nextId) => {
    if (nextId) {
      setActiveConversationId(nextId);
    }
  }}
  conversations={conversations}
  features={{ conversationList: true }}
/>;
```

If you omit that feature flag, `ChatBox` renders the thread pane directly without a sidebar.

:::info
With an empty `conversations` array the list renders an empty listbox — there is no built-in empty-state slot. Render your own placeholder (for example, a "No conversations yet" panel) alongside or instead of the list when `conversations.length === 0`. See [Loading and empty states](/x/react-chat/display/loading-and-empty-states/) for patterns.
:::

## Reading row state through ownerState

The item and all its sub-slots receive an `ownerState` prop that carries the current row's interaction state alongside the full conversation object.

### Item ownerState

| Field          | Type                                  | Description                             |
| :------------- | :------------------------------------ | :-------------------------------------- |
| `selected`     | `boolean`                             | This conversation is the active thread  |
| `unread`       | `boolean`                             | The conversation has unread messages    |
| `focused`      | `boolean`                             | This row currently has keyboard focus   |
| `conversation` | `ChatConversation`                    | The full conversation data object       |
| `variant`      | `'default' \| 'compact' \| undefined` | The list variant the row is rendered in |

The `selected` flag drives the row background (`palette.action.selected`).
The `unread` flag drives bold title typography.
A row counts as unread when `conversation.unreadCount` is greater than 0 or `conversation.readState` is `'unread'` — set either field on the conversation object.
The `focused` flag drives the `focus-visible` outline for keyboard accessibility.

Because the full `conversation` object is included, custom slot components can directly read fields such as `conversation.title`, `conversation.metadata`, `conversation.unreadCount`, and `conversation.lastMessageAt` without additional selectors.
Custom `item` slots can branch on `ownerState.variant` to render a different layout per variant (see [Variants](#variants)).

### Root ownerState

| Field                  | Type                     | Description                        |
| :--------------------- | :----------------------- | :--------------------------------- |
| `conversationCount`    | `number`                 | Total number of conversations      |
| `activeConversationId` | `string \| undefined`    | Currently selected conversation ID |
| `variant`              | `'default' \| 'compact'` | The list variant currently applied |

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
        bgcolor: ownerState?.selected ? 'primary.main' : 'grey.300',
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

Every slot component receives `ownerState` as a prop. Destructure it before spreading `...props` to avoid forwarding a non-standard attribute to the DOM.

## Overriding the item content layout

Replace `itemContent` when you want to change the structural layout of the title and preview region—for example, to add a participant count or an icon:

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
          noWrap
          sx={{
            fontWeight: unread ? 'fontWeightBold' : 'fontWeightMedium',
            flex: 1,
          }}
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
        noWrap
        sx={{ fontWeight: unread ? 'fontWeightBold' : 'fontWeightRegular', flex: 1 }}
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

The `conversation` object in `ownerState` lets you derive everything you need to render a rich row without additional data fetching or selectors. The demo below builds a full item renderer that shows an avatar with initials, a bold title for unread conversations, a truncated preview, a human-readable timestamp, and a count badge:

{{"demo": "ConversationListFullCustomRow.js", "bg": "inline", "defaultCodeOpen": false}}

A small helper turns the ISO `lastMessageAt` field into a relative label:

```tsx
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
```

Inside the row component, destructure `ownerState` and spread `...props` so the built-in selection, `role="option"`, `aria-selected`, and keyboard handlers survive:

```tsx
const FullCustomRow = React.forwardRef(function FullCustomRow(
  { ownerState, ...props },
  ref,
) {
  const { conversation, selected, unread } = ownerState ?? {};
  // ...derive initials, render Badge + Avatar + title + timestamp...
  return (
    <Box
      ref={ref}
      {...props}
      sx={
        {
          /* row layout */
        }
      }
    />
  );
});
```

Pass it to `ChatConversationList` through the `item` slot — or to `ChatBox` via `slotProps.conversationList`:

```tsx
<ChatConversationList slots={{ item: FullCustomRow }} />;

<ChatBox
  slotProps={{
    conversationList: {
      slots: { item: FullCustomRow },
    },
  }}
/>;
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

Theme overrides apply globally across the application and are the lowest-friction option when only visual adjustments are needed.

## Controlling the list width

The conversation list width is driven by the scroller slot. Override it through `slotProps`:

```tsx
<ChatConversationList
  slotProps={{
    scroller: { sx: { width: 320 } },
  }}
/>
```

Or set the `--ChatBox-conversationListWidth` CSS variable on `ChatBox` to control the width from a layout level:

```tsx
<ChatBox
  features={{ conversationList: true }}
  sx={{ '--ChatBox-conversationListWidth': '320px' }}
/>
```

The CSS variable is read by `ChatBox`'s layout pane — when rendering `ChatConversationList` standalone, size it through the `scroller` slot or its parent container instead.

## Accessibility notes

The default list uses `role="listbox"` on the root and `role="option"` with `aria-selected` on each row. The component manages roving focus: only one row is in the tab order at a time, and `ArrowUp`, `ArrowDown`, `Home`, `End`, and `Enter` are handled automatically.

Custom `item` slot components must forward all `...props` to the DOM element they render so the `role`, `aria-selected`, and keyboard handler props are preserved. Failing to spread `...props` breaks both keyboard navigation and screen-reader semantics.

Pass `aria-label` to the root through `slotProps`:

```tsx
<ChatConversationList slotProps={{ root: { 'aria-label': 'Conversations' } }} />
```

The [message list](/x/react-chat/accessibility/) shares the same roving-focus model, so both lists feel identical to keyboard users.

## See also

- [Conversation header](/x/react-chat/multi-conversation/conversation-header/) for details on the header bar that accompanies the active thread.
- [Multi-conversation example](/x/react-chat/material/examples/multi-conversation/) for a two-pane inbox layout using controlled state.
- [Real-time sync](/x/react-chat/multi-conversation/real-time-sync/) for pushing conversation updates through subscriptions.
