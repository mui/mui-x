import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItemLoader } from '@mui/x-tree-view/TreeItemLoader';

function CustomItemLoader(props) {
  const { ownerState, ...other } = props;

  return (
    <TreeItemLoader {...other}>
      <Skeleton variant="circular" width={18} height={18} sx={{ flexShrink: 0 }} />
      <Skeleton variant="rounded" height={12} sx={{ flexGrow: 1 }} />
      <Typography variant="caption" color="text.secondary">
        {(ownerState?.index ?? 0) + 1}/{ownerState?.itemsCount ?? 0}
      </Typography>
    </TreeItemLoader>
  );
}

export default function LoadingCustomRows() {
  return (
    <RichTreeView
      items={[]}
      loading
      slots={{ itemLoader: CustomItemLoader }}
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
