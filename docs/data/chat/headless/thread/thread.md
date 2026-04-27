---
productId: x-chat
title: Chat - Headless thread
packageName: '@mui/x-chat/headless'
components: ConversationRoot, ConversationHeader, ConversationTitle, ConversationSubtitle, ConversationHeaderActions
githubLabel: 'scope: chat'
---

# Chat - Headless thread

<p class="description">Build the active conversation surface from thread primitives that derive their state from the selected conversation.</p>

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

## Primitive set

The thread surface is built from:

- `Conversation.Root`
- `Conversation.Header`
- `Conversation.Title`
- `Conversation.Subtitle`
- `Conversation.HeaderActions`

## Wrapping the active conversation

`Conversation.Root` derives the active conversation from chat state and exposes it through thread owner state and context.

It is responsible for:

- tracking the active conversation id
- resolving the active conversation object
- exposing `hasConversation` for empty or loading thread states
- acting as the thread pane marker for `Chat.Layout`

Because `Conversation.Root` sits on top of chat state instead of receiving the active conversation as a prop, it stays synchronized with conversation switching automatically.

## Header composition

`Conversation.Header` is a structural wrapper for thread header content.
The default thread stack often includes:

- `Conversation.Title`
- `Conversation.Subtitle`
- `Conversation.HeaderActions`
- `Indicators.TypingIndicator`

Because the thread primitives all derive from the same context, header subparts can stay simple and focus on rendering.

That means custom title, subtitle, or action slots can react to the active conversation without repeating selector logic in every header component.

## Empty and missing-thread states

`Conversation.Root` exposes `hasConversation` through owner state.
Use that to switch between:

- a fully populated thread
- a placeholder that prompts the user to select a conversation
- a custom empty state for inbox views that have no active selection

For example, a custom root slot can render a thread placeholder when no active conversation exists while still keeping the same overall page structure.

## Owner state

Thread slots derive owner state from the active conversation, including:

- `conversationId`
- `conversation`
- `hasConversation`

This is useful for empty-thread layouts, custom action areas, and conditional header styling.

Typical owner-state-driven patterns include:

- changing spacing when the thread is empty
- hiding action buttons until a conversation is active
- switching between subtitle variants based on the active thread metadata

## Conversation subparts

### Displaying the title

`Conversation.Title` is the structural slot for the conversation title.
Use it when the active conversation already carries a title and the thread header should stay minimal.

### Displaying the subtitle

`Conversation.Subtitle` is the structural slot for secondary thread text such as participant names, preview metadata, or presence-driven summaries.

### Defining header actions

`Conversation.HeaderActions` is the structural action region for controls such as archive, mute, or context-specific thread actions.
It is intentionally light on policy so the app can decide which actions belong there.

## Recommended patterns

- Use `Conversation.Root` as the shell for the active conversation region.
- Keep header composition inside `Conversation.Root` so title, subtitle, and actions stay in sync with the active conversation.
- Pair `Conversation.Root` with `MessageList.Root` and `Composer.Root` for the canonical thread surface.

## See also

- Continue with [Message list](/x/react-chat/headless/message-list/) for the scrolling and history behavior inside the thread.
- Continue with [Indicators](/x/react-chat/headless/indicators/) for thread-level affordances such as typing feedback.
- Continue with [Two-pane inbox](/x/react-chat/headless/examples/two-pane-inbox/) for the full thread-in-layout demo.

## API

- [ConversationRoot](/x/api/chat/conversation-root/)
- [ConversationHeader](/x/api/chat/conversation-header/)
- [ConversationTitle](/x/api/chat/conversation-title/)
- [ConversationSubtitle](/x/api/chat/conversation-subtitle/)
- [ConversationHeaderActions](/x/api/chat/conversation-header-actions/)
