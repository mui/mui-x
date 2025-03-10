import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ExampleToggleGroup from './ExampleToggleGroup';
import GitHubExample from './github/GitHubExample';
import FigmaExample from './figma/FigmaExample';

export default function MainDemo() {
  const [selectedExample, setSelectedExample] = React.useState<'github' | 'figma' | 'vscode'>(
    'figma',
  );
  return (
    <Stack spacing={1} pb={8}>
      <ExampleToggleGroup selected={selectedExample} onToggleChange={setSelectedExample} />
      <Paper component="div" variant="outlined" sx={{ mb: 8, height: { md: 640 }, overflow: 'hidden' }}>
        {selectedExample === 'github' && <GitHubExample />}
        {selectedExample === 'figma' && <FigmaExample />}
      </Paper>
    </Stack>
  );
}
