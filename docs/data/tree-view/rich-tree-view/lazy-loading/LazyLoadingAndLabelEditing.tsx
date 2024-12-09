import * as React from 'react';
import Box from '@mui/material/Box';
import { randomInt, randomName, randomId } from '@mui/x-data-grid-generator';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view/models';
import { DataSourceCacheDefault } from '@mui/x-tree-view/utils';

const fetchData = async (): Promise<
  TreeViewBaseItem<{
    id: string;
    label: string;
    childrenCount?: number;
  }>[]
> => {
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
  const handleItemLabelChange = (itemId: TreeViewItemId, newLabel: string) => {
    const cachedData = customCache.get(itemId);
    if (cachedData) {
      console.log('cachedData', cachedData);
    }
  };

  return (
    <Box sx={{ width: '300px' }}>
      <RichTreeView
        items={[]}
        experimentalFeatures={{ lazyLoading: true, labelEditing: true }}
        onItemLabelChange={handleItemLabelChange}
        isItemEditable
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount as number,
          getTreeItems: fetchData,
        }}
        dataSourceCache={customCache}
      />
    </Box>
  );
}
