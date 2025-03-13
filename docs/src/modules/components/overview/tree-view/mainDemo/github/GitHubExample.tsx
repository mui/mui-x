import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import GitHubTreeView from './GitHubTreeView';
import GitHubFiles from './GitHubFiles';

export default function GitHubExample() {
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
  const docsTheme = useTheme();
  const isMd = useMediaQuery(docsTheme.breakpoints.up('md'), { defaultMatches: true });

  return (
    <Stack sx={{ width: '100%', height: '100%', overflowY: 'auto' }} direction="row" spacing={0}>
      <Stack
        p={2}
        sx={(theme) => ({
          overflowY: 'auto',
          borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
          height: '100%',
          minWidth: { xs: '100%', md: 'fit-content' },
          alignItems: 'center',
        })}
      >
        <GitHubTreeView selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </Stack>
      {isMd && <GitHubFiles selectedItem={selectedItem} setSelectedItem={setSelectedItem} />}
    </Stack>
  );
}
