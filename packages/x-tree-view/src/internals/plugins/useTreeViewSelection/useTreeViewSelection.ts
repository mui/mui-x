import * as React from 'react';
import { TreeViewPlugin, TreeViewItemRange } from '../../models';
import {
  populateInstance,
  getNextNode,
  getFirstNode,
  getLastNode,
} from '../../useTreeView/useTreeView.utils';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';
import { findOrderInTremauxTree } from './useTreeViewSelection.utils';

export const useTreeViewSelection: TreeViewPlugin<UseTreeViewSelectionSignature> = ({
  instance,
  params,
  models,
}) => {
  const lastSelectedNode = React.useRef<string | null>(null);
  const lastSelectionWasRange = React.useRef(false);
  const currentRangeSelection = React.useRef<string[]>([]);

  const setSelectedNodes = (event: React.SyntheticEvent, value: typeof params.defaultSelected) => {
    models.selected.setControlledValue(value);
    params.onNodeSelect?.(event, value);
  };

  const isNodeSelected = (nodeId: string) =>
    Array.isArray(models.selected.value)
      ? models.selected.value.indexOf(nodeId) !== -1
      : models.selected.value === nodeId;

  const selectNode = (event: React.SyntheticEvent, nodeId: string, multiple = false) => {
    if (params.disableSelection) {
      return;
    }

    if (multiple) {
      if (Array.isArray(models.selected.value)) {
        let newSelected: string[];
        if (models.selected.value.indexOf(nodeId) !== -1) {
          newSelected = models.selected.value.filter((id) => id !== nodeId);
        } else {
          newSelected = [nodeId].concat(models.selected.value);
        }

        setSelectedNodes(event, newSelected);
      }
    } else {
      const newSelected = params.multiSelect ? [nodeId] : nodeId;
      setSelectedNodes(event, newSelected);
    }
    lastSelectedNode.current = nodeId;
    lastSelectionWasRange.current = false;
    currentRangeSelection.current = [];
  };

  const getNodesInRange = (nodeAId: string, nodeBId: string) => {
    const [first, last] = findOrderInTremauxTree(instance, nodeAId, nodeBId);
    const nodes = [first];

    let current = first;

    while (current !== last) {
      current = getNextNode(instance, current)!;
      nodes.push(current);
    }

    return nodes;
  };

  const handleRangeArrowSelect = (event: React.SyntheticEvent, nodes: TreeViewItemRange) => {
    let base = (models.selected.value as string[]).slice();
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
    setSelectedNodes(event, base);
  };

  const handleRangeSelect = (
    event: React.SyntheticEvent,
    nodes: { start: string; end: string },
  ) => {
    let base = (models.selected.value as string[]).slice();
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
    setSelectedNodes(event, newSelected);
  };

  const selectRange = (event: React.SyntheticEvent, nodes: TreeViewItemRange, stacked = false) => {
    if (params.disableSelection) {
      return;
    }

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

  populateInstance<UseTreeViewSelectionSignature>(instance, {
    isNodeSelected,
    selectNode,
    selectRange,
    rangeSelectToLast,
    rangeSelectToFirst,
  });

  return {
    getRootProps: () => ({
      'aria-multiselectable': params.multiSelect,
    }),
  };
};

useTreeViewSelection.models = {
  selected: {
    getDefaultValue: (params) => params.defaultSelected,
  },
};

const DEFAULT_SELECTED: string[] = [];

useTreeViewSelection.getDefaultizedParams = (params) => ({
  ...params,
  disableSelection: params.disableSelection ?? false,
  multiSelect: params.multiSelect ?? false,
  defaultSelected: params.defaultSelected ?? (params.multiSelect ? DEFAULT_SELECTED : null),
});
