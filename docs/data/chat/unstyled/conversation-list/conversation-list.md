---
productId: x-chat
title: Chat - Unstyled conversation list
packageName: '@mui/x-chat-unstyled'
components: ConversationListRoot, ConversationListItem, ConversationListItemAvatar, ConversationListItemMeta, ConversationListItemText
---

# Unstyled conversation list

<p class="description">Render and navigate the conversation rail with structural list primitives, built-in selection behavior, and roving focus.</p>

## Primitive set

The conversation list surface is built from:

- `ConversationList.Root`
- `ConversationList.Item`
- `ConversationList.ItemAvatar`
- `ConversationList.ItemText`
- `ConversationList.ItemMeta`

## `ConversationList.Root`

`ConversationList.Root` reads the current conversation collection from chat state and renders a `listbox` with one `option` per conversation.

It handles:

- active-conversation selection
- click-to-select behavior
- roving focus across items
- `ArrowUp`, `ArrowDown`, `Home`, and `End`
- Enter-to-select for the focused item
- focus restoration when the list remounts

This makes it the main structural entry point for inbox, sidebar, and thread-switching UIs.

The root is also the conversation-pane marker recognized by `Chat.Layout`, so it can be dropped directly into the canonical shell without extra wiring.

## Item composition

Each rendered row is composed from:

- `ItemAvatar` for participant identity
- `ItemText` for title and subtitle
- `ItemMeta` for unread counts and metadata regions

Replace the row or any subpart through `slots` and `slotProps` when a product surface needs a different row layout.

The default structure is useful for inbox-like sidebars, but the slot model makes it easy to adapt to denser support tools, mobile previews, or more visual conversation cards.

```tsx
<ConversationList.Root
  slots={{
    item: MyConversationRow,
    itemAvatar: MyAvatar,
    itemText: MyPrimaryText,
    itemMeta: MyMeta,
  }}
/>
```

Use full row replacement when the overall item structure changes.
Replace only one subpart when the default structure is correct and only a small region needs a custom presentation.

## Owner state

Conversation list item slots receive owner-state flags such as:

- `selected`
- `unread`
- `focused`
- `conversation`

These flags are the main styling hook for active rows, unread emphasis, and focused keyboard states.

Because `conversation` is included in owner state, custom slots can also react to conversation-specific fields such as titles, subtitles, participants, and unread counts.

## Accessibility semantics

The root uses `role="listbox"`.
Each row uses `role="option"` plus `aria-selected`.
This preserves screen-reader semantics while still allowing the list to be visually customized.

The roving-focus model keeps only the focused row tabbable, which matches the keyboard behavior users expect from inbox and picker interfaces.

## Typical placement

The most common composition is:

```tsx
<Chat.Layout>
  <ConversationList.Root aria-label="Conversations" />
  <Thread.Root>{/* thread content */}</Thread.Root>
</Chat.Layout>
```

That gives you:

- active thread selection on click
- keyboard navigation inside the rail
- a structural conversation pane that can be styled as a sidebar, navigation rail, or stacked list

## When to replace slots

Replace slots when you want to:

- change row markup
- add badges or metadata regions
- use custom avatar or preview layouts

Rebuild the conversation rail from headless selectors only when the built-in keyboard and selection model no longer matches the desired interaction.

For the broader page shell, continue with [Layout](/x/react-chat/unstyled/layout/).
For end-to-end inbox patterns, continue with [Two-pane inbox](/x/react-chat/unstyled/examples/two-pane-inbox/).
