import * as React from 'react';
import Box from '@mui/material/Box';
import { randomInt, randomName, randomId } from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';

import { DataSourceCacheDefault } from '@mui/x-tree-view/utils';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

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

const customCache = new DataSourceCacheDefault({}); // 10 seconds

export default function LazyLoadingAndLabelEditing() {
  const apiRef = useTreeViewApiRef();

  const handleItemLabelChange = (itemId, newLabel) => {
    const parentId = apiRef.current?.getParentId(itemId) || 'root';

    const cachedData = customCache.get(parentId);
    if (cachedData !== undefined && cachedData !== -1) {
      const newCache = cachedData.map((item) => {
        const newItem = item;
        if (item.id === itemId) {
          newItem.label = newLabel;
        }

        return newItem;
      });
      customCache.set(parentId, newCache);
    }
  };

  return (
    <Box sx={{ width: '300px' }}>
      <RichTreeViewPro
        items={[]}
        apiRef={apiRef}
        experimentalFeatures={{ lazyLoading: true }}
        onItemLabelChange={handleItemLabelChange}
        isItemEditable
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount,
          getTreeItems: fetchData,
        }}
        dataSourceCache={customCache}
      />
    </Box>
  );
}
