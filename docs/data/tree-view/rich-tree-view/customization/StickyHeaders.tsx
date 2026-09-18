import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS, DEFAULT_EXPANDED_ITEMS } from '../../datasets/deepProducts';

const ITEM_HEIGHT = 32;

const StickyRichTreeView = styled(RichTreeView)(({ theme }) => ({
  // Extra space so the last parents can also reach the top and stick.
  paddingBottom: 224,
  [`& .${treeItemClasses.content}[data-expanded]`]: {
    position: 'sticky',
    // Stack deeper levels below shallower ones.
    top: `calc(var(--TreeView-itemDepth) * ${ITEM_HEIGHT}px)`,
    zIndex: 'calc(100 - var(--TreeView-itemDepth))',
    backgroundColor: (theme.vars || theme).palette.background.paper,
    boxShadow: (theme.vars || theme).shadows[1],
    // Paint the hover, focus, and selected states over the solid background.
    backgroundImage:
      'linear-gradient(var(--sticky-overlay, transparent), var(--sticky-overlay, transparent))',
    '&:hover': {
      '--sticky-overlay': (theme.vars || theme).palette.action.hover,
    },
    '&[data-focused]': {
      '--sticky-overlay': (theme.vars || theme).palette.action.focus,
    },
    '&[data-selected]': {
      '--sticky-overlay': theme.alpha(
        (theme.vars || theme).palette.primary.main,
        (theme.vars || theme).palette.action.selectedOpacity,
      ),
    },
  },
}));

export default function StickyHeaders() {
  return (
    <Box sx={{ height: 352, width: 280, overflowY: 'auto' }}>
      <StickyRichTreeView
        items={MUI_X_PRODUCTS}
        itemHeight={ITEM_HEIGHT}
        defaultExpandedItems={DEFAULT_EXPANDED_ITEMS}
      />
    </Box>
  );
}
