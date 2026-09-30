import * as React from 'react';
import ImageIcon from '@mui/icons-material/Image';
import PaperclipIcon from '@mui/icons-material/AttachFile';
import Box from '@mui/material/Box';
import {
  ChatComposer,
  ChatComposerAttachButton,
  ChatComposerTextArea,
} from '@mui/x-chat';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import { emptyConversation } from 'docs/src/modules/components/chat-playground/sharedFixtures';
import {
  ChoiceControl,
  DividerLabel,
  SwitchControl,
  TextControl,
} from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';

type IconChoice = 'paperclip' | 'image';

const icons: Record<IconChoice, React.ReactNode> = {
  paperclip: <PaperclipIcon />,
  image: <ImageIcon />,
};

type ClassKey = 'attachButton';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  {
    name: 'attachButton',
    selector: '.MuiChatComposer-attachButton',
    description: 'The attach button element inside the composer.',
  },
];

export default function ChatComposerAttachButtonPlayground() {
  const [icon, setIcon] = React.useState<IconChoice>('paperclip');
  const [accept, setAccept] = React.useState('image/*,application/pdf');
  const [disabled, setDisabled] = React.useState(false);
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  const wrapperSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatComposerAttachButton"
      description="Hidden file input + button — opens the OS file picker and reports new attachments."
      previewMinHeight={200}
      span={2}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
          <SwitchControl
            label="disabled"
            checked={disabled}
            onChange={setDisabled}
          />
          <DividerLabel>composition</DividerLabel>
          <ChoiceControl<IconChoice>
            label="children (icon)"
            value={icon}
            options={['paperclip', 'image'] as const}
            onChange={setIcon}
          />
          <DividerLabel>features.attachments (parent)</DividerLabel>
          <TextControl
            label="acceptedMimeTypes"
            value={accept}
            onChange={setAccept}
            helperText="Comma-separated MIME types passed to features.attachments on the parent composer."
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[emptyConversation]}
          activeConversationId={emptyConversation.id}
        >
          <Box sx={{ width: '100%', ...wrapperSx }}>
            <ChatComposer
              features={{
                attachments: {
                  acceptedMimeTypes: accept.split(',').map((s) => s.trim()),
                },
              }}
            >
              <ChatComposerTextArea placeholder="Attach something…" />
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <ChatComposerAttachButton disabled={disabled}>
                  {icons[icon]}
                </ChatComposerAttachButton>
              </Box>
            </ChatComposer>
          </Box>
        </ScopedChat>
      }
    />
  );
}
