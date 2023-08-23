import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { MultiSelectTreeViewProps, TreeViewItemRange } from '../../TreeView/TreeView.types';
import { TreeViewPlugin } from '../../models';
import { populateInstance, getNextNode, getFirstNode, getLastNode } from '../useTreeView.utils';
import {
  UseTreeViewSelectionInstance,
  UseTreeViewSelectionState,
} from './useTreeViewSelection.types';

export const useTreeViewSelection: TreeViewPlugin<UseTreeViewSelectionState> = ({
  instance,
  props,
  state,
  setState,
}) => {
  const lastSelectedNode = React.useRef<string | null>(null);
  const lastSelectionWasRange = React.useRef(false);
  const currentRangeSelection = React.useRef<string[]>([]);

  const setSelectedState = (selected: string | string[] | null) =>
    setState((prevState) => ({ ...prevState, selected }));

  const isNodeSelected = useEventCallback((nodeId: string) =>
    Array.isArray(state.selected)
      ? state.selected.indexOf(nodeId) !== -1
      : state.selected === nodeId,
  );

  const selectNode = (event: React.SyntheticEvent, nodeId: string, multiple = false) => {
    if (nodeId) {
      if (multiple) {
        if (Array.isArray(state.selected)) {
          let newSelected: string[];
          if (state.selected.indexOf(nodeId) !== -1) {
            newSelected = state.selected.filter((id) => id !== nodeId);
          } else {
            newSelected = [nodeId].concat(state.selected);
          }

          if (props.onNodeSelect) {
            (props.onNodeSelect as MultiSelectTreeViewProps['onNodeSelect'])!(event, newSelected);
          }

          setSelectedState(newSelected);
        }
      } else {
        const newSelected = props.multiSelect ? [nodeId] : nodeId;

        if (props.onNodeSelect) {
          props.onNodeSelect(event, newSelected as string & string[]);
        }

        setSelectedState(newSelected);
      }
      lastSelectedNode.current = nodeId;
      lastSelectionWasRange.current = false;
      currentRangeSelection.current = [];

      return true;
    }

    return false;
  };

  /**
   * This is used to determine the start and end of a selection range so
   * we can get the nodes between the two border nodes.
   *
   * It finds the nodes' common ancestor using
   * a naive implementation of a lowest common ancestor algorithm
   * (https://en.wikipedia.org/wiki/Lowest_common_ancestor).
   * Then compares the ancestor's 2 children that are ancestors of nodeA and NodeB
   * so we can compare their indexes to work out which node comes first in a depth first search.
   * (https://en.wikipedia.org/wiki/Depth-first_search)
   *
   * Another way to put it is which node is shallower in a trémaux tree
   * https://en.wikipedia.org/wiki/Tr%C3%A9maux_tree
   */
  const findOrderInTremauxTree = (nodeAId: string, nodeBId: string) => {
    if (nodeAId === nodeBId) {
      return [nodeAId, nodeBId];
    }

    const nodeA = instance.nodeMap[nodeAId];
    const nodeB = instance.nodeMap[nodeBId];

    if (nodeA.parentId === nodeB.id || nodeB.parentId === nodeA.id) {
      return nodeB.parentId === nodeA.id ? [nodeA.id, nodeB.id] : [nodeB.id, nodeA.id];
    }

    const aFamily: (string | null)[] = [nodeA.id];
    const bFamily: (string | null)[] = [nodeB.id];

    let aAncestor = nodeA.parentId;
    let bAncestor = nodeB.parentId;

    let aAncestorIsCommon = bFamily.indexOf(aAncestor) !== -1;
    let bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;

    let continueA = true;
    let continueB = true;

    while (!bAncestorIsCommon && !aAncestorIsCommon) {
      if (continueA) {
        aFamily.push(aAncestor);
        aAncestorIsCommon = bFamily.indexOf(aAncestor) !== -1;
        continueA = aAncestor !== null;
        if (!aAncestorIsCommon && continueA) {
          aAncestor = instance.nodeMap[aAncestor!].parentId;
        }
      }

      if (continueB && !aAncestorIsCommon) {
        bFamily.push(bAncestor);
        bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;
        continueB = bAncestor !== null;
        if (!bAncestorIsCommon && continueB) {
          bAncestor = instance.nodeMap[bAncestor!].parentId;
        }
      }
    }

    const commonAncestor = aAncestorIsCommon ? aAncestor : bAncestor;
    const ancestorFamily = instance.getChildrenIds(commonAncestor);

    const aSide = aFamily[aFamily.indexOf(commonAncestor) - 1];
    const bSide = bFamily[bFamily.indexOf(commonAncestor) - 1];

    return ancestorFamily.indexOf(aSide!) < ancestorFamily.indexOf(bSide!)
      ? [nodeAId, nodeBId]
      : [nodeBId, nodeAId];
  };

  const getNodesInRange = (nodeAId: string, nodeBId: string) => {
    const [first, last] = findOrderInTremauxTree(nodeAId, nodeBId);
    const nodes = [first];

    let current = first;

    while (current !== last) {
      current = getNextNode(instance, current)!;
      nodes.push(current);
    }

    return nodes;
  };

  const handleRangeArrowSelect = (event: React.SyntheticEvent, nodes: TreeViewItemRange) => {
    let base = (state.selected as string[]).slice();
    const { start, next, current } = nodes;

    if (!next || !current) {
      return;
    }

    if (currentRangeSelection.current.indexOf(current) === -1) {
      currentRangeSelection.current = [];
    }

    if (lastSelectionWasRange.current) {
      if (currentRangeSelection.current.indexOf(next) !== -1) {
        base = base.filter((id) => id === start || id !== current);
        currentRangeSelection.current = currentRangeSelection.current.filter(
          (id) => id === start || id !== current,
        );
      } else {
        base.push(next);
        currentRangeSelection.current.push(next);
      }
    } else {
      base.push(next);
      currentRangeSelection.current.push(current, next);
    }

    if (props.onNodeSelect) {
      (props.onNodeSelect as MultiSelectTreeViewProps['onNodeSelect'])!(event, base);
    }

    setSelectedState(base);
  };

  const handleRangeSelect = (
    event: React.SyntheticEvent,
    nodes: { start: string; end: string },
  ) => {
    let base = (state.selected as string[]).slice();
    const { start, end } = nodes;
    // If last selection was a range selection ignore nodes that were selected.
    if (lastSelectionWasRange.current) {
      base = base.filter((id) => currentRangeSelection.current.indexOf(id) === -1);
    }

    let range = getNodesInRange(start, end);
    range = range.filter((node) => !instance.isNodeDisabled(node));
    currentRangeSelection.current = range;
    let newSelected = base.concat(range);
    newSelected = newSelected.filter((id, i) => newSelected.indexOf(id) === i);

    if (props.onNodeSelect) {
      (props.onNodeSelect as MultiSelectTreeViewProps['onNodeSelect'])!(event, newSelected);
    }

    setSelectedState(newSelected);
  };

  const selectRange = (event: React.SyntheticEvent, nodes: TreeViewItemRange, stacked = false) => {
    const { start = lastSelectedNode.current, end, current } = nodes;
    if (stacked) {
      handleRangeArrowSelect(event, { start, next: end, current });
    } else if (start != null && end != null) {
      handleRangeSelect(event, { start, end });
    }
    lastSelectionWasRange.current = true;
  };

  const rangeSelectToFirst = (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => {
    if (!lastSelectedNode.current) {
      lastSelectedNode.current = nodeId;
    }

    const start = lastSelectionWasRange.current ? lastSelectedNode.current : nodeId;

    instance.selectRange(event, {
      start,
      end: getFirstNode(instance),
    });
  };

  const rangeSelectToLast = (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => {
    if (!lastSelectedNode.current) {
      lastSelectedNode.current = nodeId;
    }

    const start = lastSelectionWasRange.current ? lastSelectedNode.current : nodeId;

    instance.selectRange(event, {
      start,
      end: getLastNode(instance),
    });
  };

  populateInstance<UseTreeViewSelectionInstance>(instance, {
    isNodeSelected,
    selectNode,
    selectRange,
    rangeSelectToLast,
    rangeSelectToFirst,
  });
};

useTreeViewSelection.getInitialState = (props) => ({
  selected: props.selected ?? props.defaultSelected ?? (props.multiSelect ? [] : null),
});
