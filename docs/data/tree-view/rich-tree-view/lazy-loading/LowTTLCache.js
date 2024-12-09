import * as React from 'react';
import Box from '@mui/material/Box';
import { randomInt, randomName, randomId } from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';

import { DataSourceCacheDefault } from '@mui/x-tree-view/utils';

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

const lowTTLCache = new DataSourceCacheDefault({ ttl: 1000 * 10 }); // 10 seconds

export default function LowTTLCache() {
  return (
    <Box sx={{ width: '300px' }}>
      <RichTreeViewPro
        items={[]}
        experimentalFeatures={{ lazyLoading: true }}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount,
          getTreeItems: fetchData,
        }}
        dataSourceCache={lowTTLCache}
      />
    </Box>
  );
}
