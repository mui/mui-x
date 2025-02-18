import * as React from 'react';
import Stack from '@mui/material/Stack';
import GitHubTreeView from './GitHubTreeView';

export default function GitHubExample() {
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

  return (
    <Stack sx={{ width: '100%' }} direction="row" spacing={1}>
      <Stack
        p={2}
        sx={(theme) => ({
          overflowY: 'auto',
          borderRight: `1px solid ${theme.palette.divider}`,
          height: '100%',
        })}
      >
        <GitHubTreeView selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </Stack>

      <Stack>Editor</Stack>
    </Stack>
  );
}
