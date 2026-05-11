import * as React from 'react';
import { Box } from '@mui/material';
import {
  ChatComposer,
  ChatComposerAttachButton,
  ChatComposerAttachmentList,
  ChatComposerHelperText,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
} from '@mui/x-chat';
import type { ChatVariant } from '@mui/x-chat/headless';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat, ChatChrome } from './sharedProviders';
import { emptyConversation } from './sharedFixtures';
import { ChoiceControl, SwitchControl, TextControl } from './controls';

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M16.5 6v11.5a4 4 0 1 1-8 0V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6H10v9.5a2.5 2.5 0 1 0 5 0V5a4 4 0 0 0-8 0v12.5a5.5 5.5 0 1 0 11 0V6h-1.5z" />
    </svg>
  );
}

const DEFAULTS = {
  variant: 'default' as ChatVariant,
  disabled: false,
  attachments: true,
  showHelperText: true,
  maxFileCount: false,
  placeholder: 'Ask anything…',
};

export function ChatComposerPlayground() {
  const [variant, setVariant] = React.useState<ChatVariant>(DEFAULTS.variant);
  const [disabled, setDisabled] = React.useState(DEFAULTS.disabled);
  const [attachments, setAttachments] = React.useState(DEFAULTS.attachments);
  const [showHelperText, setShowHelperText] = React.useState(DEFAULTS.showHelperText);
  const [maxFileCount, setMaxFileCount] = React.useState(DEFAULTS.maxFileCount);
  const [placeholder, setPlaceholder] = React.useState(DEFAULTS.placeholder);

  const handleReset = React.useCallback(() => {
    setVariant(DEFAULTS.variant);
    setDisabled(DEFAULTS.disabled);
    setAttachments(DEFAULTS.attachments);
    setShowHelperText(DEFAULTS.showHelperText);
    setMaxFileCount(DEFAULTS.maxFileCount);
    setPlaceholder(DEFAULTS.placeholder);
  }, []);

  let attachmentConfig: boolean | { maxFileCount: number };
  if (!attachments) {
    attachmentConfig = false;
  } else if (maxFileCount) {
    attachmentConfig = { maxFileCount: 1 };
  } else {
    attachmentConfig = true;
  }

  const codeExample = `import {
  ChatComposer,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatComposerSendButton,
  ChatComposerAttachButton,
} from '@mui/x-chat';

<ChatComposer>
  <ChatComposerTextArea placeholder="Ask anything…" />
  <ChatComposerToolbar>
    <ChatComposerAttachButton />
    <ChatComposerSendButton />
  </ChatComposerToolbar>
</ChatComposer>`;

  return (
    <PlaygroundCard
      title="ChatComposer"
      description="Form surface for the prompt — attachment list, textarea, toolbar."
      previewBackground="background.default"
      previewMinHeight={260}
      span={2}
      codeExample={codeExample}
      onReset={handleReset}
      controls={
        <React.Fragment>
          <ChoiceControl<ChatVariant>
            label="variant"
            value={variant}
            options={['default', 'compact'] as const}
            onChange={setVariant}
          />
          <SwitchControl
            label="disabled"
            checked={disabled}
            onChange={setDisabled}
            helperText="palette.action.disabledBackground."
          />
          <SwitchControl
            label="attachments"
            checked={attachments}
            onChange={setAttachments}
            helperText="Show the attach button + preview list."
          />
          <SwitchControl
            label="helperText"
            checked={showHelperText}
            onChange={setShowHelperText}
            helperText="default variant only."
          />
          <SwitchControl
            label="maxFileCount: 1"
            checked={maxFileCount}
            onChange={setMaxFileCount}
            helperText="Stricter attach validation."
          />
          <TextControl label="placeholder" value={placeholder} onChange={setPlaceholder} />
        </React.Fragment>
      }
      preview={
        <ScopedChat conversations={[emptyConversation]}>
          <ChatChrome variant={variant} density="standard">
            <Box sx={{ width: '100%' }}>
              {variant === 'default' ? (
                <ChatComposer
                  variant="default"
                  disabled={disabled}
                  features={{ attachments: attachmentConfig }}
                >
                  {attachments ? <ChatComposerAttachmentList /> : null}
                  <ChatComposerTextArea placeholder={placeholder} />
                  {showHelperText ? (
                    <ChatComposerHelperText>
                      Press Enter to send, Shift+Enter for a new line.
                    </ChatComposerHelperText>
                  ) : null}
                  <ChatComposerToolbar>
                    {attachments ? (
                      <ChatComposerAttachButton>
                        <AttachIcon />
                      </ChatComposerAttachButton>
                    ) : null}
                    <ChatComposerSendButton>
                      <SendIcon />
                    </ChatComposerSendButton>
                  </ChatComposerToolbar>
                </ChatComposer>
              ) : (
                <ChatComposer
                  variant="compact"
                  disabled={disabled}
                  features={{ attachments: attachmentConfig }}
                >
                  {attachments ? <ChatComposerAttachmentList /> : null}
                  {attachments ? (
                    <ChatComposerAttachButton>
                      <AttachIcon />
                    </ChatComposerAttachButton>
                  ) : null}
                  <ChatComposerTextArea maxRows={5} placeholder={placeholder} />
                  <ChatComposerSendButton>
                    <SendIcon />
                  </ChatComposerSendButton>
                </ChatComposer>
              )}
            </Box>
          </ChatChrome>
        </ScopedChat>
      }
    />
  );
}
