import * as React from 'react';
import {
  ChatProvider,
  useChat,
  type ChatAdapter,
  type ChatMessage,
  type ChatMessagePart,
} from '@mui/x-chat-headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { demoUsers } from 'docsx/data/chat/core/examples/shared/demoData';
import { createChunkStream } from 'docsx/data/chat/core/examples/shared/demoUtils';

const adapter: ChatAdapter = {
  async sendMessage() {
    return createChunkStream(
      [
        { type: 'start', messageId: 'parts-assistant' },
        { type: 'reasoning-start', id: 'parts-reasoning' },
        {
          type: 'reasoning-delta',
          id: 'parts-reasoning',
          delta:
            'Scanning the docs, ranking sources, and assembling a grounded answer.',
        },
        { type: 'reasoning-end', id: 'parts-reasoning' },
        { type: 'start-step' },
        { type: 'text-start', id: 'parts-text' },
        {
          type: 'text-delta',
          id: 'parts-text',
          delta:
            'Here is a structured response with supporting links, a document extract, and a downloadable artifact.',
        },
        { type: 'text-end', id: 'parts-text' },
        {
          type: 'source-url',
          sourceId: 'source-url-1',
          url: 'https://mui.com/x/react-chat/core/',
          title: 'Headless docs',
        },
        {
          type: 'source-document',
          sourceId: 'source-document-1',
          title: 'Adapter checklist',
          text: 'Adapters should return a ReadableStream and emit terminal chunks such as finish or abort.',
        },
        {
          type: 'file',
          url: 'https://mui.com/static/x-logo.svg',
          filename: 'chat-research.svg',
          mediaType: 'image/svg+xml',
        },
        {
          type: 'data-summary',
          id: 'data-summary-1',
          data: {
            citations: 2,
            files: 1,
            confidence: 'high',
          },
        },
        { type: 'finish-step' },
        { type: 'finish', messageId: 'parts-assistant', finishReason: 'stop' },
      ],
      { delayMs: 180 },
    );
  },
};

function renderPart(part: ChatMessagePart, _message: ChatMessage, index: number) {
  if (part.type === 'reasoning') {
    return (
      <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'grey.50' }}>
        <Chip label="Reasoning" size="small" sx={{ mb: 1 }} />
        <Typography variant="body2">{part.text}</Typography>
      </Paper>
    );
  }

  if (part.type === 'text') {
    return <Typography variant="body2">{part.text}</Typography>;
  }

  if (part.type === 'source-url') {
    return (
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Chip label="Source URL" size="small" sx={{ mb: 1 }} />
        <Link
          href={part.url}
          target="_blank"
          rel="noreferrer"
          sx={{ display: 'block' }}
        >
          {part.title ?? part.url}
        </Link>
      </Paper>
    );
  }

  if (part.type === 'source-document') {
    return (
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Chip label="Source document" size="small" sx={{ mb: 1 }} />
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {part.title ?? 'Document excerpt'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {part.text}
        </Typography>
      </Paper>
    );
  }

  if (part.type === 'file') {
    return (
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Chip label="File" size="small" sx={{ mb: 1 }} />
        <Link
          href={part.url}
          target="_blank"
          rel="noreferrer"
          sx={{ display: 'block' }}
        >
          {part.filename ?? part.url}
        </Link>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          {part.mediaType}
        </Typography>
      </Paper>
    );
  }

  if (part.type === 'step-start') {
    return <Chip label={`Step ${index + 1}`} size="small" variant="outlined" />;
  }

  if (part.type.startsWith('data-') && 'data' in part) {
    return (
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Chip label={part.type} size="small" sx={{ mb: 1 }} />
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            bgcolor: 'grey.900',
            color: 'grey.100',
            fontFamily: 'monospace',
            fontSize: 12,
            maxHeight: 160,
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {JSON.stringify(part.data, null, 2)}
        </Paper>
      </Paper>
    );
  }

  return null;
}

function MessagePartsInner() {
  const { messages, sendMessage, isStreaming } = useChat();

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Assistant message parts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reasoning, sources, files, and data parts all flow through the same
            message array.
          </Typography>
        </div>
        <Button
          variant="contained"
          size="small"
          disabled={isStreaming}
          onClick={() =>
            void sendMessage({
              conversationId: 'research',
              author: demoUsers.alice,
              parts: [
                {
                  type: 'text',
                  text: 'Summarize the adapter contract with supporting evidence.',
                },
              ],
            })
          }
        >
          Generate rich answer
        </Button>
      </Box>

      {/* Message list */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 2,
          minHeight: 160,
          maxHeight: 480,
          overflow: 'auto',
        }}
      >
        {messages.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', py: 4 }}
          >
            Send a message to stream a multi-part assistant response.
          </Typography>
        ) : (
          messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <Paper
                key={message.id}
                elevation={0}
                sx={{
                  p: 1.5,
                  maxWidth: '85%',
                  borderRadius: 3,
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  bgcolor: isUser ? 'primary.main' : 'grey.100',
                  color: isUser ? 'primary.contrastText' : 'text.primary',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 0.5,
                    color: isUser ? 'rgba(255,255,255,0.82)' : 'text.secondary',
                  }}
                >
                  <strong>{message.author?.displayName ?? message.role}</strong>
                  {message.status ? ` · ${message.status}` : ''}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {message.parts.map((part, index) => {
                    const rendered = renderPart(part, message, index);
                    if (!rendered) {
                      return null;
                    }
                    return (
                      <Box key={`${message.id}-${part.type}-${index}`}>
                        {rendered}
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            );
          })
        )}
      </Box>
    </Paper>
  );
}

export default function MessagePartsHeadlessChat() {
  return (
    <ChatProvider adapter={adapter} initialActiveConversationId="research">
      <MessagePartsInner />
    </ChatProvider>
  );
}
