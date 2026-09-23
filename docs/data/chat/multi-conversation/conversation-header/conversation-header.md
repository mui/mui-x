---
productId: x-chat
title: Conversation header
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatConversation, ChatConversationHeader, ChatConversationTitle, ChatConversationSubtitle, ChatConversationHeaderActions, ChatConversationHeaderInfo
---

# Chat - Conversation header

<p class="description">Display the active conversation's title, subtitle, participants, and action buttons using the themed header components.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

`ChatConversationHeader` is a `<header>` element with divider styling. It reads the active conversation through context so every child has access to the same conversation state without additional wiring.

## Interactive playground

Configure the title, subtitle, and trailing actions of `ChatConversationHeader`—every header subcomponent (`ChatConversationHeaderInfo`, `ChatConversationTitle`, `ChatConversationSubtitle`, `ChatConversationHeaderActions`) is exercised in this single demo.

{{"demo": "ChatConversationHeaderPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

```tsx
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationHeaderInfo,
  ChatConversationTitle,
  ChatConversationSubtitle,
  ChatConversationHeaderActions,
} from '@mui/x-chat';
```

## Component anatomy

```text
ChatConversation                    <- thread shell, derives the active conversation
  ChatConversationHeader            <- header bar with divider styling
    ChatConversationHeaderInfo      <- stacks title over subtitle
    ChatConversationTitle           <- conversation name
    ChatConversationSubtitle        <- secondary line (participants, presence, etc.)
    ChatConversationHeaderActions   <- action area (archive, mute, context menu)
```

The header sits at the top of the thread pane and provides the visual identity of the active conversation.

## Setting the title and subtitle

`ChatConversationTitle` renders the active conversation's `title`. `ChatConversationSubtitle` renders its `subtitle`, which can include participant names, a presence indicator, or any descriptive text.

The `ChatConversation` type provides these fields:

```ts
interface ChatConversation {
  id: string;
  title?: string;
  subtitle?: string;
  avatarUrl?: string;
  participants?: ChatUser[];
  unreadCount?: number;
  readState?: ConversationReadState;
  lastMessageAt?: ChatDateTimeString;
  metadata?: ChatConversationMetadata;
}
```

## How conversation state flows

`ChatConversation` provides the conversation state through React context. Each header subcomponent reads it from that context — no props need to be threaded through.

### Conversation state fields

| Field             | Type                       | Description                                  |
| :---------------- | :------------------------- | :------------------------------------------- |
| `conversationId`  | `string \| undefined`      | Currently selected conversation ID           |
| `conversation`    | `ChatConversation \| null` | Full active conversation object, when loaded |
| `hasConversation` | `boolean`                  | Whether the thread currently has a selection |

Use the `hasConversation` flag to hide action buttons or show a placeholder when no conversation is active. `ChatConversationHeader`, `ChatConversationTitle`, `ChatConversationSubtitle`, and `ChatConversationHeaderActions` all receive this same conversation-level state.

## Customizing the action area

`ChatConversationHeaderActions` renders an action area on the right side of the header. Replace it to add archive, mute, or context menu buttons:

```tsx
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArchiveIcon from '@mui/icons-material/Archive';

const CustomActions = React.forwardRef(function CustomActions(
  { ownerState, ...props },
  ref,
) {
  if (!ownerState?.hasConversation) return null;

  return (
    <div ref={ref} {...props}>
      <IconButton size="small" aria-label="Archive conversation">
        <ArchiveIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="More options">
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </div>
  );
});
```

{{"demo": "CustomHeaderActions.js", "bg": "inline"}}

:::info
Icon-only `IconButton`s **must** carry an `aria-label` (as the recipes above do) so screen readers announce each action. The header itself is a native `<header>` element. See the [Accessibility](/x/react-chat/accessibility/) page for the full keyboard and screen reader model.
:::

## Participants

The `participants` array on `ChatConversation` carries `ChatUser` objects with `displayName`, `avatarUrl`, and `isOnline` fields. Use these in a custom subtitle slot to show a participant list or online status:

```tsx
const ParticipantSubtitle = React.forwardRef(function ParticipantSubtitle(
  { ownerState, ...props },
  ref,
) {
  const participants = ownerState?.conversation?.participants ?? [];
  const onlineCount = participants.filter((p) => p.isOnline).length;

  return (
    <span ref={ref} {...props}>
      {participants.length} participants ({onlineCount} online)
    </span>
  );
});
```

Attach it through the `subtitle` slot:

```tsx
<ChatConversationSubtitle slots={{ subtitle: ParticipantSubtitle }} />
```

## Slots and classes

Each header subcomponent exposes a single slot key for overriding its element, a CSS class for styling, and a corresponding `ChatBox` slot key:

| Component                       | Slot key     | CSS class                            | ChatBox slot key            |
| :------------------------------ | :----------- | :----------------------------------- | :-------------------------- |
| `ChatConversationHeader`        | `header`     | `.MuiChatConversation-header`        | `conversationHeader`        |
| `ChatConversationHeaderInfo`    | `headerInfo` | `.MuiChatConversation-headerInfo`    | `conversationHeaderInfo`    |
| `ChatConversationTitle`         | `title`      | `.MuiChatConversation-title`         | `conversationTitle`         |
| `ChatConversationSubtitle`      | `subtitle`   | `.MuiChatConversation-subtitle`      | `conversationSubtitle`      |
| `ChatConversationHeaderActions` | `actions`    | `.MuiChatConversation-headerActions` | `conversationHeaderActions` |

`ChatConversationHeaderActions`'s slot key is `actions` even though its class is `headerActions`.

See the generated API pages for the full prop reference: [ChatConversationHeader API](/x/api/chat/chat-conversation-header/), [ChatConversationHeaderInfo API](/x/api/chat/chat-conversation-header-info/), [ChatConversationTitle API](/x/api/chat/chat-conversation-title/), [ChatConversationSubtitle API](/x/api/chat/chat-conversation-subtitle/), and [ChatConversationHeaderActions API](/x/api/chat/chat-conversation-header-actions/).

## Overriding a header slot

The most targeted customization is to replace the element type on one slot while keeping everything else:

```tsx
import { ChatConversationHeader } from '@mui/x-chat';
import { styled } from '@mui/material/styles';

const GradientHeader = styled('header')(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  color: theme.palette.primary.contrastText,
  '& *': { color: 'inherit' },
}));

function CustomHeader(props) {
  return <ChatConversationHeader {...props} slots={{ header: GradientHeader }} />;
}
```

Pass `CustomHeader` through `ChatBox`'s `slots.conversationHeader` prop:

```tsx
<ChatBox slots={{ conversationHeader: CustomHeader }} />
```

{{"demo": "GradientHeader.js", "bg": "inline"}}

## Customizing the title with conversation state

The `ownerState` prop received by slot components carries the full conversation context.
Use it to render dynamic content derived from the active conversation. `ownerState` is injected by the component itself with the shape shown in [Conversation state fields](#conversation-state-fields); passing your own `ownerState` prop to these components has no effect.

`conversation.metadata` is empty by default — augment `ChatConversationMetadata` with your app's fields (here, an illustrative `memberCount`). See [Type augmentation](/x/react-chat/core/examples/type-augmentation/).

```tsx
import { ChatConversationTitle } from '@mui/x-chat';

const LiveTitle = React.forwardRef(function LiveTitle(
  { ownerState, children, ...props },
  ref,
) {
  const memberCount = ownerState?.conversation?.metadata?.memberCount;
  return (
    <div ref={ref} {...props}>
      {ownerState?.conversation?.title ?? 'No conversation selected'}
      {memberCount != null && (
        <span style={{ fontWeight: 400, marginLeft: 8 }}>{memberCount} members</span>
      )}
    </div>
  );
});

function CustomConversationTitle(props) {
  return <ChatConversationTitle {...props} slots={{ title: LiveTitle }} />;
}
```

The component passes the default content — `conversation.title` — to your slot as `children`; render it or replace it as shown.

{{"demo": "LiveTitle.js", "bg": "inline"}}

## Recomposing the header from scratch

When you need to insert additional content inside the header—for example, a typing indicator or a custom divider—assemble the header from individual Material UI components directly:

```tsx
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationHeaderInfo,
  ChatConversationTitle,
  ChatConversationSubtitle,
  ChatConversationHeaderActions,
} from '@mui/x-chat';
import Box from '@mui/material/Box';

function CustomThread() {
  return (
    <ChatConversation sx={{ height: '100%' }}>
      <ChatConversationHeader>
        <ChatConversationHeaderInfo>
          <ChatConversationTitle />
          <ChatConversationSubtitle />
        </ChatConversationHeaderInfo>
        <Box sx={{ flex: 1 }} />
        <ChatConversationHeaderActions />
      </ChatConversationHeader>
      {/* rest of the thread */}
    </ChatConversation>
  );
}
```

## See also

- [Conversation list](/x/react-chat/multi-conversation/conversation-list/) for the sidebar that lists conversations.
- [Real-time sync](/x/react-chat/multi-conversation/real-time-sync/) for live updates to conversation metadata displayed in the header.
- [Layout](/x/react-chat/basics/layout/) for the full thread anatomy including message list and composer.
