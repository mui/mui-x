import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../../models';
import { populateInstance } from '../useTreeView.utils';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';

export const useTreeViewExpansion: TreeViewPlugin<UseTreeViewExpansionSignature> = ({
  instance,
  props,
  models,
}) => {
  const isNodeExpanded = React.useCallback(
    (nodeId: string) => {
      return Array.isArray(models.expanded.value)
        ? models.expanded.value.indexOf(nodeId) !== -1
        : false;
    },
    [models.expanded.value],
  );

  const isNodeExpandable = React.useCallback(
    (nodeId: string) => !!instance.getNode(nodeId)?.expandable,
    [instance],
  );

  const toggleNodeExpansion = useEventCallback(
    (event: React.SyntheticEvent, nodeId: string | null) => {
      if (nodeId == null) {
        return;
      }

      let newExpanded: string[];

      if (models.expanded.value.indexOf(nodeId!) !== -1) {
        newExpanded = models.expanded.value.filter((id) => id !== nodeId);
      } else {
        newExpanded = [nodeId].concat(models.expanded.value);
      }

      if (props.onNodeToggle) {
        props.onNodeToggle(event, newExpanded);
      }

      models.expanded.setValue(newExpanded);
    },
  );

  const expandAllSiblings = (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => {
    const node = instance.getNode(nodeId);
    const siblings = instance.getChildrenIds(node.parentId);

    const diff = siblings.filter(
      (child) => instance.isNodeExpandable(child) && !instance.isNodeExpanded(child),
    );

    const newExpanded = models.expanded.value.concat(diff);

    if (diff.length > 0) {
      models.expanded.setValue(newExpanded);

      if (props.onNodeToggle) {
        props.onNodeToggle(event, newExpanded);
      }
    }
  };

  populateInstance<UseTreeViewExpansionSignature>(instance, {
    isNodeExpanded,
    isNodeExpandable,
    toggleNodeExpansion,
    expandAllSiblings,
  });
};

useTreeViewExpansion.models = [
  { name: 'expanded', controlledProp: 'expanded', defaultProp: 'defaultExpanded' },
];
