import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatComposer,
  ChatComposerAttachButton,
  ChatComposerAttachmentList,
  ChatComposerHelperText,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
} from '@mui/x-chat';
import type { ChatAttachmentsConfig, ChatVariant } from '@mui/x-chat/headless';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import {
  ScopedChat,
  ChatChrome,
} from 'docs/src/modules/components/chat-playground/sharedProviders';
import { emptyConversation } from 'docs/src/modules/components/chat-playground/sharedFixtures';
import {
  ChoiceControl,
  DividerLabel,
  NumberControl,
  SwitchControl,
  TextControl,
} from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.5 6v11.5a4 4 0 1 1-8 0V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6H10v9.5a2.5 2.5 0 1 0 5 0V5a4 4 0 0 0-8 0v12.5a5.5 5.5 0 1 0 11 0V6h-1.5z" />
    </svg>
  );
}

const DEFAULTS = {
  variant: 'default' as ChatVariant,
  disabled: false,
  attachments: true,
  showHelperText: true,
  maxFileCount: 0,
  maxFileSizeMB: 0,
  acceptedMimeTypes: 'image/*,application/pdf',
  placeholder: 'Ask anything…',
};

type ClassKey =
  | 'root'
  | 'disabled'
  | 'variantCompact'
  | 'textArea'
  | 'sendButton'
  | 'attachButton'
  | 'toolbar'
  | 'attachmentList'
  | 'helperText';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  { name: 'root', description: 'Outermost form element.' },
  {
    name: 'disabled',
    selector: '.MuiChatComposer-disabled',
    description: 'Applied to the root when disabled.',
  },
  {
    name: 'variantCompact',
    selector: '.MuiChatComposer-variantCompact',
    description: 'Applied to the root when variant="compact".',
  },
  {
    name: 'textArea',
    selector: '.MuiChatComposer-textArea',
    description: 'Applied to the text area input.',
  },
  {
    name: 'sendButton',
    selector: '.MuiChatComposer-sendButton',
    description: 'Applied to the send button.',
  },
  {
    name: 'attachButton',
    selector: '.MuiChatComposer-attachButton',
    description: 'Applied to the attach button.',
  },
  {
    name: 'toolbar',
    selector: '.MuiChatComposer-toolbar',
    description: 'Applied to the toolbar row.',
  },
  {
    name: 'attachmentList',
    selector: '.MuiChatComposer-attachmentList',
    description: 'Applied to the attachment list above the textarea.',
  },
  {
    name: 'helperText',
    selector: '.MuiChatComposer-helperText',
    description: 'Applied to the helper text below the textarea.',
  },
];

export default function ChatComposerPlayground() {
  const [variant, setVariant] = React.useState<ChatVariant>(DEFAULTS.variant);
  const [disabled, setDisabled] = React.useState(DEFAULTS.disabled);
  const [attachments, setAttachments] = React.useState(DEFAULTS.attachments);
  const [showHelperText, setShowHelperText] = React.useState(
    DEFAULTS.showHelperText,
  );
  const [maxFileCount, setMaxFileCount] = React.useState(DEFAULTS.maxFileCount);
  const [maxFileSizeMB, setMaxFileSizeMB] = React.useState(DEFAULTS.maxFileSizeMB);
  const [acceptedMimeTypes, setAcceptedMimeTypes] = React.useState(
    DEFAULTS.acceptedMimeTypes,
  );
  const [placeholder, setPlaceholder] = React.useState(DEFAULTS.placeholder);
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  const handleReset = React.useCallback(() => {
    setVariant(DEFAULTS.variant);
    setDisabled(DEFAULTS.disabled);
    setAttachments(DEFAULTS.attachments);
    setShowHelperText(DEFAULTS.showHelperText);
    setMaxFileCount(DEFAULTS.maxFileCount);
    setMaxFileSizeMB(DEFAULTS.maxFileSizeMB);
    setAcceptedMimeTypes(DEFAULTS.acceptedMimeTypes);
    setPlaceholder(DEFAULTS.placeholder);
  }, []);

  const attachmentConfig: boolean | ChatAttachmentsConfig = React.useMemo(() => {
    if (!attachments) {
      return false;
    }
    const config: ChatAttachmentsConfig = {};
    const types = acceptedMimeTypes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (types.length > 0) {
      config.acceptedMimeTypes = types;
    }
    if (maxFileCount > 0) {
      config.maxFileCount = maxFileCount;
    }
    if (maxFileSizeMB > 0) {
      config.maxFileSize = maxFileSizeMB * 1024 * 1024;
    }
    return Object.keys(config).length === 0 ? true : config;
  }, [attachments, acceptedMimeTypes, maxFileCount, maxFileSizeMB]);

  const composerSx = classesCustomizations.toClassesSx();
  return (
    <PlaygroundCard
      title="ChatComposer"
      description="Form surface for the prompt — attachment list, textarea, toolbar."
      previewMinHeight={180}
      span={2}
      onReset={handleReset}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
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
          <DividerLabel>features.attachments</DividerLabel>
          <SwitchControl
            label="attachments"
            checked={attachments}
            onChange={setAttachments}
            helperText="Show the attach button + preview list."
          />
          <TextControl
            label="acceptedMimeTypes"
            value={acceptedMimeTypes}
            onChange={setAcceptedMimeTypes}
            placeholder="image/*,application/pdf"
            disabled={!attachments}
            helperText="Comma-separated MIME list."
          />
          <NumberControl
            label="maxFileCount"
            value={maxFileCount}
            min={0}
            max={10}
            disabled={!attachments}
            valueFormatter={(value) => (value === 0 ? '∞' : value.toString())}
            helperText="0 disables the limit."
            onChange={setMaxFileCount}
          />
          <NumberControl
            label="maxFileSize"
            value={maxFileSizeMB}
            min={0}
            max={50}
            disabled={!attachments}
            valueFormatter={(value) => (value === 0 ? 'unlimited' : `${value}MB`)}
            helperText="0 disables the limit."
            onChange={setMaxFileSizeMB}
          />
          <DividerLabel>composition (children)</DividerLabel>
          <TextControl
            label="ChatComposerTextArea.placeholder"
            value={placeholder}
            onChange={setPlaceholder}
          />
          <SwitchControl
            label="render ChatComposerHelperText"
            checked={showHelperText}
            onChange={setShowHelperText}
            helperText="default variant only."
          />
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
                  sx={composerSx as any}
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
                  sx={composerSx as any}
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
