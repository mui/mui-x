import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { shouldForwardProp } from '@mui/system/createStyled';
import { useLicenseVerifier, Watermark } from '@mui/x-license';
import {
  RichTreeViewItems,
  useTreeViewContext,
  UseTreeViewItemsSignature,
} from '@mui/x-tree-view/internals';
import { styled } from '../internals/zero-styled';
import { useTreeViewVirtualScroller } from './useTreeViewVirtualScroller';
import { TreeViewVirtualScrollerProps } from './TreeViewVirtualScroller.types';
import { getReleaseInfo } from '../internals/utils/releaseInfo';

const TreeViewVirtualScrollerRoot = styled('div', {
  name: 'MuiTreeViewVirtualScroller',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'enableVirtualization',
})({
  variants: [
    {
      props: { enableVirtualization: true },
      style: {
        flexGrow: 1,
        position: 'relative',
        overflow: 'hidden',
      },
    },
  ],
});

const releaseInfo = getReleaseInfo();

export const TreeViewVirtualScroller = React.forwardRef(function TreeViewVirtualScroller(
  props: TreeViewVirtualScrollerProps,
  ref: React.Ref<HTMLUListElement>,
) {
  const { enableVirtualization, slots, slotProps, ...other } = props;

  useLicenseVerifier('x-tree-view-pro', releaseInfo);

  const { instance } = useTreeViewContext<[UseTreeViewItemsSignature]>();
  const { getRootProps } = useTreeViewVirtualScroller({ enableVirtualization });

  const Root = slots.root;
  const rootProps = useSlotProps({
    getSlotProps: getRootProps,
    externalForwardedProps: other,
    externalSlotProps: slotProps?.root,
    additionalProps: {
      ref,
    },
  });

  return (
    <TreeViewVirtualScrollerRoot as={Root} {...rootProps}>
      <RichTreeViewItems
        slots={slots}
        slotProps={slotProps}
        itemsToRender={instance.getItemsToRender()}
      />
      <Watermark packageName="x-tree-view-pro" releaseInfo={releaseInfo} />
    </TreeViewVirtualScrollerRoot>
  );
});
