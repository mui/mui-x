import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

function CustomItemLoaderContent(props) {
  const { ownerState, children, ...other } = props;

  return (
    <div {...other}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', px: 1, py: 0.75, width: '100%' }}
      >
        <Skeleton variant="circular" width={18} height={18} sx={{ flexShrink: 0 }} />
        <Skeleton variant="rounded" height={12} sx={{ flexGrow: 1 }} />
        <Typography variant="caption" color="text.secondary">
          {(ownerState?.index ?? 0) + 1}/{ownerState?.itemsCount ?? 0}
        </Typography>
      </Stack>
    </div>
  );
}

export default function LoadingCustomRows() {
  return (
    <RichTreeView
      items={[]}
      loading
      slots={{ itemLoaderContent: CustomItemLoaderContent }}
      slotProps={{
        loading: { itemsCount: 4 },
        itemLoader: (ownerState) => ({
          style: { opacity: 1 - ownerState.index * 0.2 },
        }),
      }}
      sx={{ width: 300 }}
    />
  );
}
