---
productId: x-chat
title: Variants & Density
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Variants & Density

<p class="description">Switch between the default bubble layout and a compact messenger-style layout, and control vertical spacing with the density prop.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

## Variants

`ChatBox` supports two visual variants that control how messages are laid out: **default** and **compact**.

### Default variant

The default variant renders messages as colored bubbles.
The default variant right-aligns user messages with a primary-colored background and left-aligns assistant messages with a neutral background.
Timestamps appear below each message.
This is the standard layout used by most AI chat interfaces.

### Compact variant

Set `variant="compact"` on `ChatBox` to switch to a dense, messenger-style layout:

```tsx
<ChatBox variant="compact" adapter={adapter} />
```

Compact mode applies the following changes to the message list:

- **No bubbles** — messages render as plain text without background colors or padding.
- **Left-aligned** — all messages are left-aligned regardless of role (no right-aligned user messages).
- **Group header timestamps** — the timestamp moves from below each message to the group header, displayed next to the author name.
- **Avatars preserved** — avatars remain visible for the first message in each group.

When set on `ChatBox`, the variant automatically applies to the conversation list as well.

{{"demo": "../../material/message-list/CompactVariant.js", "defaultCodeOpen": false, "bg": "inline"}}

### When to use each variant

| Scenario                                            | Recommended variant |
| :-------------------------------------------------- | :------------------ |
| AI assistant interface (single bot, longer replies) | Default             |
| Team messaging or multi-party chat                  | Compact             |
| Customer support widget                             | Default             |
| Slack/Discord-style channel view                    | Compact             |
| Code review or agentic workflows                    | Default             |

The compact variant is particularly effective for conversations with many short messages from multiple participants, where bubbles would create excessive visual noise.

## Density

The `density` prop controls the vertical spacing between messages independently of the variant.
Three values are available — `compact`, `standard` (default), and `comfortable` — mirroring the density model used in [Data Grid](/x/react-data-grid/accessibility/#density).

```tsx
<ChatBox density="compact" adapter={adapter} />
<ChatBox density="standard" adapter={adapter} />
<ChatBox density="comfortable" adapter={adapter} />
```

Use the toggle in the demo below to compare the three density levels:

{{"demo": "../../material/message-list/DensityProp.js", "defaultCodeOpen": false, "bg": "inline"}}

### Density effects

| Density       | Vertical gap between messages | Use case                               |
| :------------ | :---------------------------- | :------------------------------------- |
| `compact`     | Minimal                       | Dense information displays, dashboards |
| `standard`    | Default                       | General-purpose chat                   |
| `comfortable` | Generous                      | Accessibility, relaxed reading         |

### Combining variant and density

The `density` prop is independent of `variant` — you can combine `variant="compact"` with any density value:

```tsx
{
  /* Dense messenger-style layout with minimal spacing */
}
<ChatBox variant="compact" density="compact" adapter={adapter} />;

{
  /* Dense messenger-style layout with generous spacing */
}
<ChatBox variant="compact" density="comfortable" adapter={adapter} />;
```

This independence gives you fine-grained control over both the visual style (bubbles vs. plain text) and the spatial rhythm (tight vs. relaxed) of the chat surface.

## API

- [`ChatBox`](/x/api/chat/chat-box/)

## Next steps

- [ChatBox](/x/react-chat/basics/chatbox/) — the all-in-one component and its configuration
- [Messages](/x/react-chat/basics/messages/) — the message data model and list rendering
- [Layout](/x/react-chat/basics/layout/) — the two-pane structure and thread-only mode
- [Message list reference](/x/react-chat/basics/messages/) — full API details, slots, and imperative scrolling
