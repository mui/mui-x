import { TreeViewItemId } from '../../../models';
import {TreeViewInstance, TreeViewNode} from '../../models';
import { UseTreeViewNodesSignature, UseTreeViewNodesState} from './useTreeViewNodes.types';

export const removeItemFromTree = <R extends { children?: R[] }>({ instance, node, state }: {
    instance: TreeViewInstance<[UseTreeViewNodesSignature]>,
    node: TreeViewNode,
    state: UseTreeViewNodesState<R>
}) => {
    // 1. We determine the list of ids needed to reach our item to remove
    const ancestors: TreeViewItemId[] = []
    let currentAncestor = node
    while (currentAncestor.parentId != null) {
        ancestors.unshift(currentAncestor.parentId)
        currentAncestor = state.nodeMap[currentAncestor.parentId]
    }

    let items = state.itemList
    while (ancestors.length > 0) {
        const ancestor = ancestors.shift()!;
        items = state.itemList.find(item => item)
    }

    console.log(node.id, ancestors)
};
