import * as React from 'react';
import { Box } from '@mui/material';
import { ChatMessageSkeleton } from '@mui/x-chat';
import { PlaygroundCard } from './PlaygroundCard';
import { NumberControl } from './controls';

export function ChatMessageSkeletonPlayground() {
  const [lines, setLines] = React.useState(3);

  const codeExample = `import { ChatMessageSkeleton } from '@mui/x-chat';

// Loading placeholder, no provider needed
<ChatMessageSkeleton lines={3} />`;

  return (
    <PlaygroundCard
      title="ChatMessageSkeleton"
      description="Animated placeholder while a message is loading."
      previewMinHeight={160}
      codeExample={codeExample}
      controls={<NumberControl label="lines" value={lines} min={1} max={8} onChange={setLines} />}
      preview={
        <Box sx={{ width: '100%' }}>
          <ChatMessageSkeleton lines={lines} />
        </Box>
      }
    />
  );
}
