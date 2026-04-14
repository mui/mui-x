---
productId: x-chat
title: Conversation Header
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatConversation, ChatConversationHeader, ChatConversationTitle, ChatConversationSubtitle, ChatConversationHeaderActions, ChatConversationHeaderInfo
---

# Chat - Conversation Header

Display the active conversation's title, subtitle, participants, and action buttons using the themed header components.

`ChatConversationHeader` is a `<header>` element with divider styling. It reads the active conversation through context so every child has access to the same conversation state without additional wiring.

```tsx
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationTitle,
  ChatConversationSubtitle,
  ChatConversationHeaderActions,
} from '@mui/x-chat';
```

## Component anatomy

```text
ChatConversation                    <- thread shell, derives the active conversation
  ChatConversationHeader            <- header bar with divider styling
    ChatConversationTitle           <- conversation name
    ChatConversationSubtitle        <- secondary line (participants, presence, etc.)
    ChatConversationHeaderActions   <- action area (archive, mute, context menu)
```

The header sits at the top of the thread pane and provides the visual identity of the active conversation.

## ownerState and how state flows

`ChatConversation` owns the conversation-level `ownerState`, and the header subcomponents inherit that same state through the slot system.

### Conversation ownerState

| Field             | Type                       | Description                                  |
| :---------------- | :------------------------- | :------------------------------------------- |
| `conversationId`  | `string \| undefined`      | Currently selected conversation ID           |
| `conversation`    | `ChatConversation \| null` | Full active conversation object, when loaded |
| `hasConversation` | `boolean`                  | Whether the thread currently has a selection |

The `hasConversation` flag is particularly useful for hiding action buttons or showing a placeholder when no conversation is active. `ChatConversationHeader`, `ChatConversationTitle`, `ChatConversationSubtitle`, and `ChatConversationHeaderActions` all receive this same conversation-level state.

## Title and subtitle

`ChatConversationTitle` renders the conversation name from `conversation.title`. `ChatConversationSubtitle` renders the secondary line from `conversation.subtitle`, which can include participant names, a presence indicator, or any descriptive text.

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

## Action buttons

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

## Using ownerState in a custom title

The `ownerState` prop received by slot components carries the full conversation context. This makes it straightforward to render dynamic content derived from the active conversation:

```tsx
import { ChatConversationTitle } from '@mui/x-chat';

const LiveTitle = React.forwardRef(function LiveTitle(
  { ownerState, ...props },
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
  return <ChatConversationTitle {...props} slots={{ root: LiveTitle }} />;
}
```

## Full recomposition

When you need to insert additional content inside the header — for example a typing indicator or a custom divider — assemble the header from individual Material UI components directly:

```tsx
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationTitle,
  ChatConversationSubtitle,
  ChatConversationHeaderActions,
} from '@mui/x-chat';
import Box from '@mui/material/Box';

function CustomThread() {
  return (
    <ChatConversation sx={{ height: '100%' }}>
      <ChatConversationHeader>
        <ChatConversationTitle />
        <ChatConversationSubtitle />
        <Box sx={{ flex: 1 }} />
        <ChatConversationHeaderActions />
      </ChatConversationHeader>
      {/* rest of the thread */}
    </ChatConversation>
  );
}
```

## See also

- [Conversation List](/x/react-chat/multi-conversation/conversation-list/) for the sidebar that lists conversations.
- [Real-Time Sync](/x/react-chat/multi-conversation/real-time-sync/) for live updates to conversation metadata displayed in the header.
- [Layout](/x/react-chat/basics/layout/) for the full thread anatomy including message list and composer.
