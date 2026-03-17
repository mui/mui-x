import * as React from 'react';
import {
  Chat,
  Message,
  MessageGroup,
  MessageList,
  Thread,
  getDefaultMessagePartRenderer,
} from '@mui/x-chat-unstyled';
import type { ChatPartRendererMap } from '@mui/x-chat-headless';
import { createEchoAdapter } from '../shared/demoUtils';
import { demoUsers, partRenderingMessages } from '../shared/demoData';
import {
  DemoDateDividerLabel,
  DemoDateDividerRoot,
  DemoMessageAuthor,
  DemoMessageAvatar,
  DemoMessageContent,
  DemoMessageGroup,
  DemoMessageMeta,
  DemoMessageRoot,
  DemoThreadHeader,
} from '../shared/DemoPrimitives';

const partRenderers: ChatPartRendererMap = {
  reasoning: ({ part }) => (
    <details
      open
      style={{
        border: '1px solid #d7dee7',
        borderRadius: 14,
        background: '#f8fbff',
        color: '#10263d',
        padding: '10px 12px',
      }}
    >
      <summary style={{ cursor: 'pointer', fontWeight: 800 }}>
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
          border: '1px solid #d7dee7',
          borderRadius: 14,
          padding: '10px 12px',
          background: '#ffffff',
          color: '#10263d',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: '#5c6b7c',
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
        borderRadius: 14,
        background: '#0b4f8a',
        color: '#ffffff',
        padding: '10px 12px',
        display: 'grid',
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        Summary
      </div>
      <div>
        Regressions:{' '}
        {String((part.data as { regressions?: number }).regressions ?? 0)}
      </div>
      <div>
        Open questions:{' '}
        {String((part.data as { openQuestions?: number }).openQuestions ?? 0)}
      </div>
      <div>
        Confidence:{' '}
        {String((part.data as { confidence?: string }).confidence ?? 'n/a')}
      </div>
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
      defaultActiveConversationId="parts"
      defaultMessages={partRenderingMessages}
      partRenderers={partRenderers}
      slotProps={{
        root: {
          style: {
            background: '#ffffff',
            border: '1px solid #d7dee7',
            borderRadius: 24,
            padding: 16,
            display: 'grid',
            gap: 14,
          },
        },
      }}
    >
      <Thread.Root
        slotProps={{
          root: {
            style: {
              minHeight: 520,
              display: 'grid',
              gridTemplateRows: 'auto minmax(0, 1fr)',
              gap: 14,
            },
          },
        }}
      >
        <Thread.Header slots={{ root: DemoThreadHeader }}>
          <div style={{ minWidth: 0 }}>
            <Thread.Title style={{ fontSize: 18, fontWeight: 800 }} />
            <Thread.Subtitle
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
        </Thread.Header>
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
                slots={{ label: DemoDateDividerLabel, root: DemoDateDividerRoot }}
              />
              <MessageGroup
                index={index}
                messageId={id}
                slots={{ authorName: DemoMessageAuthor, root: DemoMessageGroup }}
              >
                <Message.Root messageId={id} slots={{ root: DemoMessageRoot }}>
                  <Message.Avatar slots={{ root: DemoMessageAvatar }} />
                  <Message.Content slots={{ root: DemoMessageContent }} />
                  <Message.Meta slots={{ root: DemoMessageMeta }} />
                </Message.Root>
              </MessageGroup>
            </React.Fragment>
          )}
          style={{ minHeight: 0 }}
          virtualization={false}
        />
      </Thread.Root>
    </Chat.Root>
  );
}
