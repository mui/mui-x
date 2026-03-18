---
productId: x-chat
title: Chat - Material UI
packageName: '@mui/x-chat'
---

# Chat - Material UI

<p class="description">Use <code>@mui/x-chat</code> when you want a complete, theme-aware chat UI with a one-liner entry point and MUI-native customization hooks.</p>

`@mui/x-chat` is the styled layer on top of the unstyled and headless chat packages.
It keeps the same runtime model, localization contract, and part-renderer API, but ships a Material UI surface for the common production case:

- `ChatBox` as the flagship one-liner API
- modular styled components for conversations, thread, messages, composer, and indicators
- `slots`, `slotProps`, `sx`, and theme augmentation for customization

## `ChatBox` one-liner API

`ChatBox` wraps the runtime root and composes a full chat shell for you.
It forwards the headless controlled and uncontrolled props directly to the underlying provider, so the entry point stays high level without hiding state ownership.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
  },
};

export default function ChatBoxOneLiner() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 560 }}>
        <ChatBox
          adapter={adapter}
          defaultActiveConversationId="c1"
          defaultConversations={[
            {
              id: 'c1',
              title: 'Product design',
              subtitle: 'Roadmap sync',
              unreadCount: 2,
            },
            { id: 'c2', title: 'Support inbox', subtitle: 'Escalations' },
          ]}
          defaultMessages={[
            {
              id: 'm1',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:00:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'Morning. I summarized the latest design feedback in the thread.',
                },
              ],
            },
            {
              id: 'm2',
              role: 'user',
              author: demoUsers.you,
              createdAt: '2026-03-17T09:03:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'Great. Pull out the three biggest blockers for launch.',
                },
              ],
            },
            {
              id: 'm3',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:04:30.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'The biggest blockers are API latency, localization QA, and approval UX for tool calls.',
                },
              ],
            },
          ]}
        />
      </Box>
    </Paper>
  );
}

```

### What it renders

- `ChatConversations` when a conversations source exists
- `ChatConversation`
- `ChatConversationInput`

### Layout modes

`ChatBox` auto-detects whether it should render a two-pane or thread-only layout:

- two-pane when any conversations source exists: `conversations`, `defaultConversations`, or `adapter.listConversations`
- thread-only when no conversations source exists

## Controlled and uncontrolled state

`ChatBox` accepts the same state ownership model as `ChatRoot`:

```tsx
<ChatBox
  adapter={adapter}
  activeConversationId={activeConversationId}
  conversations={conversations}
  messages={messages}
  onActiveConversationChange={setActiveConversationId}
  onConversationsChange={setConversations}
  onMessagesChange={setMessages}
/>
```

That means you can start with a default, self-managed surface and then progressively lift state as product requirements become more specific.

## Customization through mirrored slots

`ChatBox` keeps the region-level replacement slots for the whole conversations pane, thread, and composer.
It also mirrors the most important nested slots from the composed styled components, so common customization does not require dropping down to manual composition.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
  },
};

const ConversationTitle = React.forwardRef(function ConversationTitle(
  props: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>,
  ref: React.Ref<HTMLDivElement>,
) {
  const { conversation, dense, focused, ownerState, selected, unread, ...other } =
    props;

  void dense;
  void focused;
  void ownerState;
  void selected;
  void unread;

  return (
    <Typography
      color="text.primary"
      fontWeight={700}
      ref={ref}
      textTransform="uppercase"
      variant="caption"
      {...other}
    >
      {typeof conversation === 'object' && conversation && 'title' in conversation
        ? (conversation.title ?? conversation.id)
        : null}
    </Typography>
  );
});

const MessageContent = React.forwardRef(function MessageContent(
  props: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>,
  ref: React.Ref<HTMLDivElement>,
) {
  const { ownerState, ...other } = props;

  void ownerState;

  return (
    <Box
      ref={ref}
      sx={{
        borderInlineStart: 3,
        borderColor: 'secondary.main',
        pl: 1.5,
      }}
      {...other}
    />
  );
});

export default function ChatBoxSlotCustomization() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 560 }}>
        <ChatBox
          adapter={adapter}
          defaultActiveConversationId="c1"
          defaultConversations={[
            { id: 'c1', title: 'AI copilot', subtitle: 'Mirrored slots in ChatBox' },
          ]}
          defaultMessages={[
            {
              id: 'm1',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:15:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'This example customizes the conversation title, message content, and composer input directly from ChatBox.',
                },
              ],
            },
          ]}
          localeText={{
            composerInputPlaceholder: 'Ask the copilot',
          }}
          slotProps={{
            composerInput: {
              rows: 1,
            },
          }}
          slots={{
            composerInput: 'textarea',
            conversationTitle: ConversationTitle,
            messageContent: MessageContent,
          }}
        />
      </Box>
    </Paper>
  );
}

```

The most common slot entry points are:

- `conversationTitle`, `conversationPreview`, `conversationUnreadBadge`
- `messageContent`, `messageBubble`, `messageMeta`, `messageActions`
- `typingIndicator`, `scrollToBottomAffordance`
- `composerInput`, `composerSendButton`, `composerAttachButton`, `composerHelperText`

Use the mirrored slot surface when you want to keep the one-liner API and only swap or restyle one nested region.
If you need to own the full pane behavior, replace `conversations`, `thread`, or `composer` directly.

## Localization and part renderers

`ChatBox` uses the same `localeText` and `partRenderers` contracts as the lower layers.

```tsx
<ChatBox
  adapter={adapter}
  localeText={{
    composerInputPlaceholder: 'Ask anything',
    retryButtonLabel: 'Try again',
  }}
  partRenderers={{
    text: (props) => <MyMarkdownRenderer {...props} />,
  }}
/>
```

`localeText` stays the canonical localization prop for the chat stack.
There is no `locale` alias on the Material layer.

## Theming and overrides

The styled layer supports both direct `sx` customization and theme augmentation.

```tsx
import type {} from '@mui/x-chat/themeAugmentation';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiChatBox: {
      styleOverrides: {
        root: {
          minHeight: 640,
        },
      },
    },
  },
  palette: {
    Chat: {
      userMessageBg: '#0f172a',
      userMessageColor: '#fff',
      assistantMessageBg: '#f8fafc',
      assistantMessageColor: '#0f172a',
      conversationHoverBg: '#eef2ff',
      conversationSelectedBg: '#dbeafe',
      conversationSelectedColor: '#0f172a',
      composerBorder: '#cbd5e1',
      composerFocusRing: '#2563eb',
    },
  },
});
```

## Related APIs

- Use [Headless](/x/react-chat/headless/) when you need to own the runtime, store, and rendering contracts directly.
- Use [Unstyled](/x/react-chat/unstyled/) when you want structural primitives but not the Material presentation.
