import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { useSlotProps } from '@mui/base/utils';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import {
  useTreeView,
  TreeViewProvider,
  buildWarning,
  extractPluginParamsFromProps,
} from '@mui/x-tree-view/internals';
import { getRichTreeViewProUtilityClass } from './richTreeViewProClasses';
import {
  RichTreeViewProProps,
  RichTreeViewProSlotProps,
  RichTreeViewProSlots,
} from './RichTreeViewPro.types';
import { DEFAULT_TREE_VIEW_PRO_PLUGINS } from '../internals/plugins';

const useUtilityClasses = <R extends {}, Multiple extends boolean | undefined>(
  ownerState: RichTreeViewProProps<R, Multiple>,
) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getRichTreeViewProUtilityClass, classes);
};

export const RichTreeViewProRoot = styled('ul', {
  name: 'MuiRichTreeViewPro',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: RichTreeViewProProps<any, any> }>({
  padding: 0,
  margin: 0,
  listStyle: 'none',
  outline: 0,
});

type RichTreeViewProComponent = (<R extends {}, Multiple extends boolean | undefined = undefined>(
  props: RichTreeViewProProps<R, Multiple> & React.RefAttributes<HTMLUListElement>,
) => React.JSX.Element) & { propTypes?: any };

function WrappedTreeItem<R extends {}>({
  slots,
  slotProps,
  label,
  id,
  itemId,
  children,
}: Pick<RichTreeViewProProps<R, any>, 'slots' | 'slotProps'> &
  Pick<TreeItemProps, 'id' | 'itemId' | 'children'> & { label: string }) {
  const Item = slots?.item ?? TreeItem;
  const itemProps = useSlotProps({
    elementType: Item,
    externalSlotProps: slotProps?.item,
    additionalProps: { itemId, id, label },
    ownerState: { itemId, label },
  });

  return <Item {...itemProps}>{children}</Item>;
}

const childrenWarning = buildWarning([
  'MUI X: The `RichTreeView` component does not support JSX children.',
  'If you want to add items, you need to use the `items` prop',
  'Check the documentation for more details: https://mui.com/x/react-tree-view/rich-tree-view/items/',
]);

/**
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/x/react-tree-view/)
 *
 * API:
 *
 * - [RichTreeView API](https://mui.com/x/api/tree-view/rich-tree-view/)
 */
const RichTreeViewPro = React.forwardRef(function RichTreeViewPro<
  R extends {},
  Multiple extends boolean | undefined = undefined,
>(inProps: RichTreeViewProProps<R, Multiple>, ref: React.Ref<HTMLUListElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiRichTreeViewPro' });

  if (process.env.NODE_ENV !== 'production') {
    if ((props as any).children != null) {
      childrenWarning();
    }
  }

  const { pluginParams, slots, slotProps, otherProps } = extractPluginParamsFromProps<
    typeof DEFAULT_TREE_VIEW_PRO_PLUGINS,
    RichTreeViewProSlots,
    RichTreeViewProSlotProps<R, Multiple>,
    RichTreeViewProProps<R, Multiple>
  >({
    props,
    plugins: DEFAULT_TREE_VIEW_PRO_PLUGINS,
    rootRef: ref,
  });

  const { getRootProps, contextValue, instance } = useTreeView(pluginParams);

  const classes = useUtilityClasses(props);

  const Root = slots?.root ?? RichTreeViewProRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: otherProps,
    className: classes.root,
    getSlotProps: getRootProps,
    ownerState: props as RichTreeViewProProps<any, any>,
  });

  const itemsToRender = instance.getItemsToRender();

  const renderItem = ({
    label,
    itemId,
    id,
    children,
  }: ReturnType<typeof instance.getItemsToRender>[number]) => {
    return (
      <WrappedTreeItem
        slots={slots}
        slotProps={slotProps}
        key={itemId}
        label={label}
        id={id}
        itemId={itemId}
      >
        {children?.map(renderItem)}
      </WrappedTreeItem>
    );
  };

  return (
    <TreeViewProvider value={contextValue}>
      <Root {...rootProps}>{itemsToRender.map(renderItem)}</Root>
    </TreeViewProvider>
  );
}) as RichTreeViewProComponent;

export { RichTreeViewPro };
