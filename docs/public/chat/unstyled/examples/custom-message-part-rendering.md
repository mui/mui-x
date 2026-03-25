---
title: Chat - Custom message part rendering
productId: x-chat
packageName: '@mui/x-chat/unstyled'
---

# Custom message part rendering

Customize selected message parts while preserving the default unstyled message structure.

This recipe focuses on the common customization case where the message row layout is correct, but one or two part types need a different presentation.

That is often the most efficient customization point in AI chat products: preserve the shipped row structure and only replace the specific content shapes that need branded or domain-specific treatment.

```tsx
import * as React from 'react';
import {
  Chat,
  Conversation,
  Message,
  MessageGroup,
  MessageList,
  getDefaultMessagePartRenderer,
} from '@mui/x-chat/unstyled';
import type { ChatPartRendererMap } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docsx/data/chat/unstyled/examples/shared/demoUtils';
import {
  demoUsers,
  partRenderingMessages,
} from 'docsx/data/chat/unstyled/examples/shared/demoData';
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
} from 'docsx/data/chat/unstyled/examples/shared/DemoPrimitives';

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
      <Conversation.Root
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
        />
      </Conversation.Root>
    </Chat.Root>
  );
}
```

## What it shows

- `Message.Content`
- `getDefaultMessagePartRenderer()`
- selective replacement of default part renderers
- retaining the default renderers for the remaining part types

## Key primitives

- `Message.Content` as the structural message-content surface
- `getDefaultMessagePartRenderer()` to preserve shipped rendering behavior
- targeted overrides for parts such as `reasoning`, `tool`, `file`, or `data-*`

## Implementation notes

- Keep the override narrow. The main lesson is how to replace one part type without forking the whole message surface.
- Use a message with multiple part types so the fallback path is visible.
- Keep the example inside the unstyled layer rather than rebuilding the whole message in headless primitives.

## When to use this pattern

Use this recipe when:

- a team likes the default message structure
- certain message parts need brand-specific rendering
- the goal is to preserve most of the shipped behavior while changing only a subset of content

This is especially useful for reasoning disclosures, tool outputs, citations, files, and `data-*` parts that need richer domain UI than the defaults provide.

## What to pay attention to

- `getDefaultMessagePartRenderer()` is the key tool for progressive customization.
- Overriding one part type does not require forking message rows, groups, or the entire message surface.

## Next steps

- Continue with [Messages](/x/react-chat/unstyled/messages/) for the default part renderer reference.
- Continue with [Slot customization](/x/react-chat/unstyled/examples/slot-customization/) when the customization needs to extend beyond message content and into row structure.
