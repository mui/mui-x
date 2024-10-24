import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils';
import { TreeItem, TreeItemProps } from '../../TreeItem';
import { TreeViewItemId } from '../../models';
import { TreeViewItemToRenderProps } from '../plugins/useTreeViewItems';

const RichTreeViewItemsContext = React.createContext<
  ((item: TreeViewItemToRenderProps) => React.ReactNode) | null
>(null);

if (process.env.NODE_ENV !== 'production') {
  RichTreeViewItemsContext.displayName = 'RichTreeViewItemsProvider';
}

const areChildrenEqual = (childA: TreeViewItemToRenderProps, childB: TreeViewItemToRenderProps) => {
  if (childA.itemId !== childB.itemId) {
    return false;
  }
  if (childA.id !== childB.id) {
    return false;
  }
  if (childA.label !== childB.label) {
    return false;
  }
  if (childA.children.length !== childB.children.length) {
    return false;
  }
  for (let i = 0; i < childA.children.length; i += 1) {
    if (!areChildrenEqual(childA.children[i], childB.children[i])) {
      return false;
    }
  }
  return true;
};

// Logic copied from `fastObjectShallowCompare` but with a deep comparison for `props.children`
const is = Object.is;
const propsAreEqual = (a: WrappedTreeItemProps, b: WrappedTreeItemProps) => {
  if (a === b) {
    return true;
  }
  if (!(a instanceof Object) || !(b instanceof Object)) {
    return false;
  }

  let aLength = 0;
  let bLength = 0;

  /* eslint-disable guard-for-in */
  for (const key in a) {
    aLength += 1;

    if (key === 'itemsToRender') {
      const childrenA = a[key];
      const childrenB = b[key];
      if (!Array.isArray(childrenA) || !Array.isArray(childrenB)) {
        if (!is(a[key], b[key])) {
          return false;
        }
      } else if (childrenA.length !== childrenB.length) {
        return false;
      } else {
        for (let i = 0; i < childrenA.length; i += 1) {
          if (React.isValidElement(childrenA[i]) || React.isValidElement(childrenB[i])) {
            if (!is(a[key], b[key])) {
              return false;
            }
          } else if (!areChildrenEqual(childrenA[i], childrenB[i])) {
            return false;
          }
        }
      }
    } else {
      if (!is(a[key as keyof WrappedTreeItemProps], b[key as keyof WrappedTreeItemProps])) {
        return false;
      }
      if (!(key in b)) {
        return false;
      }
    }
  }

  /* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars */
  for (const _ in b) {
    bLength += 1;
  }
  return aLength === bLength;
};

const WrappedTreeItem = React.memo(function WrappedTreeItem({
  itemSlot,
  itemSlotProps,
  label,
  id,
  itemId,
  itemsToRender,
}: WrappedTreeItemProps) {
  const renderItemForRichTreeView = React.useContext(RichTreeViewItemsContext)!;

  const Item = (itemSlot ?? TreeItem) as React.JSXElementConstructor<TreeItemProps>;
  const { ownerState, ...itemProps } = useSlotProps({
    elementType: Item,
    externalSlotProps: itemSlotProps,
    additionalProps: { itemId, id, label },
    ownerState: { itemId, label },
  });

  return <Item {...itemProps}>{itemsToRender?.map(renderItemForRichTreeView)}</Item>;
}, propsAreEqual);

export function RichTreeViewItems(props: RichTreeViewItemsProps) {
  const { itemsToRender, slots, slotProps } = props;

  const itemSlot = slots?.item as React.JSXElementConstructor<TreeItemProps> | undefined;
  const itemSlotProps = slotProps?.item;

  const renderItem = React.useCallback(
    (item: TreeViewItemToRenderProps) => {
      return (
        <WrappedTreeItem
          itemSlot={itemSlot}
          itemSlotProps={itemSlotProps}
          key={item.itemId}
          label={item.label}
          id={item.id}
          itemId={item.itemId}
          itemsToRender={item.children}
        />
      );
    },
    [itemSlot, itemSlotProps],
  );

  return (
    <RichTreeViewItemsContext.Provider value={renderItem}>
      {itemsToRender.map(renderItem)}
    </RichTreeViewItemsContext.Provider>
  );
}

interface RichTreeViewItemsOwnerState {
  itemId: TreeViewItemId;
  label: string;
}

export interface RichTreeViewItemsSlots {
  /**
   * Custom component to render a Tree Item.
   * @default TreeItem.
   */
  item?: React.JSXElementConstructor<TreeItemProps>;
}

export interface RichTreeViewItemsSlotProps {
  item?: SlotComponentProps<typeof TreeItem, {}, RichTreeViewItemsOwnerState>;
}

export interface RichTreeViewItemsProps {
  itemsToRender: TreeViewItemToRenderProps[];
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: RichTreeViewItemsSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RichTreeViewItemsSlotProps;
}

interface WrappedTreeItemProps extends Pick<TreeItemProps, 'id' | 'itemId' | 'children'> {
  itemSlot: React.JSXElementConstructor<TreeItemProps> | undefined;
  itemSlotProps: SlotComponentProps<typeof TreeItem, {}, RichTreeViewItemsOwnerState> | undefined;
  label: string;
  itemsToRender: TreeViewItemToRenderProps[] | undefined;
}
