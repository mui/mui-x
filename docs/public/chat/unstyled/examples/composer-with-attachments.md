---
title: Chat - Composer with attachments
productId: x-chat
packageName: '@mui/x-chat-unstyled'
---

# Composer with attachments

Build the full unstyled draft surface with a textarea, hidden file input, helper text, and send action.

This recipe isolates the draft area so the interaction model is easy to understand before it is embedded into a larger chat shell.

That is useful because chat composers often look simple but hide a lot of behavior: autosizing, disabled states, IME-safe submit, attachment selection, and helper text.

```tsx
import * as React from 'react';
import {
  Chat,
  Conversation,
  ConversationInput,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat-unstyled';
import { useChatComposer } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/unstyled/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docsx/data/chat/unstyled/examples/shared/demoData';
import {
  AttachmentPreviewList,
  DemoComposerButton,
  DemoComposerHelperText,
  DemoComposerInput,
  DemoComposerRoot,
  DemoComposerToolbar,
  DemoMessageAuthor,
  DemoMessageAvatar,
  DemoMessageContent,
  DemoMessageGroup,
  DemoMessageMeta,
  DemoMessageRoot,
  DemoThreadHeader,
  DemoToolbarButton,
} from 'docsx/data/chat/unstyled/examples/shared/DemoPrimitives';

const adapter = createEchoAdapter({
  agent: demoUsers.agent,
  respond: (text, { attachments }) =>
    `Draft received: "${text}". The composer stayed inside the unstyled layer while the runtime tracked ${attachments} attachment${attachments === 1 ? '' : 's'}.`,
});

function ComposerDemoBody() {
  const composer = useChatComposer();

  const addSampleAttachment = React.useCallback(
    (name: string, type: string) => {
      const file = new File([`sample payload for ${name}`], name, { type });
      composer.addAttachment(file);
    },
    [composer],
  );

  return (
    <Conversation.Root
      slotProps={{
        root: {
          style: {
            minHeight: 560,
            display: 'grid',
            gridTemplateRows: 'auto minmax(0, 1fr) auto',
            gap: 14,
          },
        },
      }}
    >
      <Conversation.Header slots={{ root: DemoThreadHeader }}>
        <div style={{ minWidth: 0 }}>
          <Conversation.Title style={{ fontSize: 18, fontWeight: 800 }} />
          <Conversation.Subtitle
            style={{
              color: '#5c6b7c',
              fontSize: 13,
              marginTop: 4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          />
        </div>
      </Conversation.Header>
      <MessageList.Root
        estimatedItemSize={92}
        renderItem={({ id, index }) => (
          <MessageGroup
            index={index}
            key={id}
            messageId={id}
            slots={{ authorName: DemoMessageAuthor, root: DemoMessageGroup }}
          >
            <Message.Root messageId={id} slots={{ root: DemoMessageRoot }}>
              <Message.Avatar slots={{ root: DemoMessageAvatar }} />
              <Message.Content slots={{ root: DemoMessageContent }} />
              <Message.Meta slots={{ root: DemoMessageMeta }} />
            </Message.Root>
          </MessageGroup>
        )}
        style={{ minHeight: 0 }}
      />
      <ConversationInput.Root slots={{ root: DemoComposerRoot }}>
        <AttachmentPreviewList />
        <ConversationInput.TextArea
          aria-label="Draft"
          placeholder="Write the update and attach any supporting files"
          slots={{ root: DemoComposerInput }}
        />
        <ConversationInput.Toolbar slots={{ root: DemoComposerToolbar }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <ConversationInput.AttachButton slots={{ root: DemoComposerButton }}>
              Attach file
            </ConversationInput.AttachButton>
            <DemoToolbarButton
              onClick={() =>
                addSampleAttachment('architecture-note.txt', 'text/plain')
              }
            >
              Add text file
            </DemoToolbarButton>
            <DemoToolbarButton
              onClick={() => addSampleAttachment('wireframe.png', 'image/png')}
            >
              Add image
            </DemoToolbarButton>
          </div>
          <ConversationInput.SendButton
            data-variant="primary"
            slots={{ root: DemoComposerButton }}
          >
            Send message
          </ConversationInput.SendButton>
        </ConversationInput.Toolbar>
        <ConversationInput.HelperText slots={{ root: DemoComposerHelperText }}>
          Press Enter to send. Shift+Enter keeps a new line, and the file trigger
          stays connected to the hidden input.
        </ConversationInput.HelperText>
      </ConversationInput.Root>
    </Conversation.Root>
  );
}

export default function ComposerWithAttachments() {
  return (
    <Chat.Root
      adapter={adapter}
      conversations={[
        {
          id: 'composer',
          title: 'Attachments composer',
          subtitle: 'Draft text, helper copy, and upload state',
          participants: [demoUsers.you, demoUsers.agent],
        },
      ]}
      defaultActiveConversationId="composer"
      defaultMessages={[
        createTextMessage({
          id: 'composer-a1',
          conversationId: 'composer',
          role: 'assistant',
          author: demoUsers.agent,
          createdAt: '2026-03-15T11:00:00.000Z',
          text: 'Add files, write a note, and send the draft to see how the composer clears after a successful response.',
        }),
      ]}
      slotProps={{
        root: {
          style: {
            background: '#ffffff',
            border: '1px solid #d7dee7',
            borderRadius: 24,
            padding: 16,
          },
        },
      }}
    >
      <ComposerDemoBody />
    </Chat.Root>
  );
}
```

## What it shows

- `ConversationInput.Root`
- `ConversationInput.TextArea`
- `ConversationInput.AttachButton`
- `ConversationInput.HelperText`
- `ConversationInput.SendButton`
- attachment flows and IME-safe input behavior

## Key primitives

- `ConversationInput.Root` for form submission and shared composer context
- `ConversationInput.TextArea` for autosizing textarea behavior and IME-safe submit
- `ConversationInput.AttachButton` for the visible trigger plus hidden file input
- `ConversationInput.HelperText` for error or helper messaging
- `ConversationInput.SendButton` for runtime-aware disabled and submit state

## Implementation notes

- Show both text-only and attachment-backed drafts.
- Make the helper text visible through either explicit copy or a runtime error so its role is clear.
- Keep the visual design plain so the hidden file-input relationship is the main lesson.

## When to use this pattern

Use this recipe when:

- a product surface needs upload support
- the send action depends on runtime state
- the team needs a clear example of the unstyled composer contract

This applies to support chat with screenshots, copilots that accept reference files, and internal tools where users need to attach evidence or export artifacts alongside text.

## What to pay attention to

- `ConversationInput.AttachButton` owns the visible-trigger plus hidden-input relationship, so the page layer does not need attachment plumbing.
- `ConversationInput.HelperText` is the natural place for both authored guidance and runtime error fallback.
- `ConversationInput.TextArea` already handles the IME and Enter behavior that teams often reimplement by hand.

## Next steps

- Continue with [Composer](/x/react-chat/unstyled/composer/) for the reference-level API and behaviors.
- Continue with [Slot customization](/x/react-chat/unstyled/examples/slot-customization/) when the default composer structure is correct but the markup needs to match a custom design system.
