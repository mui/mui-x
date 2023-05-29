import * as React from 'react';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '@mui/x-data-grid/internals';
import { GRID_ROOT_GROUP_ID, GridGroupNode, GridSkeletonRowNode } from '@mui/x-data-grid';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import {
  DataGridProProcessedProps,
  GridExperimentalProFeatures,
} from '../../../models/dataGridProProps';

export const GRID_SKELETON_ROW_ROOT_ID = 'auto-generated-skeleton-row-root';

const getSkeletonRowId = (index: number) => `${GRID_SKELETON_ROW_ROOT_ID}-${index}`;

export const useGridLazyLoaderPreProcessors = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'rowCount' | 'rowsLoadingMode' | 'experimentalFeatures' | 'treeData' | 'onFetchRows'
  >,
) => {
  const { lazyLoading } = (props.experimentalFeatures ?? {}) as GridExperimentalProFeatures;

  const addSkeletonRows = React.useCallback<GridPipeProcessor<'hydrateRows'>>(
    (groupingParams) => {
      const tree = { ...groupingParams.tree };
      const rootGroup = tree[GRID_ROOT_GROUP_ID] as GridGroupNode;

      if (
        !lazyLoading ||
        props.rowsLoadingMode !== 'server' ||
        !props.rowCount ||
        rootGroup.children.length >= props.rowCount ||
        !props.onFetchRows ||
        // To avoid situations like https://codesandbox.io/s/nice-yalow-dkfb5n
        // TODO: To remove when `treeData` supports (root level) lazy-loading
        props.treeData
      ) {
        return groupingParams;
      }

      const rootGroupChildren = [...rootGroup.children];

      for (let i = 0; i < props.rowCount - rootGroup.children.length; i += 1) {
        const skeletonId = getSkeletonRowId(i);

        rootGroupChildren.push(skeletonId);

        const skeletonRowNode: GridSkeletonRowNode = {
          type: 'skeletonRow',
          id: skeletonId,
          parent: GRID_ROOT_GROUP_ID,
          depth: 0,
        };

        tree[skeletonId] = skeletonRowNode;
      }

      tree[GRID_ROOT_GROUP_ID] = { ...rootGroup, children: rootGroupChildren };

      return {
        ...groupingParams,
        tree,
      };
    },
    [props.rowCount, props.rowsLoadingMode, lazyLoading, props.treeData, props.onFetchRows],
  );

  useGridRegisterPipeProcessor(privateApiRef, 'hydrateRows', addSkeletonRows);
};
