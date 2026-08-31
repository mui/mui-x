import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { TreeItemLoader } from '@mui/x-tree-view/TreeItemLoader';

type ItemType = {
  id: string;
  label: string;
  childrenCount: number;
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

async function getTreeItems(parentId?: string): Promise<ItemType[]> {
  await sleep(parentId == null ? 1200 : 1800);

  const depth = parentId == null ? 0 : parentId.split('-').length;
  return Array.from({ length: 4 }, (_, index) => {
    const id = parentId == null ? `${index + 1}` : `${parentId}-${index + 1}`;
    // The first two items of the first two levels are expandable.
    const expandable = depth < 2 && index < 2;
    return {
      id,
      label: `${expandable ? 'Folder' : 'File'} ${id.replace(/-/g, '.')}`,
      childrenCount: expandable ? 4 : 0,
    };
  });
}

// Rendered by the tree item instead of the expansion icon while `status.loading` is `true`.
// It also receives the `size` and `thickness` props of the default `CircularProgress`
// icon, which this custom icon ignores.
function CustomLoadingIcon(props: { className?: string }) {
  return (
    <CachedRoundedIcon
      className={props.className}
      color="primary"
      sx={{
        fontSize: '1rem',
        animation: 'customLoadingIconSpin 1.4s linear infinite',
        '@keyframes customLoadingIconSpin': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
      }}
    />
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem {...props} ref={ref} slots={{ loadingIcon: CustomLoadingIcon }} />
  );
});

interface CustomLoadingProps {
  itemsCount?: number;
}

// Rendered instead of the default loading rows, for the whole tree and for the
// children of a lazily loading item.
function CustomLoading(props: CustomLoadingProps) {
  const { itemsCount = 0 } = props;

  return (
    <React.Fragment>
      {Array.from({ length: itemsCount }, (_, index) => (
        <TreeItemLoader key={index}>
          <FolderOpenRoundedIcon fontSize="small" color="disabled" />
          <Skeleton
            variant="rounded"
            height={12}
            sx={{ flexGrow: 1, maxWidth: `${70 - index * 12}%` }}
          />
        </TreeItemLoader>
      ))}
    </React.Fragment>
  );
}

export default function CustomizedLazyLoading() {
  return (
    <div style={{ width: 300, minHeight: 200 }}>
      <RichTreeViewPro
        items={[]}
        domStructure="nested"
        disableVirtualization
        slots={{ item: CustomTreeItem, loading: CustomLoading }}
        slotProps={{ loading: { itemsCount: 4 } }}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount ?? 0,
          getTreeItems,
        }}
      />
    </div>
  );
}
