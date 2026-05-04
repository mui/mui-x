---
productId: x-chat
title: Chat - Conversation list
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ConversationListRoot, ConversationListItem, ConversationListItemAvatar, ConversationListTitle, ConversationListPreview, ConversationListTimestamp, ConversationListUnreadBadge
---

# Chat - Conversation list

<p class="description">Customize the conversation sidebar — from simple slot overrides to fully custom item renderers — using the Material UI conversation list components.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The conversation list is the sidebar that shows all available conversations and lets users switch between them. `@mui/x-chat` ships `ChatConversationList`, a single component with fully themed styled slots for every visual sub-region: the scroller, each item row, the avatar, the title, the preview line, the timestamp, and the unread badge.

The following demo shows a multi-conversation layout with `features={{ conversationList: true }}` enabled:

{{"demo": "../examples/multi-conversation/MultiConversation.js", "bg": "inline", "defaultCodeOpen": false, "hideToolbar": true}}

## Component anatomy

`ChatConversationList` renders one row per conversation. The default row structure is:

```text
ChatConversationList              ← scrolling listbox (role="listbox")
  [per conversation]
  item                            ← row container (role="option")
    itemAvatar                    ← 40×40 circular avatar
    itemContent                   ← flex column: title + preview
      title                       ← conversation name (bold when unread)
      preview                     ← last message text (caption, truncated)
    timestamp                     ← last-message time (caption, right-aligned)
    unreadBadge                   ← count badge (primary.main background)
```

All visual slots are owned by a single `ChatConversationList` instance. You do not need to compose subcomponents manually — instead you replace any slot through the `slots` prop directly on `ChatConversationList`.

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

Because the Material UI layer fills all slot defaults at instantiation, overriding a single slot only affects that region without disturbing the others.

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

{{"demo": "ThemedAvatar.js", "defaultCodeOpen": false, "bg": "inline"}}

The `ownerState` prop arrives directly on the component because the Material UI layer passes it through `slotProps` using a function form. Destructure it before spreading `...props` to avoid forwarding a non-standard attribute to the DOM.

## Overriding the item content layout

Replace `itemContent` when you want to change the structural layout of the title and preview region — for example to add a participant count or an icon:

{{"demo": "RichItemContent.js", "defaultCodeOpen": false, "bg": "inline"}}

When you replace `itemContent`, the `title` and `preview` slots are no longer rendered (they are children of the default `itemContent`). Render any equivalent content directly inside your custom component.

## Overriding the full item row

Replace the `item` slot to take full control of a row's layout while still benefiting from the built-in selection, keyboard navigation, and `aria-selected` wiring:

{{"demo": "CompactRow.js", "defaultCodeOpen": false, "bg": "inline"}}

The `role="option"` and `aria-selected` attributes are set automatically before the slot renders, so they are present on the element even without the default styled item. Spread `...props` to pass them through.

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

## Full custom item renderer

The `conversation` object in `ownerState` lets you derive everything you need to render a rich row without additional data fetching or selectors. The following example builds a full item renderer that shows an avatar with initials, a bold title for unread conversations, a truncated preview, a human-readable timestamp, and a count badge:

{{"demo": "FullCustomRow.js", "defaultCodeOpen": false, "bg": "inline"}}

## Accessibility notes

The default list uses `role="listbox"` on the root and `role="option"` with `aria-selected` on each row. Roving focus is managed automatically: only one row is in the tab order at a time, and `ArrowUp`, `ArrowDown`, `Home`, `End`, and `Enter` are handled automatically.

Custom `item` slot components must forward all `...props` to the DOM element they render so the `role`, `aria-selected`, and keyboard handler props are preserved. Failing to spread `...props` breaks both keyboard navigation and screen-reader semantics.

Pass `aria-label` to the root through `slotProps`:

```tsx
<ChatConversationList slotProps={{ root: { 'aria-label': 'Conversations' } }} />
```

## See also

- [Thread](/x/react-chat/material/thread/) for the conversation thread surface and its composition model.
- [Customization](/x/react-chat/material/customization/) for the full slot and slotProps reference.
- [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) for a two-pane inbox demo using controlled state.

## API

- [ConversationListRoot](/x/api/chat/conversation-list-root/)
- [ConversationListItem](/x/api/chat/conversation-list-item/)
- [ConversationListItemAvatar](/x/api/chat/conversation-list-item-avatar/)
- [ConversationListTitle](/x/api/chat/conversation-list-title/)
- [ConversationListPreview](/x/api/chat/conversation-list-preview/)
- [ConversationListTimestamp](/x/api/chat/conversation-list-timestamp/)
- [ConversationListUnreadBadge](/x/api/chat/conversation-list-unread-badge/)
