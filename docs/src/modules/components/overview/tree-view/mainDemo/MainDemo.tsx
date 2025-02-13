import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ExampleToggleGroup from './ExampleToggleGroup';
import GitHubExample from './GitHubExample';
import FigmaExample from './figma/FigmaExample';
import VsCodeExample from './VsCodeExample';

export default function MainDemo() {
  const [selectedExample, setSelectedExample] = React.useState<'github' | 'figma' | 'vscode'>(
    'figma',
  );
  return (
    <Stack spacing={1}>
      <ExampleToggleGroup selected={selectedExample} onToggleChange={setSelectedExample} />
      <Paper component="div" variant="outlined" sx={{ mb: 8, height: 600, overflow: 'hidden' }}>
        {selectedExample === 'github' && <GitHubExample />}
        {selectedExample === 'figma' && <FigmaExample />}
        {selectedExample === 'vscode' && <VsCodeExample />}
      </Paper>
    </Stack>
  );
}
