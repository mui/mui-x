---
productId: x-chat
title: Accessibility
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Accessibility

<p class="description">Learn how MUI X Chat implements keyboard navigation, landmarks, and screen reader announcements.</p>

## Keyboard navigation

The message list is a single Tab stop: a roving tabindex over the `role="article"` messages keeps only one message in the tab order at a time, so tabbing from the composer to the rest of the application never walks through every message.

{{"demo": "../material/message-list/KeyboardNavigation.js", "defaultCodeOpen": false, "bg": "inline"}}

| Key                                              | Action                                                                                           |
| :----------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Enter or leave the message list (a single stop)                                                  |
| <kbd>Arrow Up</kbd> / <kbd>Arrow Down</kbd>      | Move focus to the previous / next message                                                        |
| <kbd>Home</kbd> / <kbd>End</kbd>                 | Move focus to the first / latest message                                                         |
| <kbd>Page Up</kbd> / <kbd>Page Down</kbd>        | Native scrolling (kept unbound so a message taller than the viewport stays readable by keyboard) |
| <kbd>Enter</kbd>                                 | Drill into the focused message's controls (links, copy buttons, tool output, actions)            |
| <kbd>Escape</kbd>                                | Return from a message's controls to the message                                                  |

Before the user interacts, the tab stop tracks the newest message.
The tab stop is remembered per list, so leaving and re-entering the message list returns focus to the same message.

## Drill-in lifecycle

Interactive content inside messages—links in Markdown, code-block copy buttons, tool and reasoning disclosures, source and file links—stays out of the tab order until the user drills into the focused message with <kbd>Enter</kbd>, and leaves it again on <kbd>Escape</kbd>.
All controls remain mouse-clickable throughout.
Message actions are additionally hidden (`visibility: hidden`) until the message is hovered or drilled into.

When the user drills back out with <kbd>Escape</kbd>, focus returns to the message that owned the controls. Because the tab stop is remembered per list, re-entering the list later restores focus to the same message.

## Landmarks

The chat surface exposes labeled landmarks so assistive technology can jump between its regions:

- The thread is a `role="region"` labeled by the `threadLandmarkLabel` locale key.
- The composer is a labeled `form` (the `composerLandmarkLabel` locale key).
- The conversation list is a `role="navigation"` region labeled by `conversationListLandmarkLabel`.
- On small screens, the conversation list opens in a `role="dialog"` with `aria-modal="true"`.

## Screen reader announcements

- The scroller element has `role="log"` and `aria-live="polite"`, so newly arriving complete messages are announced.
- A streaming message carries `aria-busy="true"` while it streams, hinting assistive technology to defer reading it until it completes.
- A visually hidden `role="status"` region announces streaming transitions—"Assistant is responding" and "Response complete"—exactly once each, never per streamed token.
- Each message is a `role="article"` labeled "Message from {author}".
- Date dividers use `role="separator"`.

The announcement strings and labels come from the locale text system, so they localize with the rest of the UI: `messageListLabel` for the list, `responseStreamingStartedAnnouncement` and `responseStreamingCompletedAnnouncement` for the streaming announcer, and `threadLandmarkLabel`, `composerLandmarkLabel`, and `conversationListLandmarkLabel` for the landmarks.

## Reduced motion

The loading skeleton's shimmer animation pauses automatically when the user requests reduced motion (`prefers-reduced-motion: reduce`).
The skeleton itself is decorative and sets no ARIA, so you wire the loading state up explicitly—see [Loading and empty states](/x/react-chat/display/loading-and-empty-states/) for the `aria-busy` and `role="status"` pattern.

## Opting out and custom controls

Set `enableRovingFocus={false}` on the message list to opt out entirely, for example when rendering fully custom rows that manage focus themselves.

Custom interactive content rendered inside a message can participate in the drill-in model with the `useMessageContentTabIndex()` hook (or `useMessageActionable()` for full control), both available from `@mui/x-chat/headless`:

```tsx
function CustomControl() {
  const tabIndex = useMessageContentTabIndex();
  return (
    <button type="button" tabIndex={tabIndex}>
      …
    </button>
  );
}
```

Outside a roving message list both hooks leave the natural tab order untouched, so the same component works in standalone message compositions.

## See also

- [Message list—Accessibility](/x/react-chat/material/message-list/#accessibility) for the message-list keyboard table and drill-in specifics.
- [Messages](/x/react-chat/basics/messages/#accessibility) for the summary alongside the message API.
- [Conversation list—Accessibility notes](/x/react-chat/multi-conversation/conversation-list/#accessibility-notes) for the sidebar's roving listbox.
