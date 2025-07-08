import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { randomName, randomId } from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { initialItems, ItemType } from './items';

export default function ErrorManagement() {
  const [failRequests, setFailRequests] = React.useState(false);
  const fetchData = async (): Promise<ItemType[]> => {
    const rows = Array.from({ length: 10 }, () => ({
      id: randomId(),
      label: randomName({}, {}),
      childrenCount: 10,
    }));

    // make the promise fail conditionally
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (failRequests) {
          reject(new Error('Error fetching data'));
        } else {
          resolve(rows);
        }
      }, 1000);
    });
  };

  return (
    <Stack spacing={2} sx={{ width: '300px' }}>
      <Button
        onClick={() => setFailRequests((prev) => !prev)}
        variant="outlined"
        fullWidth
      >
        {failRequests ? 'Resolve requests' : 'Fail Requests'}
      </Button>
      <RichTreeViewPro
        items={initialItems}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount as number,
          getTreeItems: fetchData,
        }}
      />
    </Stack>
  );
}
