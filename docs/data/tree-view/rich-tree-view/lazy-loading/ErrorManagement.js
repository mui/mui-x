import * as React from 'react';
import Box from '@mui/material/Box';
import { randomName, randomId } from '@mui/x-data-grid-generator';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

const fetchData = async (parentId) => {
  if (parentId) {
    throw new Error('Parent ID should be null');
  }
  const rows = Array.from({ length: 10 }, () => ({
    id: randomId(),
    label: randomName({}, {}),
    childrenCount: 10,
  }));

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rows);
    }, 1000);
  });
};

export default function ErrorManagement() {
  return (
    <Box sx={{ maxWidth: '300px', margin: 4 }}>
      <RichTreeView
        items={[]}
        experimentalFeatures={{ lazyLoading: true }}
        treeViewDataSource={{
          getChildrenCount: (item) => item?.childrenCount,
          getTreeItems: fetchData,
        }}
      />
    </Box>
  );
}
