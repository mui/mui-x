'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ChatBox } from '@mui/x-chat';
import { useChatComposer } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/core/examples/shared/demoData';

const CustomComposerContent = React.forwardRef(function CustomComposerContent(
  props: React.HTMLAttributes<HTMLDivElement> & { ownerState?: unknown },
  ref: React.Ref<HTMLDivElement>,
) {
  // `composerRoot` is a wrapper-only slot: ChatBox injects a `ref` and form props
  // into it. Forward the ref and spread the injected props so the slot contract is
  // satisfied (no ref warning, form/data props preserved). Drop the internal
  // `ownerState` and the default `children` — this composition renders its own
  // composer UI from the headless hook instead.
  const { ownerState, children, ...rootProps } = props;
  const { value, setValue, submit, isSubmitting, addAttachment } = useChatComposer();

  return (
    <Stack ref={ref} direction="row" spacing={1} {...rootProps} sx={{ p: 1 }}>
      <TextField
        fullWidth
        size="small"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Type a message…"
      />
      <IconButton component="label">
        <AttachFileIcon />
        <input
          type="file"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              addAttachment(file);
            }
          }}
        />
      </IconButton>
      <Button variant="contained" onClick={submit} disabled={isSubmitting}>
        Send
      </Button>
    </Stack>
  );
});

const adapter = createEchoAdapter();

export default function CustomComposer() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{
        composerRoot: CustomComposerContent,
      }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
