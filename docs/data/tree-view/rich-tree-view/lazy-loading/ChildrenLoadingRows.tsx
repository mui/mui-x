import * as React from 'react';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';

type ItemType = {
  id: string;
  label: string;
  childrenCount: number;
};

const getTreeItems = async (parentId?: string): Promise<ItemType[]> => {
  const depth = parentId == null ? 0 : parentId.split('.').length;
  const items = Array.from({ length: 4 }, (_, index) => {
    const id = parentId == null ? `${index + 1}` : `${parentId}.${index + 1}`;
    return {
      id,
      label: `Item ${id}`,
      // Stop nesting after the third level.
      childrenCount: depth < 2 ? 4 : 0,
    };
  });

  return new Promise((resolve) => {
    setTimeout(() => resolve(items), 1500);
  });
};

export default function ChildrenLoadingRows() {
  return (
    <div style={{ width: 300 }}>
      <RichTreeViewPro
        items={[]}
        domStructure="nested"
        disableVirtualization
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount as number,
          getTreeItems,
        }}
      />
    </div>
  );
}
