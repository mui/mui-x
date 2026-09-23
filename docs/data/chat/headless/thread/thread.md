---
productId: x-chat
title: Chat - Headless thread
packageName: '@mui/x-chat/headless'
components: ConversationRoot, ConversationHeader, ConversationTitle, ConversationSubtitle, ConversationHeaderActions
githubLabel: 'scope: chat'
---

# Chat - Headless thread

<p class="description">Compose the active conversation surface from headless thread primitives synced to the selected conversation.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

{{"demo": "../examples/two-pane-inbox/TwoPaneInbox.js", "hideToolbar": true}}

```tsx
import {
  Composer,
  MessageGroup,
  MessageList,
  Conversation,
} from '@mui/x-chat/headless';

<Conversation.Root>
  <Conversation.Header>
    <Conversation.Title />
    <Conversation.Subtitle />
    <Conversation.HeaderActions />
  </Conversation.Header>
  <MessageList.Root
    renderItem={({ id, index }) => <MessageGroup index={index} messageId={id} />}
  />
  <Composer.Root>
    <Composer.TextArea />
    <Composer.SendButton />
  </Composer.Root>
</Conversation.Root>;
```

## Thread primitives

The thread surface is built from:

- `Conversation.Root`
- `Conversation.Header`
- `Conversation.Title`
- `Conversation.Subtitle`
- `Conversation.HeaderActions`

## Anchoring the active conversation

`Conversation.Root` derives the active conversation from chat state and exposes it through thread owner state and context.

It is responsible for:

- Track the active conversation ID.
- Resolve the active conversation object.
- Expose `hasConversation` for empty or loading thread states.
- Act as the thread pane marker for `Chat.Layout`.

Because `Conversation.Root` reads from chat state instead of taking the active conversation as a prop, it stays in sync as conversations switch.

## Header composition

`Conversation.Header` is a structural wrapper for thread header content.
The default thread stack often includes:

- `Conversation.Title`.
- `Conversation.Subtitle`.
- `Conversation.HeaderActions`.
- `Indicators.TypingIndicator`.

Because the thread primitives all share the same context, header subparts stay simple and focus on rendering.
Custom title, subtitle, or action slots can react to the active conversation without repeating selector logic in every header component.

## Empty and missing-thread states

`Conversation.Root` exposes `hasConversation` through owner state.
Use that to switch between:

- A fully populated thread.
- A placeholder that prompts the user to select a conversation.
- A custom empty state for inbox views that have no active selection.

A custom root slot can render a thread placeholder when no active conversation exists, keeping the surrounding page structure intact.

## Owner state

Thread slots derive owner state from the active conversation, including:

- `conversationId`.
- `conversation`.
- `hasConversation`.

This is useful for empty-thread layouts, custom action areas, and conditional header styling.

Typical owner-state-driven patterns include:

- Change spacing when the thread is empty.
- Hide action buttons until a conversation is active.
- Switch between subtitle variants based on the active thread metadata.

## Header subparts reference

### Rendering the conversation title

`Conversation.Title` is the structural slot for the conversation title.
Use it when the active conversation already carries a title and the thread header should stay minimal.

### Rendering the subtitle

`Conversation.Subtitle` is the structural slot for secondary thread text such as participant names, preview metadata, or presence-driven summaries.

### Rendering the header actions

`Conversation.HeaderActions` is the action region for controls such as archive, mute, or thread-context actions.
Decide which actions belong there — the slot is intentionally policy-free.

## Recommended patterns

- Use `Conversation.Root` as the shell for the active conversation region.
- Keep header composition inside `Conversation.Root` so title, subtitle, and actions stay in sync with the active conversation.
- Pair `Conversation.Root` with `MessageList.Root` and `Composer.Root` for the canonical thread surface.

## See also

- See [Message list](/x/react-chat/headless/message-list/) for scrolling and history behavior inside the thread.
- See [Indicators](/x/react-chat/headless/indicators/) for thread-level affordances such as typing feedback.
- See [Two-pane inbox](/x/react-chat/headless/examples/two-pane-inbox/) for the thread-in-layout demo.

## API

- [ConversationRoot](/x/api/chat/conversation-root/)
- [ConversationHeader](/x/api/chat/conversation-header/)
- [ConversationTitle](/x/api/chat/conversation-title/)
- [ConversationSubtitle](/x/api/chat/conversation-subtitle/)
- [ConversationHeaderActions](/x/api/chat/conversation-header-actions/)
