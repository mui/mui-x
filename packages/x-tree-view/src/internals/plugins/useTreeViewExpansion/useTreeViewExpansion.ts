import * as React from 'react';
import { useAssertModelConsistency } from '@mui/x-internals/useAssertModelConsistency';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { TreeViewPlugin } from '../../models';
import {
  UseTreeViewExpansionInstance,
  UseTreeViewExpansionPublicAPI,
  UseTreeViewExpansionSignature,
} from './useTreeViewExpansion.types';
import { TreeViewItemId } from '../../../models';
import { expansionSelectors } from './useTreeViewExpansion.selectors';
import { getExpansionTrigger } from './useTreeViewExpansion.utils';

export const useTreeViewExpansion: TreeViewPlugin<UseTreeViewExpansionSignature> = ({
  store,
  params,
}) => {
  return {
    publicAPI: {
      setItemExpansion,
      isItemExpanded,
    },
    instance: {},
  };
};

const DEFAULT_EXPANDED_ITEMS: string[] = [];

useTreeViewExpansion.applyDefaultValuesToParams = ({ params }) => ({
  ...params,
  defaultExpandedItems: params.defaultExpandedItems ?? DEFAULT_EXPANDED_ITEMS,
});

useTreeViewExpansion.getInitialState = (params) => ({
  expansion: {
    expandedItems:
      params.expandedItems === undefined ? params.defaultExpandedItems : params.expandedItems,
    expansionTrigger: getExpansionTrigger(params),
  },
});

useTreeViewExpansion.params = {
  expandedItems: true,
  defaultExpandedItems: true,
  onExpandedItemsChange: true,
  onItemExpansionToggle: true,
  expansionTrigger: true,
};
