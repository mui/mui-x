import * as React from 'react';
import {
  Chat,
  Conversation,
  Composer,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat-headless';
import { useChatComposer } from '@mui/x-chat-headless';
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
