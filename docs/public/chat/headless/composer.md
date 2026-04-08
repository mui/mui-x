---
productId: x-chat
title: Chat - Headless composer
packageName: '@mui/x-chat-headless'
components: ComposerRoot, ComposerTextArea, ComposerSendButton, ComposerAttachButton, ComposerAttachmentList, ComposerLabel, ComposerToolbar, ComposerHelperText
githubLabel: 'scope: chat'
---

# Chat - Headless composer

Assemble the draft surface from structural primitives that already handle submission, IME-safe Enter, attachments, helper text, and disabled states.

```tsx
import * as React from 'react';
import {
  Chat,
  Conversation,
  Composer,
  Message,
  MessageGroup,
  MessageList,
  useChatComposer,
} from '@mui/x-chat-headless';
import type { ChatAdapter } from '@mui/x-chat-headless';
import {
  createTextResponseChunks,
  createChunkStream,
} from 'docsx/data/chat/headless/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docsx/data/chat/headless/examples/shared/demoData';
import {
  demoLocaleText,
  demoSlotProps,
  palette,
  AttachmentPreviewList,
  DemoToolbarButton,
} from 'docsx/data/chat/headless/examples/shared/DemoPrimitives';

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
    const responseText = `Draft received: "${textOnly}". The composer stayed inside the headless layer while the runtime tracked ${attachmentCount} attachment${attachmentCount === 1 ? '' : 's'}.`;

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

## Primitive set

The composer surface is built from:

- `Composer.Root`
- `Composer.TextArea`
- `Composer.Toolbar`
- `Composer.AttachButton`
- `Composer.HelperText`
- `Composer.SendButton`

## Canonical composition

```tsx
import { Composer } from '@mui/x-chat-headless';

function ThreadComposer() {
  return (
    <Composer.Root>
      <Composer.TextArea placeholder="Write a message" />
      <Composer.HelperText />
      <Composer.Toolbar>
        <Composer.AttachButton />
        <Composer.SendButton />
      </Composer.Toolbar>
    </Composer.Root>
  );
}
```

This pattern gives you a working structural composer while leaving every visual decision in user land.

## `Composer.Root`

`Composer.Root` is a structural form wrapper around the headless composer state.

It owns:

- submit-on-form-submit wiring
- composer context for the child primitives
- owner state such as `hasValue`, `isSubmitting`, `isStreaming`, and `attachmentCount`

That makes it the place to style global draft states such as empty, busy, or attachment-heavy composers.

## `Composer.TextArea`

`Composer.TextArea` is a textarea-based primitive that already handles the runtime-specific behaviors that usually make chat inputs fiddly to implement.

It supports:

- binding to the current composer value
- automatic textarea resizing as the draft grows
- `Enter` to submit
- `Shift+Enter` for a new line
- composition tracking for IME input
- focus restoration when the active conversation changes and the previous input unmounts

### IME-safe Enter behavior

The input only submits when all of these are true:

- the key is `Enter`
- `Shift` is not pressed
- the native event is not composing
- no earlier `onKeyDown` handler prevented the default behavior

That means East Asian IME flows stay intact without requiring extra app-level bookkeeping.

### Input example

```tsx
<Composer.TextArea aria-label="Message" minRows={1} placeholder="Reply in thread" />
```

If you replace the root slot, preserve the textarea-like behavior unless you are intentionally building a different draft surface.

## `Composer.AttachButton`

`Composer.AttachButton` pairs a visible trigger with a hidden file input.

By default it:

- opens the hidden input on click
- accepts multiple files
- adds each selected file into the composer attachment collection
- resets the file input value after selection so the same file can be picked again

The primitive exposes both `root` and `input` slots, which is useful when you want a custom trigger element or need to style the hidden input for a testing harness.

### Attachment example

```tsx
<Composer.AttachButton
  aria-label="Add files"
  slotProps={{
    input: {
      accept: 'image/*,.pdf',
    },
  }}
/>
```

## `Composer.HelperText`

`Composer.HelperText` is the default place for draft-level status and error messaging.

It renders:

- explicit children when you provide them
- otherwise the current runtime error message from the composer context

That makes it a good structural slot for validation copy, transport errors, and retry guidance.

```tsx
<Composer.HelperText>
  Files are uploaded after the message is sent.
</Composer.HelperText>
```

If you omit children, the component falls back to the active runtime error text and returns `null` when there is nothing to show.

## `Composer.SendButton`

`Composer.SendButton` is a submit button that understands composer state.

It disables itself when:

- the draft is empty
- a stream is already active
- the button is disabled externally

The default button type is `submit`, so it works naturally inside `Composer.Root`.

## Slots and owner state

Composer primitives expose `slots` and `slotProps` throughout the surface.
Custom slots receive owner state derived from the composer context, including:

- `hasValue`
- `isSubmitting`
- `isStreaming`
- `attachmentCount`

Use these values for styling patterns such as:

- hiding the send button until a value exists
- emphasizing the attach trigger when attachments are present
- dimming the toolbar while a stream is active

## See also

- Continue with [Indicators](/x/react-chat/headless/indicators/) to add typing, unread, and scroll affordances around the composer.
- Continue with [Customization](/x/react-chat/headless/customization/) for slot and owner-state patterns across the full headless surface.
- Continue with [Composer with attachments](/x/react-chat/headless/examples/composer-with-attachments/) for the demo version of this page.

## API

- [ComposerRoot](/x/api/chat/composer-root/)
- [ComposerTextArea](/x/api/chat/composer-text-area/)
- [ComposerSendButton](/x/api/chat/composer-send-button/)
- [ComposerAttachButton](/x/api/chat/composer-attach-button/)
- [ComposerToolbar](/x/api/chat/composer-toolbar/)
- [ComposerHelperText](/x/api/chat/composer-helper-text/)
