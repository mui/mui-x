import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import useForkRef from '@mui/utils/useForkRef';
import { useLicenseVerifier, Watermark } from '@mui/x-license';
import {
  RichTreeViewItems,
  useTreeViewContext,
  UseTreeViewItemsSignature,
} from '@mui/x-tree-view/internals';
import { styled } from '../internals/zero-styled';
import { UseTreeViewVirtualizationSignature } from '../internals/plugins/useTreeViewVirtualization';
import { useTreeViewVirtualScroller } from './useTreeViewVirtualScroller';
import { TreeViewVirtualScrollerProps } from './TreeViewVirtualScroller.types';
import { getReleaseInfo } from '../internals/utils/releaseInfo';
import { TreeViewVirtualScrollbar } from './TreeViewVirtualScrollbar';

const TreeViewVirtualScrollerRoot = styled('div', {
  name: 'MuiTreeViewVirtualScroller',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  flexGrow: 1,
  position: 'relative',
  overflow: 'hidden',
});

const releaseInfo = getReleaseInfo();

export const TreeViewVirtualScroller = React.forwardRef(function TreeViewVirtualScroller(
  props: TreeViewVirtualScrollerProps,
  ref: React.Ref<HTMLUListElement>,
) {
  const { slots, slotProps, ...other } = props;

  useLicenseVerifier('x-tree-view-pro', releaseInfo);

  const { instance } =
    useTreeViewContext<[UseTreeViewVirtualizationSignature, UseTreeViewItemsSignature]>();
  const { getRootProps, getScrollbarProps } = useTreeViewVirtualScroller();
  const handleRef = useForkRef(ref, instance.virtualScrollerRef);

  const Root = slots.root;
  const rootProps = useSlotProps({
    elementType: Root,
    getSlotProps: getRootProps,
    externalForwardedProps: other,
    externalSlotProps: slotProps?.root,
    additionalProps: {
      ref: handleRef,
    },
    ownerState: props,
  });

  return (
    <TreeViewVirtualScrollerRoot as={Root} {...rootProps}>
      <RichTreeViewItems
        slots={slots}
        slotProps={slotProps}
        itemsToRender={instance.getItemsToRender()}
      />
      <TreeViewVirtualScrollbar {...getScrollbarProps()} />
      <Watermark packageName="x-tree-view-pro" releaseInfo={releaseInfo} />
    </TreeViewVirtualScrollerRoot>
  );
});
