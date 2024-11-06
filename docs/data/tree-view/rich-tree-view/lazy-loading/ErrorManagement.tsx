import * as React from 'react';
import Box from '@mui/material/Box';
import { randomName, randomId } from '@mui/x-data-grid-generator';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view/models';

const fetchData = async (
  parentId?: TreeViewItemId,
): Promise<
  TreeViewBaseItem<{
    id: string;
    label: string;
    childrenCount?: number;
  }>[]
> => {
  const rows = Array.from({ length: 10 }, () => ({
    id: randomId(),
    label: randomName({}, {}),
    childrenCount: 10,
  }));

  // make the promise fail if the item has a parent
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (parentId) {
        reject(new Error('Error fetching data'));
      } else {
        resolve(rows);
      }
    }, 1000);
  });
};

export default function ErrorManagement() {
  return (
    <Box sx={{ width: '300px' }}>
      <RichTreeView
        items={[]}
        experimentalFeatures={{ lazyLoading: true }}
        treeViewDataSource={{
          getChildrenCount: (item) => item?.childrenCount as number,
          getTreeItems: fetchData,
        }}
      />
    </Box>
  );
}
