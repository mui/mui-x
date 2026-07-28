import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatMessageSkeleton } from '@mui/x-chat';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import {
  DividerLabel,
  NumberControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';

const CLASS_DEFS = [
  { name: 'root', description: 'The skeleton container.' },
  {
    name: 'line',
    selector: '.MuiChatMessageSkeleton-line',
    description: 'Each shimmer line.',
  },
];

export default function ChatMessageSkeletonPlayground() {
  const [lines, setLines] = React.useState(3);
  const classesCustomizations = useCustomizations(CLASS_DEFS);

  const skeletonSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatMessageSkeleton"
      description="Animated placeholder while a message is loading."
      previewMinHeight={160}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
          <NumberControl
            label="lines"
            value={lines}
            min={1}
            max={8}
            onChange={setLines}
          />
        </React.Fragment>
      }
      preview={
        <Box sx={{ width: '100%' }}>
          <ChatMessageSkeleton lines={lines} sx={skeletonSx} />
        </Box>
      }
    />
  );
}
