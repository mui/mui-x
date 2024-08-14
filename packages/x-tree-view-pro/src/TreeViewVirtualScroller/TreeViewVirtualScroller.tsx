import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { useLicenseVerifier, Watermark } from '@mui/x-license';
import { RichTreeViewItems } from '@mui/x-tree-view/internals';
import { styled } from '../internals/zero-styled';
import { useTreeViewVirtualScroller } from './useTreeViewVirtualScroller';
import { TreeViewVirtualScrollerProps } from './TreeViewVirtualScroller.types';
import { getReleaseInfo } from '../internals/utils/releaseInfo';
import { TreeViewVirtualScrollbar } from './TreeViewVirtualScrollbar';

const TreeViewVirtualScrollerRoot = styled('div', {
  name: 'MuiTreeViewVirtualScroller',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  '--TreeView-scrollbarSize': '10px',
  '--TreeView-hasScrollX': '0',
  '--TreeView-hasScrollY': '0',
  flexGrow: 1,
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
});

const TreeViewVirtualScrollerContent = styled('div', {
  name: 'MuiTreeViewVirtualScroller',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
})({});

const TreeViewVirtualScrollerScroller = styled('div', {
  name: 'MuiTreeViewVirtualScroller',
  slot: 'Scroller',
  overridesResolver: (props, styles) => styles.scroller,
})({
  position: 'relative',
  height: '100%',
  overflow: 'scroll',
  scrollbarWidth: 'none' /* Firefox */,
  '&::-webkit-scrollbar': {
    display: 'none' /* Safari and Chrome */,
  },

  '@media print': {
    overflow: 'hidden',
  },

  // See https://github.com/mui/mui-x/issues/10547
  zIndex: 0,
});

const TreeViewVirtualScrollerRenderZone = styled('div', {
  name: 'MuiTreeViewVirtualScroller',
  slot: 'RenderZone',
  overridesResolver: (props, styles) => styles.renderZone,
})({
  position: 'absolute',
  display: 'flex', // Prevents margin collapsing when using `getRowSpacing`
  flexDirection: 'column',
});

const releaseInfo = getReleaseInfo();

/**
 * @ignore - do not document.
 */
export const TreeViewVirtualScroller = React.forwardRef(function TreeViewVirtualScroller(
  props: TreeViewVirtualScrollerProps,
  ref: React.Ref<HTMLUListElement>,
) {
  const { slots, slotProps, ...other } = props;

  useLicenseVerifier('x-tree-view-pro', releaseInfo);
  const {
    getRootProps,
    getScrollerProps,
    getContentProps,
    getRenderZoneProps,
    getScrollbarProps,
    getItemsToRender,
  } = useTreeViewVirtualScroller();

  const Root = slots.root;
  const rootProps = useSlotProps({
    elementType: Root,
    getSlotProps: getRootProps,
    externalForwardedProps: other,
    externalSlotProps: slotProps?.root,
    additionalProps: {
      ref,
    },
    ownerState: props,
  });

  return (
    <TreeViewVirtualScrollerRoot as={Root} {...rootProps}>
      <TreeViewVirtualScrollerScroller {...getScrollerProps()}>
        <TreeViewVirtualScrollerContent {...getContentProps()}>
          <TreeViewVirtualScrollerRenderZone {...getRenderZoneProps()}>
            <RichTreeViewItems
              slots={slots}
              slotProps={slotProps}
              itemsToRender={getItemsToRender()}
            />
          </TreeViewVirtualScrollerRenderZone>
        </TreeViewVirtualScrollerContent>
      </TreeViewVirtualScrollerScroller>
      <TreeViewVirtualScrollbar {...getScrollbarProps()} />
      <Watermark packageName="x-tree-view-pro" releaseInfo={releaseInfo} />
    </TreeViewVirtualScrollerRoot>
  );
});
