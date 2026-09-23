---
productId: x-chat
title: Chat - Headless conversation list
packageName: '@mui/x-chat/headless'
components: ConversationListRoot, ConversationListItem, ConversationListItemAvatar, ConversationListTitle, ConversationListPreview, ConversationListTimestamp, ConversationListUnreadBadge
githubLabel: 'scope: chat'
---

# Chat - Headless conversation list

<p class="description">Render and navigate the conversation rail with structural list primitives, built-in selection behavior, and roving focus.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

{{"demo": "../examples/two-pane-inbox/TwoPaneInbox.js", "hideToolbar": true}}

## Conversation list primitives

The conversation list surface is built from:

- `ConversationList.Root`
- `ConversationList.Item`
- `ConversationList.ItemAvatar`
- `ConversationList.ItemContent`
- `ConversationList.Title`
- `ConversationList.Preview`
- `ConversationList.Timestamp`
- `ConversationList.UnreadBadge`

## Conversation list root

`ConversationList.Root` reads the current conversation collection from chat state and renders a `listbox` with one `option` per conversation.

It handles:

- Active-conversation selection
- Click-to-select behavior
- Roving focus across items
- Keyboard navigation with `ArrowUp`, `ArrowDown`, `Home`, and `End`
- `Enter` to select the focused item
- Focus restoration when the list remounts

The root is the main structural entry point for inbox, sidebar, and thread-switching UIs.

The root is also the conversation-pane marker recognized by `Chat.Layout`, so it can be dropped directly into the canonical shell without extra wiring.

## Item composition

Each rendered row is composed from:

- `ConversationList.ItemAvatar` for participant identity
- `ConversationList.ItemContent` to group title and preview
- `ConversationList.Title` for the conversation name
- `ConversationList.Preview` for the last message subtitle
- `ConversationList.Timestamp` for the last-message time
- `ConversationList.UnreadBadge` for the unread count

Replace the row or any subpart through `slots` and `slotProps` when a product surface needs a different row layout.

The default structure fits inbox-like sidebars; the slot model adapts to denser support tools, mobile previews, or visual conversation cards.

```tsx
<ConversationList.Root
  slots={{
    item: MyConversationRow,
    itemAvatar: MyAvatar,
    itemContent: MyItemContent,
    title: MyTitle,
    preview: MyPreview,
    timestamp: MyTimestamp,
    unreadBadge: MyBadge,
  }}
/>
```

Use full row replacement when the overall item structure changes.
Replace only one subpart when the default structure is correct and only a small region needs a custom presentation.

## Owner state

Conversation list item slots receive owner-state flags such as:

- `selected` — whether the row is the active conversation
- `unread` — whether the row has unread messages
- `focused` — whether the row currently holds roving focus
- `conversation` — the full conversation object

These flags are the main styling hook for active rows, unread emphasis, and focused keyboard states.

Because `conversation` is included in owner state, custom slots can also react to conversation-specific fields such as titles, subtitles, participants, and unread counts.

## Accessibility

The root uses `role="listbox"`.
Each row uses `role="option"` plus `aria-selected`.
This preserves screen-reader semantics while still allowing the list to be visually customized.

The roving-focus model keeps only the focused row tabbable, which matches the keyboard behavior users expect from inbox and picker interfaces.

## Typical placement

The most common composition is:

```tsx
<Chat.Layout>
  <ConversationList.Root aria-label="Conversations" />
  <Conversation.Root>{/* thread content */}</Conversation.Root>
</Chat.Layout>
```

That gives you:

- active thread selection on click
- keyboard navigation inside the rail
- a structural conversation pane that can be styled as a sidebar, navigation rail, or stacked list

## Replacing slots

Replace slots when you want to:

- change row markup
- add badges or metadata regions
- use custom avatar or preview layouts

Rebuild the conversation rail from headless selectors only when the built-in keyboard and selection model no longer matches the desired interaction.

See [Layout](/x/react-chat/headless/layout/) for details.
See [Two-pane inbox](/x/react-chat/headless/examples/two-pane-inbox/) for an end-to-end inbox pattern.

## API

- [ConversationListRoot](/x/api/chat/conversation-list-root/)
- [ConversationListItem](/x/api/chat/conversation-list-item/)
- [ConversationListItemAvatar](/x/api/chat/conversation-list-item-avatar/)
- [ConversationListTitle](/x/api/chat/conversation-list-title/)
- [ConversationListPreview](/x/api/chat/conversation-list-preview/)
- [ConversationListTimestamp](/x/api/chat/conversation-list-timestamp/)
- [ConversationListUnreadBadge](/x/api/chat/conversation-list-unread-badge/)
