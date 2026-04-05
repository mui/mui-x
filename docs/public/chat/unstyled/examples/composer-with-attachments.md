---
title: Chat - Composer with attachments
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Composer with attachments

Build the full unstyled draft surface with a textarea, hidden file input, helper text, and send action.

This demo isolates the draft area so the interaction model is easy to understand before it is embedded into a larger chat shell.

That is useful because chat composers often look simple but hide a lot of behavior: autosizing, disabled states, IME-safe submit, attachment selection, and helper text.

- `Composer.Root`
- `Composer.TextArea`
- `Composer.AttachButton`
- `Composer.HelperText`
- `Composer.SendButton`
- attachment flows and IME-safe input behavior

```tsx
import * as React from 'react';
import {
  Chat,
  Conversation,
  Composer,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat/headless';
import { useChatComposer } from '@mui/x-chat/headless';
import type { ChatAdapter } from '@mui/x-chat/headless';
import {
  createTextResponseChunks,
  createChunkStream,
} from 'docsx/data/chat/unstyled/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docsx/data/chat/unstyled/examples/shared/demoData';
import {
  demoLocaleText,
  demoSlotProps,
  palette,
  AttachmentPreviewList,
  DemoToolbarButton,
} from 'docsx/data/chat/unstyled/examples/shared/DemoPrimitives';

const agent = demoUsers.agent;

const adapter: ChatAdapter = {
  async sendMessage({ attachments, message }) {
    const textOnly = message.parts
      .filter(
        (part): part is Extract<typeof part, { type: 'text' }> =>
          part.type === 'text',
      )
      .map((part) => part.text)
      .join('\n');
    const attachmentCount = attachments?.length ?? 0;
    const responseText = `Draft received: "${textOnly}". The composer stayed inside the unstyled layer while the runtime tracked ${attachmentCount} attachment${attachmentCount === 1 ? '' : 's'}.`;

    return createChunkStream(
      createTextResponseChunks(`assistant-${message.id}`, responseText, {
        author: agent,
      }),
      { delayMs: 170 },
    );
  },
};

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
            height: 560,
            display: 'grid',
            gridTemplateRows: 'auto minmax(0, 1fr) auto',
            gap: 14,
          },
        },
      }}
    >
      <Conversation.Header
        slotProps={{
          root: demoSlotProps.conversationHeader,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <Conversation.Title style={demoSlotProps.conversationTitle} />
          <Conversation.Subtitle style={demoSlotProps.conversationSubtitle} />
        </div>
      </Conversation.Header>
      <MessageList.Root
        estimatedItemSize={92}
        renderItem={({ id, index }) => (
          <MessageGroup
            index={index}
            key={id}
            messageId={id}
            slotProps={{
              root: demoSlotProps.messageGroupRoot,
              authorName: demoSlotProps.messageGroupAuthorName,
            }}
          >
            <Message.Root
              messageId={id}
              slotProps={{
                root: demoSlotProps.messageRoot,
              }}
            >
              <Message.Avatar
                slotProps={{
                  avatar: demoSlotProps.messageAvatar,
                  image: demoSlotProps.messageAvatarImage,
                }}
              />
              <Message.Content
                slotProps={{
                  content: { style: { display: 'contents' } },
                  bubble: demoSlotProps.messageBubble,
                }}
                partProps={{
                  file: {
                    slotProps: {
                      link: (ownerState: { role: string }) => ({
                        style: {
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          background:
                            ownerState.role === 'user'
                              ? 'rgba(255,255,255,0.12)'
                              : palette.surfaceAlt,
                          border: `1px solid ${
                            ownerState.role === 'user'
                              ? 'rgba(255,255,255,0.2)'
                              : palette.border
                          }`,
                          color:
                            ownerState.role === 'user' ? '#ffffff' : palette.text,
                          textDecoration: 'none',
                          fontSize: 13,
                          fontWeight: 500,
                        },
                      }),
                      preview: {
                        style: {
                          maxWidth: 180,
                          maxHeight: 120,
                          objectFit: 'cover' as const,
                        },
                      },
                      filename: {
                        style: {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap' as const,
                        },
                      },
                    },
                  },
                }}
              />
              <Message.Meta
                slotProps={{
                  meta: demoSlotProps.messageMeta,
                }}
              />
            </Message.Root>
          </MessageGroup>
        )}
      />
      <Composer.Root
        slotProps={{
          root: demoSlotProps.composerRoot,
        }}
      >
        <AttachmentPreviewList />
        <Composer.TextArea
          aria-label="Draft"
          placeholder="Write the update and attach any supporting files"
          slotProps={{
            input: demoSlotProps.composerTextArea,
          }}
        />
        <Composer.Toolbar
          slotProps={{
            toolbar: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                justifyContent: 'space-between',
              },
            },
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Composer.AttachButton
              slotProps={{
                attachButton: {
                  style: {
                    border: '1px solid #111111',
                    background: '#111111',
                    color: '#ffffff',
                    padding: '8px 20px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  },
                },
              }}
            >
              Attach file
            </Composer.AttachButton>
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
          <Composer.SendButton
            data-variant="primary"
            slotProps={{
              sendButton: demoSlotProps.composerSendButton,
            }}
          >
            Send message
          </Composer.SendButton>
        </Composer.Toolbar>
        <Composer.HelperText
          slotProps={{
            helperText: {
              style: {
                color: '#666666',
                fontSize: 12,
              },
            },
          }}
        >
          Press Enter to send. Shift+Enter keeps a new line, and the file trigger
          stays connected to the hidden input.
        </Composer.HelperText>
      </Composer.Root>
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
      initialActiveConversationId="composer"
      localeText={demoLocaleText}
      initialMessages={[
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
          },
        },
      }}
    >
      <ComposerDemoBody />
    </Chat.Root>
  );
}
```

## Key primitives

- `Composer.Root` for form submission and shared composer context
- `Composer.TextArea` for autosizing textarea behavior and IME-safe submit
- `Composer.AttachButton` for the visible trigger plus hidden file input
- `Composer.HelperText` for error or helper messaging
- `Composer.SendButton` for runtime-aware disabled and submit state

## Implementation notes

- Show both text-only and attachment-backed drafts.
- Make the helper text visible through either explicit copy or a runtime error so its role is clear.
- Keep the visual design plain so the hidden file-input relationship is the main lesson.

## When to use this pattern

Use this pattern when:

- a product surface needs upload support
- the send action depends on runtime state
- the team needs a clear demo of the unstyled composer contract

This applies to support chat with screenshots, copilots that accept reference files, and internal tools where users need to attach evidence or export artifacts alongside text.

## What to pay attention to

- `Composer.AttachButton` owns the visible-trigger plus hidden-input relationship, so the page layer does not need attachment plumbing.
- `Composer.HelperText` is the natural place for both authored guidance and runtime error fallback.
- `Composer.TextArea` already handles the IME and Enter behavior that teams often reimplement by hand.

## API

- [ChatRoot](/x/api/chat/chat-root/)

## See also

- Continue with [Composer](/x/react-chat/unstyled/composer/) for the reference-level API and behaviors.
- Continue with [Slot customization](/x/react-chat/unstyled/examples/slot-customization/) when the default composer structure is correct but the markup needs to match a custom design system.
