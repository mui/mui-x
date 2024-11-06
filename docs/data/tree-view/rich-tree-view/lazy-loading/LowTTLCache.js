import * as React from 'react';
import Box from '@mui/material/Box';
import { randomInt, randomName, randomId } from '@mui/x-data-grid-generator';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { TreeViewDataSourceCacheDefault } from '@mui/x-tree-view/utils';

const fetchData = async () => {
  const rows = Array.from({ length: 10 }, () => ({
    id: randomId(),
    label: randomName({}, {}),
    ...(randomInt(0, 1) ? { childrenCount: 10 } : {}),
  }));

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rows);
    }, 1000);
  });
};

const lowTTLCache = new TreeViewDataSourceCacheDefault({ ttl: 1000 * 10 }); // 10 seconds

export default function LowTTLCache() {
  return (
    <Box sx={{ width: '300px' }}>
      <RichTreeView
        items={[]}
        experimentalFeatures={{ lazyLoading: true }}
        treeViewDataSource={{
          getChildrenCount: (item) => item?.childrenCount,
          getTreeItems: fetchData,
        }}
        treeViewDataSourceCache={lowTTLCache}
      />
    </Box>
  );
}
