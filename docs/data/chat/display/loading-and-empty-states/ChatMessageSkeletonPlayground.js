import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatMessageSkeleton } from '@mui/x-chat';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { NumberControl } from '../../_playground/controls';

export default function ChatMessageSkeletonPlayground() {
  const [lines, setLines] = React.useState(3);
  return (
    <PlaygroundCard
      title="ChatMessageSkeleton"
      description="Animated placeholder while a message is loading."
      previewMinHeight={160}
      controls={
        <NumberControl
          label="lines"
          value={lines}
          min={1}
          max={8}
          onChange={setLines}
        />
      }
      preview={
        <Box sx={{ width: '100%' }}>
          <ChatMessageSkeleton lines={lines} />
        </Box>
      }
    />
  );
}
