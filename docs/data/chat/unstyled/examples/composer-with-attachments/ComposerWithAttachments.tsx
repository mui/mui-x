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
import { createTextMessage, demoUsers } from 'docsx/data/chat/unstyled/examples/shared/demoData';
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
        virtualization={false}
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
