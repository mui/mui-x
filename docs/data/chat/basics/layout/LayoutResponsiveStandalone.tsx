'use client';
import * as React from 'react';
import AttachIcon from '@mui/icons-material/AttachFile';
import BackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  ChatComposer,
  ChatComposerAttachButton,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatConversation,
  ChatConversationHeader,
  ChatConversationList,
  ChatConversationSubtitle,
  ChatConversationTitle,
  ChatMessageGroup,
  ChatMessageList,
} from '@mui/x-chat';
import { ChatLayout, ChatProvider } from '@mui/x-chat/headless';
import type {
  ChatConversation as ChatConversationModel,
  ChatMessage,
} from '@mui/x-chat/headless';
import {
  createEchoAdapter,
  syncConversationPreview,
} from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". This responsive example switches ChatLayout between two-pane and single-pane compositions.`,
});

export default function LayoutResponsiveStandalone() {
  const [width, setWidth] = React.useState(720);
  const [activeConversationId, setActiveConversationId] = React.useState<
    string | undefined
  >(() => inboxConversations[0].id);
  const [conversations, setConversations] = React.useState<ChatConversationModel[]>(
    () => inboxConversations.map((conversation) => ({ ...conversation })),
  );
  const [threads, setThreads] = React.useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(
      Object.entries(inboxThreads).map(([id, messages]) => [
        id,
        messages.map((message) => ({ ...message })),
      ]),
    ),
  );

  const isNarrow = width < 600;
  const effectiveConversationId = activeConversationId ?? inboxConversations[0].id;
  const messages = threads[effectiveConversationId] ?? [];
  const showList = !isNarrow || !activeConversationId;
  const showThread = !isNarrow || Boolean(activeConversationId);

  const renderItem = React.useCallback(
    (params: { id: string }) => (
      <ChatMessageGroup key={params.id} messageId={params.id} />
    ),
    [],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ px: 1, pb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
          Container width
        </Typography>
        <Slider
          value={width}
          onChange={(_, value) => setWidth(value as number)}
          min={320}
          max={900}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}px`}
        />
        <Typography
          variant="body2"
          sx={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}
        >
          {width}px
        </Typography>
      </Box>
      <Box
        sx={{
          width,
          maxWidth: '100%',
          mx: 'auto',
          transition: 'width 200ms ease',
        }}
      >
        <ChatProvider
          adapter={adapter}
          activeConversationId={activeConversationId}
          conversations={conversations}
          messages={messages}
          onActiveConversationChange={setActiveConversationId}
          onMessagesChange={(nextMessages) => {
            if (!effectiveConversationId) {
              return;
            }

            setThreads((prev) => ({
              ...prev,
              [effectiveConversationId]: nextMessages,
            }));
            setConversations((prev) =>
              syncConversationPreview(prev, effectiveConversationId, nextMessages),
            );
          }}
          onConversationsChange={setConversations}
        >
          <Box
            sx={{
              height: 500,
              overflow: 'hidden',
            }}
          >
            <ChatLayout
              style={{ height: '100%' }}
              slotProps={{
                conversationsPane: {
                  style: isNarrow
                    ? { flex: 1 }
                    : { width: '280px', flex: '0 0 280px' },
                },
              }}
            >
              {showList && (
                <ChatConversationList
                  slotProps={{ root: { 'aria-label': 'Conversations' } }}
                />
              )}
              {showThread && (
                <ChatConversation>
                  <ChatConversationHeader>
                    {isNarrow && activeConversationId ? (
                      <Tooltip title="Back to conversations">
                        <IconButton
                          size="small"
                          aria-label="Back to conversations"
                          onClick={() => setActiveConversationId(undefined)}
                          sx={{ mr: 1 }}
                        >
                          <BackIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    <Box sx={{ minWidth: 0 }}>
                      <ChatConversationTitle />
                      <ChatConversationSubtitle />
                    </Box>
                  </ChatConversationHeader>
                  <ChatMessageList renderItem={renderItem} />
                  <ChatComposer>
                    <ChatComposerTextArea
                      aria-label="Message"
                      placeholder="Type a message…"
                    />
                    <ChatComposerToolbar>
                      <ChatComposerAttachButton>
                        <AttachIcon />
                      </ChatComposerAttachButton>
                      <ChatComposerSendButton>
                        <SendIcon />
                      </ChatComposerSendButton>
                    </ChatComposerToolbar>
                  </ChatComposer>
                </ChatConversation>
              )}
            </ChatLayout>
          </Box>
        </ChatProvider>
      </Box>
    </Box>
  );
}
