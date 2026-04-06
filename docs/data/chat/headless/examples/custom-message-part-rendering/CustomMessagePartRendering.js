import * as React from 'react';
import {
  Chat,
  Conversation,
  Composer,
  Message,
  MessageGroup,
  MessageList,
  getDefaultMessagePartRenderer,
} from '@mui/x-chat-headless';

import { createEchoAdapter } from 'docsx/data/chat/headless/examples/shared/demoUtils';
import {
  demoLocaleText,
  demoSlotProps,
} from 'docsx/data/chat/headless/examples/shared/DemoPrimitives';
import {
  demoUsers,
  partRenderingMessages,
} from 'docsx/data/chat/headless/examples/shared/demoData';

const partRenderers = {
  reasoning: ({ part }) => (
    <details
      open
      style={{
        border: '1px solid #e0e0e0',
        background: '#fafafa',
        color: '#111111',
        padding: '10px 12px',
      }}
    >
      <summary style={{ cursor: 'pointer', fontWeight: 700 }}>
        Reasoning trace
      </summary>
      <div style={{ marginTop: 8 }}>{part.text}</div>
    </details>
  ),
  'source-url': (props) => {
    const Fallback = getDefaultMessagePartRenderer(props.part);

    return (
      <div
        style={{
          border: '1px solid #e0e0e0',
          padding: '10px 12px',
          background: '#ffffff',
          color: '#111111',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#666666',
            marginBottom: 6,
          }}
        >
          Reference
        </div>
        {Fallback ? Fallback(props) : null}
      </div>
    );
  },
  'data-summary': ({ part }) => (
    <div
      style={{
        background: '#111111',
        color: '#ffffff',
        padding: '10px 12px',
        display: 'grid',
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        Summary
      </div>
      <div>Regressions: {String(part.data.regressions ?? 0)}</div>
      <div>Open questions: {String(part.data.openQuestions ?? 0)}</div>
      <div>Confidence: {String(part.data.confidence ?? 'n/a')}</div>
    </div>
  ),
};

export default function CustomMessagePartRendering() {
  const adapter = React.useMemo(
    () => createEchoAdapter({ agent: demoUsers.agent }),
    [],
  );

  return (
    <Chat.Root
      adapter={adapter}
      conversations={[
        {
          id: 'parts',
          title: 'Rendered parts',
          subtitle: 'Selective overrides with default fallbacks',
          participants: [demoUsers.you, demoUsers.agent],
        },
      ]}
      initialActiveConversationId="parts"
      initialMessages={partRenderingMessages}
      localeText={demoLocaleText}
      partRenderers={partRenderers}
      slotProps={{
        root: {
          style: {
            background: '#ffffff',
            display: 'grid',
            gap: 14,
          },
        },
      }}
    >
      <Conversation.Root
        slotProps={{
          root: {
            style: {
              height: 520,
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
          estimatedItemSize={100}
          renderItem={({ id, index }) => (
            <React.Fragment key={id}>
              <MessageList.DateDivider
                formatDate={(date) =>
                  new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                  }).format(date)
                }
                index={index}
                messageId={id}
                slotProps={{
                  root: demoSlotProps.dateDividerRoot,
                  label: demoSlotProps.dateDividerLabel,
                }}
              />
              <MessageGroup
                index={index}
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
                      bubble: demoSlotProps.messageBubble,
                    }}
                  />
                  <Message.Meta
                    slotProps={{
                      meta: demoSlotProps.messageMeta,
                    }}
                  />
                </Message.Root>
              </MessageGroup>
            </React.Fragment>
          )}
        />
        <Composer.Root
          slotProps={{
            root: demoSlotProps.composerRoot,
          }}
        >
          <Composer.TextArea
            aria-label="Message"
            placeholder="Type a message"
            slotProps={{
              input: demoSlotProps.composerTextArea,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Composer.SendButton
              data-variant="primary"
              slotProps={{
                sendButton: demoSlotProps.composerSendButton,
              }}
            >
              Send
            </Composer.SendButton>
          </div>
        </Composer.Root>
      </Conversation.Root>
    </Chat.Root>
  );
}
