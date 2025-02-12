import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ExampleToggleGroup from './ExampleToggleGroup';
import GitHubExample from './GitHubExample';
import FigmaExample from './FigmaExample';
import VsCodeExample from './VsCodeExample';

export default function MainDemo() {
  const [selectedExample, setSelectedExample] = React.useState<'github' | 'figma' | 'vscode'>(
    'github',
  );
  return (
    <Stack spacing={1}>
      <ExampleToggleGroup onToggleChange={setSelectedExample} />
      <Paper component="div" variant="outlined" sx={{ mb: 8 }}>
        {selectedExample === 'github' && <GitHubExample />}
        {selectedExample === 'figma' && <FigmaExample />}
        {selectedExample === 'vscode' && <VsCodeExample />}
      </Paper>
    </Stack>
  );
}
