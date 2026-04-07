import * as React from 'react';
import {
  ChatProvider,
  useChat,
  useChatComposer,
  useChatStore,
} from '@mui/x-chat-headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {
  createChunkStream,
  createTextResponseChunks,
} from 'docsx/data/chat/core/examples/shared/demoUtils';

const adapter = {
  async sendMessage({ message }) {
    return createChunkStream(
      createTextResponseChunks(
        `composer-assistant-${message.id}`,
        'The composer demo covers attachments, preview URLs, and IME-safe submit behavior.',
      ),
      { delayMs: 180 },
    );
  },
};

function ComposerInner() {
  const { messages } = useChat();
  const composer = useChatComposer();
  const store = useChatStore();
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);

  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Composer with attachments
        </Typography>
        <Chip
          size="small"
          label={
            composer.isSubmitting
              ? 'Submitting\u2026'
              : `${composer.attachments.length} attachment(s)`
          }
          color={composer.isSubmitting ? 'primary' : 'default'}
          variant="outlined"
        />
      </Box>

      {/* Messages */}
      <Box
        ref={listRef}
        sx={{
          p: 2,
          minHeight: 300,
          maxHeight: 400,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {messages.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', mt: 8 }}
          >
            Use the composer to create the first message.
          </Typography>
        ) : (
          messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    px: 2,
                    py: 1,
                    maxWidth: '80%',
                    bgcolor: isUser ? 'primary.main' : 'grey.100',
                    color: isUser ? 'primary.contrastText' : 'text.primary',
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: isUser ? 'primary.contrastText' : 'text.secondary',
                    }}
                  >
                    {message.author?.displayName ?? message.role}
                  </Typography>
                  {message.parts.map((part, index) => {
                    if (part.type === 'text') {
                      return (
                        <Typography
                          variant="body2"
                          key={`${message.id}-${part.type}-${index}`}
                        >
                          {part.text}
                        </Typography>
                      );
                    }
                    if (part.type === 'file') {
                      return part.mediaType.startsWith('image/') ? (
                        <Box
                          key={`${message.id}-${part.type}-${index}`}
                          component="img"
                          src={part.url}
                          alt={part.filename ?? ''}
                          sx={{
                            maxWidth: '100%',
                            maxHeight: 200,
                            borderRadius: 1.5,
                            mt: 0.5,
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          key={`${message.id}-${part.type}-${index}`}
                          sx={{ mt: 0.5 }}
                        >
                          {part.filename ?? part.url}
                        </Typography>
                      );
                    }
                    return null;
                  })}
                </Paper>
              </Box>
            );
          })
        )}
      </Box>

      {/* Attachments */}
      {composer.attachments.length > 0 ? (
        <Stack
          spacing={1}
          sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: 'divider' }}
        >
          {composer.attachments.map((attachment) => (
            <Paper
              key={attachment.localId}
              variant="outlined"
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              {attachment.previewUrl ? (
                <Box
                  component="img"
                  src={attachment.previewUrl}
                  alt={attachment.file.name}
                  sx={{
                    width: 44,
                    height: 44,
                    objectFit: 'cover',
                    borderRadius: 1.5,
                  }}
                />
              ) : null}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                  {attachment.file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {attachment.status}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                onClick={() => composer.removeAttachment(attachment.localId)}
              >
                Remove
              </Button>
            </Paper>
          ))}
        </Stack>
      ) : null}

      {/* Textarea */}
      <Box sx={{ px: 2, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          multiline
          minRows={2}
          maxRows={6}
          aria-label="Draft message"
          placeholder="Write a message. Use an IME or add images to see the completed composer behaviors."
          value={composer.value}
          onChange={(event) => composer.setValue(event.target.value)}
          onCompositionStart={() => store.setComposerIsComposing(true)}
          onCompositionEnd={() => store.setComposerIsComposing(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void composer.submit();
            }
          }}
        />
      </Box>

      {/* Hidden file input */}
      <input
        hidden
        multiple
        ref={inputRef}
        type="file"
        onChange={(event) => {
          Array.from(event.target.files ?? []).forEach((file) =>
            composer.addAttachment(file),
          );
          event.target.value = '';
        }}
      />
      {/* Action buttons */}
      <Stack direction="row" spacing={1} sx={{ px: 2, py: 1.5 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AttachFileRoundedIcon />}
          onClick={() => inputRef.current?.click()}
        >
          Attach files
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => composer.clear()}
          disabled={composer.value === '' && composer.attachments.length === 0}
        >
          Clear
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={
            composer.isSubmitting ||
            (composer.value.trim() === '' && composer.attachments.length === 0)
          }
          onClick={() => void composer.submit()}
          endIcon={<SendRoundedIcon />}
        >
          Submit
        </Button>
      </Stack>
    </Paper>
  );
}

export default function ComposerHeadlessChat() {
  return (
    <ChatProvider adapter={adapter} initialActiveConversationId="support">
      <ComposerInner />
    </ChatProvider>
  );
}
