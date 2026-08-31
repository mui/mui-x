import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';

import { useSpring, animated } from '@react-spring/web';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import {
  TreeItemLoader,
  treeItemLoaderClasses,
} from '@mui/x-tree-view/TreeItemLoader';

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

async function getTreeItems(parentId) {
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

// Spring-based expand/collapse of the item groups.
function SpringGroupTransition(props) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : -10}px,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

// Three bouncing dots replace the circular progress while an item loads its children.
// The component also receives the `size` and `thickness` props of the default icon,
// which it ignores.
function BouncingDotsLoadingIcon(props) {
  return (
    <Box
      component="span"
      className={props.className}
      sx={{
        display: 'inline-flex',
        gap: '3px',
        alignItems: 'center',
        '& > span': {
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          animation: 'bouncingDot 0.9s ease-in-out infinite',
        },
        '& > span:nth-of-type(2)': { animationDelay: '0.15s' },
        '& > span:nth-of-type(3)': { animationDelay: '0.3s' },
        '@keyframes bouncingDot': {
          '0%, 100%': { transform: 'translateY(0)', opacity: 0.5 },
          '50%': { transform: 'translateY(-3px)', opacity: 1 },
        },
      }}
    >
      <span />
      <span />
      <span />
    </Box>
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        loadingIcon: BouncingDotsLoadingIcon,
        groupTransition: SpringGroupTransition,
      }}
    />
  );
});

// Rendered instead of the default loading rows, for the whole tree and for the
// children of a lazily loading item.
function CustomLoading(props) {
  const { itemsCount = 0 } = props;

  return (
    <React.Fragment>
      {Array.from({ length: itemsCount }, (_, index) => (
        <TreeItemLoader key={index} style={{ animationDelay: `${index * 90}ms` }}>
          <Skeleton
            variant="circular"
            width={18}
            height={18}
            sx={{ flexShrink: 0 }}
          />
          <Skeleton
            variant="rounded"
            height={12}
            sx={{ flexGrow: 1, maxWidth: `${75 - index * 12}%` }}
          />
        </TreeItemLoader>
      ))}
    </React.Fragment>
  );
}

// Number of sibling rows with a staggered entrance delay.
const STAGGERED_ROWS_COUNT = 8;

// Staggered entrance of sibling items, keyed by `nth-of-type` selectors.
// The loading rows set their delay inline instead.
const ITEM_STAGGER_DELAYS = Object.fromEntries(
  Array.from({ length: STAGGERED_ROWS_COUNT }, (_, index) => [
    `& .${treeItemClasses.root}:nth-of-type(${index + 1}) > .${treeItemClasses.content}`,
    { animationDelay: `${index * 60}ms` },
  ]),
);

export default function CustomizedLazyLoading() {
  return (
    <Box sx={{ width: 300, minHeight: 200 }}>
      <RichTreeViewPro
        items={[]}
        domStructure="nested"
        disableVirtualization
        itemHeight={32}
        slots={{ item: CustomTreeItem, loading: CustomLoading }}
        slotProps={{ loading: { itemsCount: 4 } }}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount ?? 0,
          getTreeItems,
        }}
        sx={{
          // The loading rows and the items share the same springy entrance,
          // so the swap between them reads as one continuous motion.
          [`& .${treeItemLoaderClasses.root}, & .${treeItemClasses.content}`]: {
            borderRadius: 1,
            transformOrigin: 'left center',
            animation: 'popIn 420ms cubic-bezier(0.34, 1.56, 0.64, 1) backwards',
          },
          ...ITEM_STAGGER_DELAYS,
          '@keyframes popIn': {
            from: { opacity: 0, transform: 'scale(0.85) translateX(-8px)' },
            to: { opacity: 1, transform: 'none' },
          },
        }}
      />
    </Box>
  );
}
