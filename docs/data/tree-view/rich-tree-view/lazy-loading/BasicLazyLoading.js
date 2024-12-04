import * as React from 'react';
import Box from '@mui/material/Box';
import {
  randomInt,
  randomName,
  randomId,
  randomBoolean,
} from '@mui/x-data-grid-generator';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

const fetchData = async () => {
  const length = randomInt(2, 10);
  const rows = Array.from({ length }, () => ({
    id: randomId(),
    label: randomName({}, {}),
    ...(randomBoolean() ? { childrenCount: length } : {}),
  }));

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rows);
    }, 1000);
  });
};

export default function BasicLazyLoading() {
  return (
    <Box sx={{ width: '300px' }}>
      <RichTreeView
        items={[]}
        experimentalFeatures={{ lazyLoading: true }}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount,
          getTreeItems: fetchData,
        }}
      />
    </Box>
  );
}
