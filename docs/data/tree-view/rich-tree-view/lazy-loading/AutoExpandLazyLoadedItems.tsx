import * as React from 'react';
import {
  randomInt,
  randomName,
  randomId,
  randomBoolean,
} from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { useRichTreeViewProApiRef } from '@mui/x-tree-view-pro/hooks';

type ItemType = {
  id: string;
  label: string;
  childrenCount?: number;
  children?: ItemType[];
};

/**
 * Simulates a server that includes sub-items in the response when the
 * subtree is small enough to be returned inline.
 */
const fetchChildren = async (_parentId?: string): Promise<ItemType[]> => {
  const length = randomInt(2, 5);
  const rows: ItemType[] = Array.from({ length }, () => {
    const id = randomId();
    const label = randomName({}, {});
    const hasChildren = randomBoolean();
    const childrenCount = hasChildren ? randomInt(1, 3) : 0;

    if (hasChildren && randomBoolean()) {
      // Include children inline — the server bundled the subtree in the response.
      return {
        id,
        label,
        childrenCount,
        children: Array.from({ length: childrenCount }, () => ({
          id: randomId(),
          label: randomName({}, {}),
          childrenCount: 0,
        })),
      };
    }

    return { id, label, ...(hasChildren ? { childrenCount } : {}) };
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rows);
    }, 500);
  });
};

export default function AutoExpandLazyLoadedItems() {
  const apiRef = useRichTreeViewProApiRef();

  return (
    <div style={{ width: 300, height: 240 }}>
      <RichTreeViewPro
        items={[]}
        apiRef={apiRef}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount as number,
          getTreeItems: fetchChildren,
        }}
        onItemsLazyLoaded={({ items }) => {
          // Expand any item whose children were already included in the server response.
          // Because the children are pre-cached, no additional network request is made.
          items.forEach((item) => {
            if (item.children && item.children.length > 0) {
              apiRef.current?.setItemExpansion({
                event: null,
                itemId: item.id,
                shouldBeExpanded: true,
              });
            }
          });
        }}
      />
    </div>
  );
}
